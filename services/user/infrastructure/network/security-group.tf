resource "aws_security_group" "security_group" {

  name        = "clockup-user"
  description = "clockup user service security group ${var.stage}."
  vpc_id      = var.vpc_id

  tags = {
    Name        = "clockup-${var.stage}-user"
    Application = "clockup-${var.stage}"
    Service     = "authentiction"
    Stage       = var.stage
    Description = "clockup user service security group ${var.stage}."
  }

}

resource "aws_ssm_parameter" "security_group_id" {
  type  = "SecureString"
  name  = "/clockup/${var.stage}/user/network/security-group/id"
  value = aws_security_group.security_group.id
}
