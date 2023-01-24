resource "aws_route" "route" {
  route_table_id            = var.route_table_id
  destination_cidr_block    = "0.0.0.0/0"
  gateway_id = var.internet_gateway_id
}