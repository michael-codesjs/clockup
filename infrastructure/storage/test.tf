resource "aws_dynamodb_table" "test_dynamoDb_table" {

  name = "clockup-test-table-${var.stage}"

  tags = {
    Description = "Primary table for testing abstract entities."
  }

  billing_mode   = "PROVISIONED"
  read_capacity  = "1"
  write_capacity = "1"

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
    name = "CreatorIndexPK"
    type = "S"
  }

  attribute {
    name = "CreatorIndexSK"
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
    name            = "CreatorIndex"
    hash_key        = "CreatorIndexPK"
    range_key       = "CreatorIndexSK"
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

resource "aws_ssm_parameter" "test_table_name" {
  name  = "/clockup/${var.stage}/test/storage/table/name"
  type  = "String"
  value = aws_dynamodb_table.test_dynamoDb_table.name
}

resource "aws_ssm_parameter" "test_table_arn" {
  name  = "/clockup/${var.stage}/test/storage/table/arn"
  type  = "String"
  value = aws_dynamodb_table.test_dynamoDb_table.arn
}