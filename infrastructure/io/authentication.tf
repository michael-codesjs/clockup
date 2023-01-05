resource "aws_sns_topic" "authentication" {
  name         = "clock-up-authentication-${var.stage}"
  display_name = "clock-up authentication topic."
}

resource "aws_ssm_parameter" "authentication_topic_arn" {
  name  = "/clock-up/${var.stage}/authentication/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.authentication.arn
}
