resource "aws_s3_bucket" "clock-up-assets-bucket" {
  tags = {
    "Name" = "clock-up-assets-bucket-${var.stage}"
  }
}

resource "aws_s3_bucket_cors_configuration" "clock-up-bucket-cors-configuration" {

  bucket = aws_s3_bucket.clock-up-assets-bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

}

resource "aws_s3_bucket_acl" "clock-up-assets-bucket-acl" {
  bucket = aws_s3_bucket.clock-up-assets-bucket.id
  acl    = "private"
}

