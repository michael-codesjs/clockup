resource "aws_appsync_graphql_api" "graphql_api" {

  name                = "clock-up-api-${var.stage}"
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  schema              = file("${path.module}/../../shared/graphql/schema.graphql")

  user_pool_config {
    aws_region     = var.region
    default_action = "ALLOW"
    user_pool_id   = var.cognito_user_pool_id
  }

  additional_authentication_provider {
    authentication_type = "AWS_IAM"
  }

}

resource "aws_ssm_parameter" "graphql_api_id" {
  name  = "/clock-up/${var.stage}/api/graphql/id"
  type  = "SecureString"
  value = aws_appsync_graphql_api.graphql_api.id
}

resource "aws_ssm_parameter" "graphql_api_endpoint" {
  name  = "/clock-up/${var.stage}/api/graphql/endpoint"
  type  = "String"
  value = aws_appsync_graphql_api.graphql_api.uris["GRAPHQL"]
}
