# route table for the service
resource "aws_route_table" "route_table" {
  vpc_id = var.vpc_id
  tags = {
    Name        = "clockup-authentication-${var.stage}"
    Application = "clockup"
    Service     = "authentication"
    Stage       = var.stage
    Description = "Clockup authentication service route table in ${var.stage}."
  }
}

resource "aws_route" "route" {
  route_table_id            = aws_route_table.route_table.id
  destination_cidr_block    = "0.0.0.0/0"
  gateway_id = var.internet_gateway_id
}

resource "aws_route_table_association" "route_table_association" {
  subnet_id = aws_subnet.subnet.id
  route_table_id = aws_route_table.route_table.id
}