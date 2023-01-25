terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.region
}

variable "stage" {
  type        = string
  default     = "dev"
  description = "Stage the user service infrastructure is created in."
}

variable "region" {
  type        = string
  default     = "eu-central-1"
  description = "Region the user service infrastructure is created in."
}

data "aws_ssm_parameter" "vpc_id" {
  name = "/clockup/${var.stage}/network/vpc/id"
}

data "aws_ssm_parameter" "internet_gateway_id" {
  name = "/clockup/${var.stage}/network/internet-gateway/id"
}

module "network" {
  source              = "./network"
  stage               = var.stage
  region              = var.region
  vpc_id              = data.aws_ssm_parameter.vpc_id.value
  internet_gateway_id = data.aws_ssm_parameter.internet_gateway_id.value
}

module "miscellanous" {
  source = "./miscellanous"
  stage  = var.stage
  region = var.region
}

module "storage" {
  source = "./storage"
  stage  = var.stage
  region = var.region
}