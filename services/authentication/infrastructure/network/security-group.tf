resource "aws_security_group" "security_group" {

  name        = "clockup-authentication"
  description = "clockup authentication service security group ${var.stage}."
  vpc_id      = var.vpc_id

  tags = {
    Name        = "clockup-${var.stage}-authentication"
    Application = "clockup-${var.stage}"
    Service     = "authentiction"
    Stage       = var.stage
    Description = "clockup authentication service security group ${var.stage}."
  }

  ingress {
    from_port         = 0
    to_port           = 0
    protocol          = "-1"
    cidr_blocks       = ["0.0.0.0/0"]
  }

  ingress {
    from_port         = 22
    to_port           = 22
    protocol          = "tcp"
    cidr_blocks       = ["0.0.0.0/0"]
  }

  egress {
    cidr_blocks       = ["0.0.0.0/0"]
    protocol          = -1
    from_port         = 0
    to_port           = 0
  }

}

resource "aws_ssm_parameter" "security_group_id" {
  type  = "SecureString"
  name  = "/clockup/${var.stage}/authentication/network/security-group/id"
  value = aws_security_group.security_group.id
}
