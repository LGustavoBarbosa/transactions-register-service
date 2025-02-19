provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

resource "aws_dynamodb_table" "transactions" {
  name           = var.dynamodb_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "id"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "TransactionsTable"
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "lambda_dynamodb_policy"
  description = "IAM policy for Lambda to access DynamoDB"
  policy      = jsonencode({
    Version: "2012-10-17",
    Statement = [
      {
        Effect: "Allow",
        Action: "dynamodb:*",
        Resource: [
          aws_dynamodb_table.transactions.arn,
          "${aws_dynamodb_table.transactions.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

resource "aws_lambda_function" "transaction_handler" {
  function_name = "transaction_handler"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/server.handler"
  runtime       = "nodejs18.x"
  filename      = "lambda_function_payload.zip"
  source_code_hash = filebase64sha256("lambda_function_payload.zip")

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.transactions.name
    }
  }
}

resource "aws_api_gateway_rest_api" "transaction_api" {
  name        = "TransactionAPI"
  description = "API for transaction management"
}

resource "aws_api_gateway_resource" "transaction_resource" {
  rest_api_id = aws_api_gateway_rest_api.transaction_api.id
  parent_id   = aws_api_gateway_rest_api.transaction_api.root_resource_id
  path_part   = "transactions"
}

resource "aws_api_gateway_method" "post_transaction_method" {
  rest_api_id   = aws_api_gateway_rest_api.transaction_api.id
  resource_id   = aws_api_gateway_resource.transaction_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "get_transaction_method" {
  rest_api_id   = aws_api_gateway_rest_api.transaction_api.id
  resource_id   = aws_api_gateway_resource.transaction_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.transaction_api.id
  resource_id             = aws_api_gateway_resource.transaction_resource.id
  http_method             = aws_api_gateway_method.post_transaction_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.transaction_handler.invoke_arn
}

resource "aws_api_gateway_integration" "get_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.transaction_api.id
  resource_id             = aws_api_gateway_resource.transaction_resource.id
  http_method             = aws_api_gateway_method.get_transaction_method.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.transaction_handler.invoke_arn
}

resource "aws_api_gateway_deployment" "transaction_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.transaction_api.id

  depends_on = [
    aws_api_gateway_integration.post_lambda_integration,
    aws_api_gateway_integration.get_lambda_integration
  ]
}

resource "aws_api_gateway_stage" "transaction_api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.transaction_api.id
  stage_name    = var.stage_name
  deployment_id = aws_api_gateway_deployment.transaction_api_deployment.id
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.transaction_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.transaction_api.execution_arn}/*/*"
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.transactions.name
}

output "lambda_function_name" {
  value = aws_lambda_function.transaction_handler.function_name
}

output "api_gateway_url" {
  value = "https://${aws_api_gateway_rest_api.transaction_api.id}.execute-api.${var.aws_region}.amazonaws.com/${var.stage_name}/transactions"
}