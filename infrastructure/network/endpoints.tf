resource "aws_vpc_endpoint" "sqs_endpoint" {
  vpc_id = aws_vpc.vpc.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${var.region}.sqs"
  private_dns_enabled = true
}