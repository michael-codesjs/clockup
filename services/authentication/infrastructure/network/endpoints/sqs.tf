resource "aws_vpc_endpoint" "sqs_endpoint" {

  vpc_id              = var.vpc_id
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [var.subnet_id]
  security_group_ids  = [var.security_group_id]
  service_name        = "com.amazonaws.${var.region}.sqs"
  private_dns_enabled = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = ["sqs:SendMessage"]
        Resource  = data.aws_ssm_parameter.user_sqs_request_queue_arn.value
      }
    ]
  })

}

# Associate the SQS queue with the VPC endpoint
resource "aws_sqs_queue_policy" "queue_policy" {
  queue_url = data.aws_ssm_parameter.user_sqs_request_queue_url.value
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = ["sqs:SendMessage"]
      Resource  = "${data.aws_ssm_parameter.user_sqs_request_queue_arn.value}"
      Condition = {
        ArnLike = {
          "aws:SourceArn" = "${aws_vpc_endpoint.sqs_endpoint.arn}"
        }
      }
    }]
  })
}
