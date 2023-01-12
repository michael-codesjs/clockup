resource "aws_appsync_graphql_api" "graphql_api" {

  name                = "clock-up-api-${var.stage}"
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  schema              = file("${path.module}/../../shared/graphql/schema.graphql")

  tags = {
    "description" = "clock-up ${var.stage} GraphQL API"
  }

  user_pool_config {
    aws_region     = var.region
    default_action = "ALLOW"
    user_pool_id   = var.cognito_user_pool_id
  }

  additional_authentication_provider {
    authentication_type = "AWS_IAM"
  }

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.log_role.arn
    field_log_level          = "ALL"
  }

}

resource "aws_iam_role" "log_role" {
  name = "example"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service : "appsync.amazonaws.com"
      },
      Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "log_policy_statement" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
  role       = aws_iam_role.log_role.name
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
