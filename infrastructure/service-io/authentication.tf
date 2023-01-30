resource "aws_sns_topic" "authentication_topic" {
  name         = "clockup-authentication-${var.stage}"
  display_name = "clockup ${var.stage} authentication topic."
}

resource "aws_sqs_queue" "authentication_request_queue" {
  name                      = "clockup-authentication-request-${var.stage}"
  receive_wait_time_seconds = 20
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.authentication_request_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
  tags = {
    Environment = var.stage
    Description = "clockup ${var.stage} authentication service request queue."
  }
}

resource "aws_sqs_queue" "authentication_request_dead_letter_queue" {
  name = "clockup-authentication-request-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clockup ${var.stage} authentication service request dead letter queue."
  }
}

resource "aws_sqs_queue" "authentication_response_queue" {
  name                      = "clockup-authentication-response-${var.stage}"
  receive_wait_time_seconds = 20
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.authentication_response_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
  tags = {
    Environment = var.stage
    Description = "clockup ${var.stage} authentication service response queue."
  }
}

resource "aws_sqs_queue" "authentication_response_dead_letter_queue" {
  name = "clockup-authentication-response-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clockup ${var.stage} authentication service response dead letter queue."
  }
}

resource "aws_ssm_parameter" "authentication_topic_arn" {
  name  = "/clockup/${var.stage}/authentication/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.authentication_topic.arn
}

resource "aws_ssm_parameter" "authentication_request_queue_arn" {
  name  = "/clockup/${var.stage}/authentication/queues/request/arn"
  type  = "SecureString"
  value = aws_sqs_queue.authentication_request_queue.arn
}

resource "aws_ssm_parameter" "authentication_request_queue_url" {
  name  = "/clockup/${var.stage}/authentication/queues/request/url"
  type  = "SecureString"
  value = aws_sqs_queue.authentication_request_queue.url
}

resource "aws_ssm_parameter" "authentication_response_queue_arn" {
  name  = "/clockup/${var.stage}/authentication/queues/response/arn"
  type  = "SecureString"
  value = aws_sqs_queue.authentication_response_queue.arn
}

resource "aws_ssm_parameter" "authentication_response_queue_url" {
  name  = "/clockup/${var.stage}/authentication/queues/response/url"
  type  = "SecureString"
  value = aws_sqs_queue.authentication_response_queue.url
}
