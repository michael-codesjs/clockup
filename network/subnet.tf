resource "aws_subnet" "subnet" {

  vpc_id                  = var.vpc_id
  cidr_block              = "10.0.0.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name        = "clockup-authentication-${var.stage}"
    Application = "clockup-${var.stage}"
    Stage       = var.stage
    Description = "clockup authentication subnet in ${var.stage}."
  }

}

resource "aws_route_table_association" "route_table_association" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = var.route_table_id
}

resource "aws_ssm_parameter" "subnet_id" {
  name  = "/clockup/${var.stage}/authentication/network/subnet/id"
  type  = "SecureString"
  value = aws_subnet.subnet.id
}