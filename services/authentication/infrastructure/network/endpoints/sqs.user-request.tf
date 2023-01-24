data "aws_ssm_parameter" "user_sqs_request_queue_arn" {
  name = "/clockup/${var.stage}/user/queues/request/arn"
}

data "aws_ssm_parameter" "user_sqs_request_queue_url" {
  name = "/clockup/${var.stage}/user/queues/request/url"
}

# Associate the VPC endpoint with the SQS queue.
resource "aws_vpc_endpoint" "sqs" {

  vpc_id              = var.vpc_id
  subnet_ids          = [var.subnet_id]
  service_name        = "com.amazonaws.${var.region}.sqs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "sqs:*"
      Resource  = data.aws_ssm_parameter.user_sqs_request_queue_arn.value
    }]
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
      Action    = "SQS:*"
      Resource  = "${data.aws_ssm_parameter.user_sqs_request_queue_arn.value}"
      Condition = {
        ArnLike = {
          "aws:SourceArn" = "${aws_vpc_endpoint.sqs.arn}"
        }
      }
    }]
  })
}