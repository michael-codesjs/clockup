resource "aws_sqs_queue" "test_queue" {
  name                      = "clock-up-test-${var.stage}"
  receive_wait_time_seconds = 20
  tags = {
    Environment = var.stage
    Description = "clock-up ${var.stage} test queue for testing shared components."
  }
}

resource "aws_ssm_parameter" "test_queue_arn" {
  name  = "/clock-up/${var.stage}/test/queue/arn"
  type  = "SecureString"
  value = aws_sqs_queue.test_queue.arn
}

resource "aws_ssm_parameter" "test_response_queue_url" {
  name  = "/clock-up/${var.stage}/test/queue/url"
  type  = "SecureString"
  value = aws_sqs_queue.test_queue.url
}
