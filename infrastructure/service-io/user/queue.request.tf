resource "aws_sqs_queue" "user_request_queue" {
  name                      = "clockup-user-request-${var.stage}"
  receive_wait_time_seconds = 20
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_request_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
  tags = {
    Application = "clockup"
    Service     = "user"
    Environment = var.stage
    Description = "clockup ${var.stage} user service request queue."
  }
}

resource "aws_sqs_queue" "user_request_dead_letter_queue" {
  name = "clockup-user-request-dead-letter-${var.stage}"
  tags = {
    Application = "clockup"
    Service     = "user"
    Enviroment  = var.stage
    Description = "clockup ${var.stage} user service request dead letter queue."
  }
}

resource "aws_ssm_parameter" "user_request_queue_arn" {
  name  = "/clockup/${var.stage}/user/queues/request/arn"
  type  = "SecureString"
  value = aws_sqs_queue.user_request_queue.arn
}

resource "aws_ssm_parameter" "user_request_queue_url" {
  name  = "/clockup/${var.stage}/user/queues/request/url"
  type  = "SecureString"
  value = aws_sqs_queue.user_request_queue.url
}
