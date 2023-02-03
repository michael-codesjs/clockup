resource "aws_cloudwatch_event_bus" "event_bus" {
  
  name = "clockup-${var.stage}"
  
  tags = {
    Application = "clockup"
    Enviroment  = var.stage
    Description = "clockup event bus."
  }

}

resource "aws_cloudwatch_event_archive" "order" {
  name             = "archive"
  event_source_arn = aws_cloudwatch_event_bus.event_bus.arn
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