output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.main.arn
}

output "cognito_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.main.id
}

output "cognito_domain" {
  description = "Cognito Domain"
  value       = aws_cognito_user_pool_domain.main.domain
}

output "cognito_hosted_ui_url" {
  description = "Cognito Hosted UI URL"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "dynamodb_notes_table_name" {
  description = "DynamoDB Notes Table Name"
  value       = aws_dynamodb_table.notes.name
}

output "dynamodb_notes_table_arn" {
  description = "DynamoDB Notes Table ARN"
  value       = aws_dynamodb_table.notes.arn
}

output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}
