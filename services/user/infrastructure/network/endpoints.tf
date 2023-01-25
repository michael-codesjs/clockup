resource "aws_vpc_endpoint" "sqs_endpoint" {

  vpc_id             = aws_vpc.vpc.id
  vpc_endpoint_type  = "Interface"
  service_name       = "com.amazonaws.${var.region}.sqs"
  subnet_ids         = [aws_subnet.subnet.id]
  security_group_ids = [aws_security_group.security_group.id]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "sqs:*"
      Resource  = "*"
    }]
  })

}
