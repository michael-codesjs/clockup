variable "stage" {
  type        = string
  nullable    = false
  description = "Stage the authentication service vpc endpoints are created in."
}

variable "region" {
  type        = string
  nullable    = false
  description = "Region the authentication service vpc endpoints are created in."
}

variable "vpc_id" {
  type        = string
  nullable    = false
  description = "clockup vpc id."
}

variable "subnet_id" {
  type        = string
  nullable    = false
  description = "clockup authentication service subnet id."
}

variable "security_group_id" {
  type        = string
  nullable    = false
  description = "clockup authentication subnet security_group id."
}

data "aws_ssm_parameter" "user_sqs_request_queue_arn" {
  name = "/clockup/${var.stage}/user/queues/request/arn"
}

data "aws_ssm_parameter" "user_sqs_request_queue_url" {
  name = "/clockup/${var.stage}/user/queues/request/url"
}
