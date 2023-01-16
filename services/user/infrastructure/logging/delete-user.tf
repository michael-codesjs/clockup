resource "aws_cloudwatch_log_group" "delete_user_log_group" {
  name = "/aws/step-functions/clock-up-user-${var.stage}-deleteUser"
  tags = {
    Environment = var.stage
    Application = "clock-up"
    Service     = "user"
    Description = "Log group for the DeleteUser state machine in ${var.stage}"
  }
}

resource "aws_ssm_parameter" "delete_user_log_group_arn" {
  name = "/clock-up/${var.stage}/user/log-groups/delete-user/arn"
  value = aws_cloudwatch_log_group.delete_user_log_group.arn
  type = "SecureString"
}
