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