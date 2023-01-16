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

module "logging" {
  source = "./logging"
  stage  = var.stage
  region = var.region
}

module "roles" {
  source = "./roles"
  stage  = var.stage
  region = var.region
}