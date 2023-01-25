resource "aws_vpc_endpoint_subnet_association" "sqs_endpoint_subnet_association" {
  vpc_endpoint_id = data.aws_vpc_endpoint.sqs_endpoint.id
  subnet_id       = aws_subnet.subnet.id
}

resource "aws_vpc_endpoint_security_group_association" "sqs_endpoint_security_group_association" {
  vpc_endpoint_id   = data.aws_vpc_endpoint.sqs_endpoint.id
  security_group_id = aws_security_group.security_group.id
}