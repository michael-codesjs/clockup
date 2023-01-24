variable "stage" {
  type        = string
  nullable    = false
  description = "Stage the network infrastructure is created in."
}

variable "region" {
  type        = string
  nullable    = false
  description = "Region the network infrastructure is created in."
}

variable "vpc_id" {
  type        = string
  nullable    = false
  description = "Clockup vpc id."
}

variable "internet_gateway_id" {
  type        = string
  nullable    = false
  description = "Clockup internet gateway id."
}

module "endpoints" {
  source              = "./endpoints"
  stage               = var.stage
  region              = var.region
  vpc_id              = var.vpc_id
  subnet_id           = aws_subnet.subnet.id
}