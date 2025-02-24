provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
  endpoints {
    dynamodb    = "http://localhost:4566"
    lambda      = "http://localhost:4566"
    apigateway  = "http://localhost:4566"
    iam         = "http://localhost:4566"
  }

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  s3_use_path_style = true
}