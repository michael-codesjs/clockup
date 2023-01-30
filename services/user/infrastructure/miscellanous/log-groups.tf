resource "aws_cloudwatch_log_group" "delete_state_machine_user_log_group" {
  name = "/aws/step-functions/clockup-user-${var.stage}-deleteUser"
  tags = {
    Environment = var.stage
    Application = "clockup"
    Service     = "user"
    Description = "Log group for the DeleteUser state machine in ${var.stage}"
  }
}

resource "aws_cloudwatch_log_group" "update_user_state_machine_log_group" {
  name = "/aws/step-functions/clockup-user-${var.stage}-updateUser"
  tags = {
    Environment = var.stage
    Application = "clockup"
    Service     = "user"
    Description = "Log group for the UpdateUser state machine in ${var.stage}"
  }
}

resource "aws_ssm_parameter" "delete_user_state_machine_log_group_arn" {
  name = "/clockup/${var.stage}/user/log-groups/delete-user/arn"
  value = aws_cloudwatch_log_group.delete_state_machine_user_log_group.arn
  type = "SecureString"
}

resource "aws_ssm_parameter" "delete_user_log_group_arn" {
  name = "/clockup/${var.stage}/user/log-groups/update-user/arn"
  value = aws_cloudwatch_log_group.update_user_state_machine_log_group.arn
  type = "SecureString"
}