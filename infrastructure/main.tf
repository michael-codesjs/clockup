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
  description = "Stage the infrastructure is created in."
}

variable "region" {
  type        = string
  default     = "eu-central-1"
  description = "Region the infrastructure is created in."
}

module "storage" {
  source = "./storage"
  stage  = var.stage
  region = var.region
}

module "authentication" {
  source = "./authentication"
  stage  = var.stage
  region = var.region
}

module "api" {
  source               = "./api"
  stage                = var.stage
  region               = var.region
  cognito_user_pool_id = module.authentication.cognito_user_pool_id
}

module "service_io" {
  source = "./service-io"
  stage  = var.stage
  region = var.region
}
