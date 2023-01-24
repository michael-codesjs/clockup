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
  description = "clockup vpc id."
}

variable "route_table_id" {
  type        = string
  nullable    = false
  description = "clockup vpc route table id."
}

variable "internet_gateway_id" {
  type        = string
  nullable    = false
  description = "clockup internet gateway id."
}