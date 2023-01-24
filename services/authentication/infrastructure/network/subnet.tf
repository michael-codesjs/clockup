# public subnet for the service
resource "aws_subnet" "subnet" {

  vpc_id                  = var.vpc_id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name        = "clockup-authentication-${var.stage}"
    Application = "clockup"
    Service     = "authentication"
    Stage       = var.stage
    Description = "Clockup authentication subnet in ${var.stage}."
  }

}

# export subnet id to ssm
resource "aws_ssm_parameter" "subnet_id" {
  type  = "SecureString"
  name  = "/clockup/${var.stage}/authentication/network/subnet/id"
  value = aws_subnet.subnet.id
}
