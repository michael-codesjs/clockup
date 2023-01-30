resource "aws_sqs_queue" "user_response_queue" {
  name                      = "clockup-user-response-${var.stage}"
  receive_wait_time_seconds = 20
  tags = {
    Application = "clockup"
    Service     = "user"
    Environment = var.stage
    Description = "clockup ${var.stage} user service response queue."
  }
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_response_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "user_response_dead_letter_queue" {
  name = "clockup-user-response-dead-letter-${var.stage}"
  tags = {
    Application = "clockup"
    Service     = "user"
    Enviroment  = var.stage
    Description = "clockup ${var.stage} user service response dead letter queue."
  }
}


resource "aws_ssm_parameter" "user_response_queue_arn" {
  name  = "/clockup/${var.stage}/user/queues/response/arn"
  type  = "SecureString"
  value = aws_sqs_queue.user_response_queue.arn
}

resource "aws_ssm_parameter" "user_response_queue_url" {
  name  = "/clockup/${var.stage}/user/queues/response/url"
  type  = "SecureString"
  value = aws_sqs_queue.user_response_queue.url
}
