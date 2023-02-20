resource "aws_cloudwatch_event_bus" "event_bus" {

  name = "clockup-${var.stage}"

  tags = {
    Application = "clockup"
    Enviroment  = var.stage
    Description = "clockup event bus."
  }

}

resource "aws_iam_role" "event_bus_role" {

  name = "clockup-${var.stage}-event-bus-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "events.amazonaws.com"
        }
      }
    ]
  })

}

resource "aws_iam_policy" "event_bus_policy" {
  name = "clockup-${var.stage}-event-bus-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "states:StartExecution",
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eventbridge_policy_attachment" {
  policy_arn = aws_iam_policy.event_bus_policy.arn
  role       = aws_iam_role.event_bus_role.name
}

resource "aws_cloudwatch_event_bus_policy" "example_eventbus_policy" {

  event_bus_name = aws_cloudwatch_event_bus.event_bus.name
  policy_name    = "clockup-${var.stage}-event-bus-policy-1"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          AWS = aws_iam_role.event_bus_role.arn
        }
      }
    ]
  })

}


resource "aws_ssm_parameter" "authentication_event_bus_arn" {
  name  = "/clockup/${var.stage}/event-bus/arn"
  type  = "SecureString"
  value = aws_cloudwatch_event_bus.event_bus.arn
}

resource "aws_ssm_parameter" "authentication_event_bus_name" {
  name  = "/clockup/${var.stage}/event-bus/name"
  type  = "SecureString"
  value = aws_cloudwatch_event_bus.event_bus.name
}
