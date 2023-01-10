resource "aws_cognito_user_pool_client" "user_pool_web_client" {

  name                = "web"
  user_pool_id        = aws_cognito_user_pool.user_pool.id
  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]

}

resource "aws_ssm_parameter" "userPoolWebClientId" {
  name  = "/clock-up/${var.stage}/authentication/user-pool/client/web/id"
  type  = "String"
  value = aws_cognito_user_pool_client.user_pool_web_client.id
}
