# DynamoDB Table for Notes
resource "aws_dynamodb_table" "notes" {
  name           = "${var.project_name}-${var.environment}-notes"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "noteId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "noteId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "StatusIndex"
    hash_key        = "userId"
    range_key       = "status"
    projection_type = "ALL"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-notes"
  }
}
