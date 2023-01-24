resource "aws_internet_gateway" "internet_gateway" {

  vpc_id = aws_vpc.vpc.id

  tags = {
    Name        = "clockup-${var.stage}"
    Application = "clockup-${var.stage}"
    Stage       = var.stage
    Description = "clockup VPC Internet Gateway in ${var.stage}."
  }

}

resource "aws_ssm_parameter" "internet_gateway_id" {
  name  = "/clockup/${var.stage}/network/internet-gateway/id"
  type  = "SecureString"
  value = aws_internet_gateway.internet_gateway.id
}
