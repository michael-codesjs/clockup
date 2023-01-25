resource "aws_security_group" "security_group" {

  name        = "clockup-user-${var.stage}"
  description = "clockup user service security group."
  vpc_id      = var.vpc_id

  tags = {
    Name        = "clockup-user"
    Application = "clockup"
    Service = "user"
    Stage       = var.stage
    Description = "clockup"
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

resource "aws_vpc_endpoint_security_group_association" "sqs_endpoint_security_group_association" {
  vpc_endpoint_id   = data.aws_vpc_endpoint.sqs_endpoint.id
  security_group_id = aws_security_group.security_group.id
}

resource "aws_ssm_parameter" "security_group_id" {
  type  = "SecureString"
  name  = "/clockup/${var.stage}/user/network/security-group/id"
  value = aws_security_group.security_group.id
}
