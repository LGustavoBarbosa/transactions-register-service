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

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name               = "UserIdCreatedAtIndex"
    hash_key           = "userId"
    range_key          = "createdAt"
    projection_type    = "ALL"
  }

  tags = {
    Name = "TransactionsTable"
  }
}