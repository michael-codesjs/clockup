variable "stage" {
  type        = string
  default     = "dev"
  description = "Stage the io infrastructure is created in."
}

variable "region" {
  type        = string
  default     = "eu-central-1"
  description = "Region the io infrastructure is created in."
}

variable "vpc_id" {
  type        = string
  nullable    = false
  description = "Clockup VPC id."
}

variable "vpc_arn" {
  type        = string
  nullable    = false
  description = "Clockup VPC arn."
}
