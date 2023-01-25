variable "stage" {
  type        = string
  nullable    = false
  description = "Stage the network infrastructure is created in."
}

variable "region" {
  type        = string
  nullable    = false
  description = "Region the network infrastructure is created in."
}

variable "vpc_id" {
  type        = string
  nullable    = false
  description = "Clockup vpc id."
}

data "aws_ssm_parameter" "user_sqs_request_queue_arn" {
  name = "/clockup/${var.stage}/user/queues/request/arn"
}

data "aws_ssm_parameter" "user_sqs_request_queue_url" {
  name = "/clockup/${var.stage}/user/queues/request/url"
}

data "aws_vpc_endpoint" "sqs_endpoint" {
  vpc_id       = var.vpc_id
  service_name = "com.amazonaws.${var.region}.sqs"
}