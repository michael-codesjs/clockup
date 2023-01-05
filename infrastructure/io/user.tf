resource "aws_sns_topic" "user" {
  name         = "clock-up-user-${var.stage}"
  display_name = "clock-up users topic."
}

resource "aws_sqs_queue" "user_create" {
  name = "clock-up-user-${var.stage}-create"
}

resource "aws_sqs_queue_policy" "topic_listen_create" {

  queue_url = aws_sqs_queue.user_create.id

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "sqspolicy"
    Statement = [{
      Sid       = "First"
      Effect    = "Allow"
      Principal = "*"
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.user_create.arn
      Condition = {
        ArnEquals = {
          "aws:SourceArn" = aws_sns_topic.user.arn
        }
      }
    }]
  })

}

resource "aws_sns_topic_subscription" "topic_subscription_for_create_messages" {
  topic_arn           = aws_sns_topic.user.arn
  protocol            = "sqs"
  endpoint            = aws_sqs_queue.user_create.arn
  filter_policy       = jsonencode({ type = ["CREATE"] })
  filter_policy_scope = "MessageAttributes"
}

resource "aws_ssm_parameter" "user_topic_arn" {
  name  = "/clock-up/${var.stage}/user/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.user.arn
}

resource "aws_ssm_parameter" "create_queue_arn" {
  name  = "/clock-up/${var.stage}/user/queues/create/arn"
  type  = "SecureString"
  value = aws_sqs_queue.user_create.arn
}
