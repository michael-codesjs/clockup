resource "aws_dynamodb_table" "dynamoDb_table" {

  name = "clock-up-table-${var.stage}"

  billing_mode   = "PROVISIONED"
  read_capacity  = "1"
  write_capacity = "1"

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "EntityIndexPK"
    type = "S"
  }

  attribute {
    name = "EntityIndexSK"
    type = "S"
  }

  attribute {
    name = "GSI1_PK"
    type = "S"
  }

  attribute {
    name = "GSI1_SK"
    type = "S"
  }

  hash_key  = "PK"
  range_key = "SK"

  point_in_time_recovery {
    enabled = true
  }

  ttl {
    enabled        = true
    attribute_name = "ttl"
  }

  global_secondary_index {
    name            = "EntityIndex"
    hash_key        = "EntityIndexPK"
    range_key       = "EntityIndexSK"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1_PK"
    range_key       = "GSI1_SK"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

}

resource "aws_ssm_parameter" "tableName" {
  name = "/clock-up/${var.stage}/storage/table/name"
  type = "String"
  value = aws_dynamodb_table.dynamoDb_table.name
}

resource "aws_ssm_parameter" "tableARN" {
  name = "/clock-up/${var.stage}/storage/table/arn"
  type = "String"
  value = aws_dynamodb_table.dynamoDb_table.arn
}

output "dynamoDb_table_name" {
  value = aws_dynamodb_table.dynamoDb_table.name
  description = "DynamoDB table name."
}

output "dynamoDb_table_arn" {
  value = aws_dynamodb_table.dynamoDb_table.arn
  description = "DynamoDB table ARN."
}