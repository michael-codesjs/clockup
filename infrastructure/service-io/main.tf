variable "stage" {
  type        = string
  description = "Stage the io infrastructure is created in."
}

variable "region" {
  type        = string
  description = "Region the io infrastructure is created in."
}

module "user" {
  source = "./user"
  stage = var.stage
  region = var.region
}