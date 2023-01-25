resource "aws_sns_topic" "user_topic" {
  name         = "clockup-user-${var.stage}"
  display_name = "clockup users topic."
}

resource "aws_sqs_queue" "user_request_queue" {
  name                      = "clockup-user-request-${var.stage}"
  receive_wait_time_seconds = 20
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_request_dead_letter_queue.arn
    maxReceiveCount     = 1
  })
  tags = {
    Environment = var.stage
    Description = "clockup ${var.stage} user service request queue."
  }
}

resource "aws_sqs_queue_policy" "vpc_request_queue_policy" {
  queue_url = aws_sqs_queue.user_request_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid = "VPCStatement",
      Effect = "Allow",
      Principal = "*",
      Action = "sqs:*",
      Resource = aws_sqs_queue.user_request_queue.id,
      Condition = {
        ArnLike = {
          "aws:SourceArn" = var.vpc_arn
        }
      }
    }]
  })
}

resource "aws_sqs_queue" "user_request_dead_letter_queue" {
  name = "clockup-user-request-dead-letter-${var.stage}"
  tags = {
    Enviroment  = var.stage
    Description = "clockup ${var.stage} user service request dead letter queue."
  }
}

resource "aws_sqs_queue" "user_response_queue" {
  name                      = "clockup-user-response-${var.stage}"
  receive_wait_time_seconds = 20
  tags = {
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
    Enviroment  = var.stage
    Description = "clockup ${var.stage} user service response dead letter queue."
  }
}

resource "aws_ssm_parameter" "user_topic_arn" {
  name  = "/clockup/${var.stage}/user/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.user_topic.arn
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
