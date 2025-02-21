resource "aws_api_gateway_deployment" "transaction_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.transaction_api.id

  depends_on = [
    aws_api_gateway_integration.post_lambda_integration,
    aws_api_gateway_integration.get_lambda_integration,
    aws_api_gateway_integration.get_balance_lambda_integration
  ]
}

resource "aws_api_gateway_stage" "transaction_api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.transaction_api.id
  stage_name    = var.stage_name
  deployment_id = aws_api_gateway_deployment.transaction_api_deployment.id
}