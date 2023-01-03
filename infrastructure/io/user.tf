resource "aws_sns_topic" "topic" {
  name         = "clock-up-user-${var.stage}"
  display_name = "clock-up users topic."
}

resource "aws_sqs_queue" "create" {
  name = "clock-up-user-${var.stage}-create"
}

resource "aws_sns_topic_subscription" "topic_subscription_for_create_messages" {
  topic_arn           = aws_sns_topic.topic.arn
  protocol            = "sqs"
  endpoint            = aws_sqs_queue.create.arn
  filter_policy       = jsonencode({ type = ["CREATE"] })
  filter_policy_scope = "MessageAttributes"
}

resource "aws_ssm_parameter" "topic_arn" {
  name  = "/clock-up/${var.stage}/user/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.topic.arn
}
