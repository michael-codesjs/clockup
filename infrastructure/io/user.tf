resource "aws_sns_topic" "user_topic" {
  name         = "clock-up-user-${var.stage}"
  display_name = "clock-up users topic."
}

resource "aws_sqs_queue" "user_request_queue" {
  name                      = "clock-up-user-request-${var.stage}"
  receive_wait_time_seconds = 20
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_request_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
  tags = {
    Environment = var.stage
    Description = "clock-up ${var.stage} user service request queue."
  }
}

resource "aws_sqs_queue" "user_request_dead_letter_queue" {
  name = "clock-up-user-request-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clock-up ${var.stage} user service request dead letter queue."
  }
}

resource "aws_sqs_queue" "user_response_queue" {
  name                      = "clock-up-user-response-${var.stage}"
  receive_wait_time_seconds = 20
  tags = {
    Environment = var.stage
    Description = "clock-up ${var.stage} user service response queue."
  }
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_response_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "user_response_dead_letter_queue" {
  name = "clock-up-user-response-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clock-up ${var.stage} user service response dead letter queue."
  }
}

resource "aws_ssm_parameter" "user_topic_arn" {
  name  = "/clock-up/${var.stage}/user/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.user_topic.arn
}

resource "aws_ssm_parameter" "user_request_queue_arn" {
  name  = "/clock-up/${var.stage}/user/queues/request/arn"
  type  = "SecureString"
  value = aws_sqs_queue.user_request_queue.arn
}

resource "aws_ssm_parameter" "user_request_queue_url" {
  name  = "/clock-up/${var.stage}/user/queues/request/url"
  type  = "SecureString"
  value = aws_sqs_queue.user_request_queue.url
}

resource "aws_ssm_parameter" "user_response_queue_arn" {
  name  = "/clock-up/${var.stage}/user/queues/response/arn"
  type  = "SecureString"
  value = aws_sqs_queue.user_response_queue.arn
}

resource "aws_ssm_parameter" "user_response_queue_url" {
  name  = "/clock-up/${var.stage}/user/queues/response/url"
  type  = "SecureString"
  value = aws_sqs_queue.user_response_queue.url
}
