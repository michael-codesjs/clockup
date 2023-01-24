resource "aws_vpc_endpoint" "sqs_endpoint" {
  vpc_id              = var.vpc_id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${var.region}.sqs"
  security_group_ids  = [aws_security_group.security_group.id]
  private_dns_enabled = true
}
