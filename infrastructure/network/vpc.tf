resource "aws_vpc" "vpc" {

  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "clockup-${var.stage}"
    Application = "clockup-${var.stage}"
    Stage       = var.stage
    Description = "clockup VPC in ${var.stage}."
  }

}

resource "aws_ssm_parameter" "vpc_id" {
  name  = "/clockup/${var.stage}/network/vpc/id"
  type  = "SecureString"
  value = aws_vpc.vpc.id
}

output "vpc_id" {
  value = aws_vpc.vpc.id
  description = "VPC id."
}

output "vpc_arn" {
  value = aws_vpc.vpc.arn
  description = "VPC arn."
}