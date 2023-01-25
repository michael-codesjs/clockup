resource "aws_sns_topic" "real_time_topic" {
  name         = "clockup-real-time-${var.stage}"
  display_name = "clockup real-time topic."
}

resource "aws_sqs_queue" "real_time_request_queue" {
  name                      = "clockup-real-time-request-${var.stage}"
  receive_wait_time_seconds = 20
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.real_time_request_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
  tags = {
    Environment = var.stage
    Description = "clockup ${var.stage} real-time service request queue."
  }
}

resource "aws_sqs_queue" "real_time_request_dead_letter_queue" {
  name = "clockup-real-time-request-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clockup ${var.stage} real-time service request dead letter queue."
  }
}

resource "aws_sqs_queue" "real_time_response_queue" {
  name                      = "clockup-real-time-response-${var.stage}"
  receive_wait_time_seconds = 20
  tags = {
    Environment = var.stage
    Description = "clockup ${var.stage} real-time service response queue."
  }
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.real_time_response_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "real_time_response_dead_letter_queue" {
  name = "clockup-real-time-response-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clockup ${var.stage} real-time service response dead letter queue."
  }
}

resource "aws_ssm_parameter" "real_time_topic_arn" {
  name  = "/clockup/${var.stage}/real-time/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.real_time_topic.arn
}

resource "aws_ssm_parameter" "real_time_request_queue_arn" {
  name  = "/clockup/${var.stage}/real-time/queues/request/arn"
  type  = "SecureString"
  value = aws_sqs_queue.real_time_request_queue.arn
}

resource "aws_ssm_parameter" "real_time_request_queue_url" {
  name  = "/clockup/${var.stage}/real-time/queues/request/url"
  type  = "SecureString"
  value = aws_sqs_queue.real_time_request_queue.url
}

resource "aws_ssm_parameter" "real_time_response_queue_arn" {
  name  = "/clockup/${var.stage}/real-time/queues/response/arn"
  type  = "SecureString"
  value = aws_sqs_queue.real_time_response_queue.arn
}

resource "aws_ssm_parameter" "real_time_response_queue_url" {
  name  = "/clockup/${var.stage}/real-time/queues/response/url"
  type  = "SecureString"
  value = aws_sqs_queue.real_time_response_queue.url
}
