resource "aws_appsync_graphql_api" "api" {

  name                = "clock-up-api-${var.stage}"
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  schema              = file("${path.module}/../../schema.graphql")

  user_pool_config {
    aws_region     = var.region
    default_action = "DENY"
    user_pool_id   = var.cognito_user_pool_id
  }

}

resource "aws_ssm_parameter" "apiId" {
  name  = "/clock-up/${var.stage}/api/graphql/id"
  type  = "String"
  value = aws_appsync_graphql_api.api.id
}

resource "aws_ssm_parameter" "apiEndpoint" {
  name  = "/clock-up/${var.stage}/api/graphql/endpoint"
  type  = "String"
  value = aws_appsync_graphql_api.api.uris["GRAPHQL"]
}
