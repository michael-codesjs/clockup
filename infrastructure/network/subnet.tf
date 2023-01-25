# public subnet for the service
resource "aws_subnet" "subnet" {

  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name        = "clockup"
    Application = "clockup"
    Stage       = var.stage
    Description = "clockup service subnet."
  }

}

# export subnet id to ssm
resource "aws_ssm_parameter" "subnet_id" {
  type  = "SecureString"
  name  = "/clockup/${var.stage}/network/subnet/id"
  value = aws_subnet.subnet.id
}
