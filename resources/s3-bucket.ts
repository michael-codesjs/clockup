import { AWS } from "../types/aws";
import { logicalResourceNames } from "../utilities/constants";



export const s3BucketResource = {

	[logicalResourceNames.assetsBucket]: {

		Type: "AWS::S3::Bucket",
		Properties: {
			AccelerateConfiguration: {
				AccelerationStatus: "Enabled"
			},
			CorsConfiguration: {
				CorsRules: [
					{
						AllowedOrigins: ["*"],
						AllowedMethods: [
							"GET",
							"PUT"
						],
						AllowedHeaders: ["*"]
					}
				]
			}
		}
	}
};