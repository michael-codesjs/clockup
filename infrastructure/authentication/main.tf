variable "stage" {
  type = string
  default = "dev"
  description = "Stage the authentication infrastructure is created in."
}

variable "region" {
  type = string
  default = "eu-central-1"
  description = "Region the authentication infrastructure is created in."
}