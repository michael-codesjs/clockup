resource "aws_sns_topic" "topic" {
  name = "clock-up-user-${var.stage}"
  display_name = "clock-up users topic."
}

resource "aws_ssm_parameter" "topicARN" {
  name  = "/clock-up/${var.stage}/user/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.topic.arn
}