resource "aws_sns_topic" "user_topic" {

  name         = "clockup-user-${var.stage}"
  display_name = "clockup users topic."

  tags = {
    Application = "clockup"
    Service     = "user"
    Environment = var.stage
    Description = "clockup ${var.stage} user service topic."
  }

}

resource "aws_ssm_parameter" "user_topic_arn" {
  name  = "/clockup/${var.stage}/user/topic/arn"
  type  = "SecureString"
  value = aws_sns_topic.user_topic.arn
}
