# API Gateway REST API for synchronous communication with the user service.
resource "aws_api_gateway_rest_api" "user_api" {

  name        = "clockup-user"
  description = "REST API for synchronous communication with the user service."

  binary_media_types = ["*"]

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Application = "clockup"
    Service     = "user"
    Enviroment  = var.stage
    Description = "clockup REST API for synchronous communication with the user service."
  }

}

resource "aws_api_gateway_resource" "user_api_index_resource" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "mock"
}

resource "aws_api_gateway_method" "user_api_index_resource_method" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user_api_index_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_api_index_gateway_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user_api_index_resource.id
  http_method = aws_api_gateway_method.user_api_index_resource_method.http_method
  type        = "MOCK"
}

resource "aws_api_gateway_deployment" "user_api_deployment" {

  depends_on = [
    aws_api_gateway_method.user_api_index_resource_method,
  ]

  stage_name = var.stage
  rest_api_id = aws_api_gateway_rest_api.user_api.id

  stage_description = timestamp()                  # forces to create a new deployment on each run https://github.com/hashicorp/terraform/issues/6613#issuecomment-289799360
  description       = "Deployed at ${timestamp()}" # just some comment field which can be seen in deployment history

  lifecycle {
    create_before_destroy = true
  }

}

resource "aws_ssm_parameter" "user_api_id" {
  name  = "/clockup/${var.stage}/user/api/id"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.user_api.id
}

resource "aws_ssm_parameter" "user_api_root_resource_id" {
  name  = "/clockup/${var.stage}/user/api/root-resource-id"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.user_api.root_resource_id
}

resource "aws_ssm_parameter" "user_api_arn" {
  name  = "/clockup/${var.stage}/user/api/arn"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.user_api.arn
}

resource "aws_ssm_parameter" "user_api_execution_arn" {
  name  = "/clockup/${var.stage}/user/api/api_execution_arn"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.user_api.execution_arn
}

resource "aws_ssm_parameter" "user_api_url" {
  name  = "/clockup/${var.stage}/user/api/url"
  type  = "SecureString"
  value = aws_api_gateway_deployment.user_api_deployment.invoke_url
}
