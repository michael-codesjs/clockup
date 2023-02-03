# API Gateway REST API for synchronous communication with the authentication service.
resource "aws_api_gateway_rest_api" "authentication_api" {

  name        = "clockup-authentication"
  description = "REST API for synchronous communication with the authentication service."

  binary_media_types = ["*"]

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Application = "clockup"
    Service     = "authentication"
    Enviroment  = var.stage
    Description = "clockup REST API for synchronous communication with the authentication service."
  }

}

resource "aws_api_gateway_resource" "authentication_api_index_resource" {
  rest_api_id = aws_api_gateway_rest_api.authentication_api.id
  parent_id   = aws_api_gateway_rest_api.authentication_api.root_resource_id
  path_part   = "mock"
}

resource "aws_api_gateway_method" "authentication_api_index_resource_method" {
  rest_api_id   = aws_api_gateway_rest_api.authentication_api.id
  resource_id   = aws_api_gateway_resource.authentication_api_index_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "authentication_api_index_gateway_integration" {
  rest_api_id = aws_api_gateway_rest_api.authentication_api.id
  resource_id = aws_api_gateway_resource.authentication_api_index_resource.id
  http_method = aws_api_gateway_method.authentication_api_index_resource_method.http_method
  type        = "MOCK"
}

resource "aws_api_gateway_deployment" "authentication_api_deployment" {

  depends_on = [
    aws_api_gateway_method.authentication_api_index_resource_method,
  ]

  stage_name = var.stage
  rest_api_id = aws_api_gateway_rest_api.authentication_api.id

  stage_description = timestamp()                  # forces to create a new deployment on each run https://github.com/hashicorp/terraform/issues/6613#issuecomment-289799360
  description       = "Deployed at ${timestamp()}" # just some comment field which can be seen in deployment history

  lifecycle {
    create_before_destroy = true
  }

}

resource "aws_ssm_parameter" "authentication_api_id" {
  name  = "/clockup/${var.stage}/authentication/api/id"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.authentication_api.id
}

resource "aws_ssm_parameter" "authentication_api_root_resource_id" {
  name  = "/clockup/${var.stage}/authentication/api/root-resource-id"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.authentication_api.root_resource_id
}

resource "aws_ssm_parameter" "authentication_api_arn" {
  name  = "/clockup/${var.stage}/authentication/api/arn"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.authentication_api.arn
}

resource "aws_ssm_parameter" "authentication_api_execution_arn" {
  name  = "/clockup/${var.stage}/authentication/api/api_execution_arn"
  type  = "SecureString"
  value = aws_api_gateway_rest_api.authentication_api.execution_arn
}

resource "aws_ssm_parameter" "authentication_api_url" {
  name  = "/clockup/${var.stage}/authentication/api/url"
  type  = "SecureString"
  value = aws_api_gateway_deployment.authentication_api_deployment.invoke_url
}