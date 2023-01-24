variable "stage" {
  type        = string
  nullable    = false
  description = "Stage the authentication service vpc endpoints are created in."
}

variable "region" {
  type        = string
  nullable    = false
  description = "Region the authentication service vpc endpoints are created in."
}

variable "vpc_id" {
  type        = string
  nullable    = false
  description = "clockup vpc id."
}

variable "subnet_id" {
  type        = string
  nullable    = false
  description = "clockup authentication service subnet id."
}

