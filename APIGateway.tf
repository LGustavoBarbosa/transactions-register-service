resource "aws_api_gateway_rest_api" "transaction_api" {
  name        = "TransactionAPI"
  description = "API for transaction management"
}

resource "aws_api_gateway_resource" "transaction_resource" {
  rest_api_id = aws_api_gateway_rest_api.transaction_api.id
  parent_id   = aws_api_gateway_rest_api.transaction_api.root_resource_id
  path_part   = "transactions"
}

resource "aws_api_gateway_resource" "transaction_balance_resource" {
  rest_api_id = aws_api_gateway_rest_api.transaction_api.id
  parent_id   = aws_api_gateway_resource.transaction_resource.id
  path_part   = "balance"
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

resource "aws_api_gateway_method" "get_balance_transaction_method" {
  rest_api_id   = aws_api_gateway_rest_api.transaction_api.id
  resource_id   = aws_api_gateway_resource.transaction_balance_resource.id
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
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.transaction_handler.invoke_arn
}

resource "aws_api_gateway_integration" "get_balance_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.transaction_api.id
  resource_id             = aws_api_gateway_resource.transaction_balance_resource.id
  http_method             = aws_api_gateway_method.get_balance_transaction_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.transaction_handler.invoke_arn
}

resource "aws_lambda_permission" "transaction_api_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.transaction_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.transaction_api.execution_arn}/*/*"
}