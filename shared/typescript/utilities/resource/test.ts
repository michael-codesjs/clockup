

class TestResources {

  private constructor() {}
  static readonly instance = new TestResources;

  readonly tableName = "${ssm:/clock-up/${self:custom.stage}/test/storage/table/name}" as const;
	readonly tableArn = "${ssm:/clock-up/${self:custom.stage}/test/storage/table/arn}" as const;

}

export const testResources = TestResources.instance;