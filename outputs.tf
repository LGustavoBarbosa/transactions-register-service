output "dynamodb_table_name" {
  value = aws_dynamodb_table.transactions.name
}

output "lambda_function_name" {
  value = aws_lambda_function.transaction_handler.function_name
}

output "localstack_api_gateway_url" {
  value = "http://localhost:4566/${var.stage_name}/transactions"
}

output "api_gateway_rest_api_id" {
  value = aws_api_gateway_rest_api.transaction_api.id
}

output "api_gateway_endpoints" {
  value = {
    post_transaction = "http://localhost:4566/restapis/${aws_api_gateway_rest_api.transaction_api.id}/${var.stage_name}/_user_request_/transactions"
    get_transactions = "http://localhost:4566/restapis/${aws_api_gateway_rest_api.transaction_api.id}/${var.stage_name}/_user_request_/transactions?userId={userId}"
    get_balance     = "http://localhost:4566/restapis/${aws_api_gateway_rest_api.transaction_api.id}/${var.stage_name}/_user_request_/transactions/balance?userId={userId}&month={month}"
  }
}