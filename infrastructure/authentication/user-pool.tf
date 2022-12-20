// the user pool is gonna be created using cloud formation.
// reason being, we can not provide a lambda name as a value in the lambda config using tf
// but we can do so using cloud formation.

resource "aws_cognito_user_pool" "user_pool" {

  name                = "clock-up-user-pool-${var.stage}"
  username_attributes = ["email"]

  password_policy {
    minimum_length    = 7
    require_lowercase = false
    require_uppercase = false
    require_symbols   = false
    require_numbers   = false
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

}

resource "aws_ssm_parameter" "userPoolName" {
  name  = "/clock-up/${var.stage}/authentication/user-pool/name"
  type  = "String"
  value = aws_cognito_user_pool.user_pool.name
}

resource "aws_ssm_parameter" "userPoolId" {
  name  = "/clock-up/${var.stage}/authentication/user-pool/id"
  type  = "String"
  value = aws_cognito_user_pool.user_pool.id
}

resource "aws_ssm_parameter" "userPoolARN" {
  name  = "/clock-up/${var.stage}/authentication/user-pool/arn"
  type  = "String"
  value = aws_cognito_user_pool.user_pool.arn
}

output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.user_pool.id
  description = "Cognito user pool ID."
}
