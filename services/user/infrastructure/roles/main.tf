variable "stage" {
  type        = string
  nullable    = false
  description = "Stage the io infrastructure is created in."
}

variable "region" {
  type        = string
  nullable    = false
  description = "Region the io infrastructure is created in."
}

data "aws_cloudwatch_event_bus" "event_bus" {
  name = "clockup-${var.stage}"
}
