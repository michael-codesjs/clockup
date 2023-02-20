
resource "aws_iam_role" "orchestrate_user_creatables_clean_up_role" {

  name = "clockup_${var.stage}_orchestrate_user_creatables_clean_up_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })

}

resource "aws_iam_policy" "orchestrate_user_creatables_clean_up_role_policy" {
  name = "clockup_${var.stage}_orchestrate_user_creatables_clean_up_role_policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "events:PutEvents",
        Effect = "Allow",
        Resource = data.aws_cloudwatch_event_bus.event_bus.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "orchestrate_user_creatables_clean_up_role_policy_attachment" {
  role = aws_iam_role.orchestrate_user_creatables_clean_up_role.name
  policy_arn = aws_iam_policy.orchestrate_user_creatables_clean_up_role_policy.arn
}

resource "aws_ssm_parameter" "orchestrate_user_creatables_clean_up_role_arn" {
  type = "SecureString"
  name = "/clockup/${var.stage}/user/roles/orchestrate-user-creatables-clean-up/arn"
  value = aws_iam_role.orchestrate_user_creatables_clean_up_role.arn
}