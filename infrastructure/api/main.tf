variable "stage" {
  type        = string
  nullable    = false
  description = "Stage the API infrastructure is created in."
}

variable "region" {
  type        = string
  nullables   = false
  description = "Region the API infrastructure is created in."
}

variable "cognito_user_pool_id" {
  type        = string
  nullable    = false
  description = "Cogntio user pool ID."
}
