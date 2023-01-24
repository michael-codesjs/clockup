resource "aws_route_table" "route_table" {

  vpc_id = aws_vpc.vpc.id
  
  tags = {
    Name        = "clockup-${var.stage}"
    Application = "clockup-${var.stage}"
    Stage       = var.stage
    Description = "clockup VPC in ${var.stage}."
  }

}

resource "aws_ssm_parameter" "route_table_id" {
  name  = "/clockup/${var.stage}/network/route-table/id"
  type  = "SecureString"
  value = aws_route_table.route_table.id
}