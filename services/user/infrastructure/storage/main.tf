variable "stage" {
  type        = string
  default     = "dev"
  description = "Stage the storage infrastructure is created in."
}

variable "region" {
  type        = string
  default     = "eu-central-1"
  description = "Region the storage infrastructure is created in."
}