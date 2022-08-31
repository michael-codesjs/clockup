import { AWS } from "../types/aws";
import { logicalResourceNames } from "../utilities/constants";



export const s3BucketResource = {
  
  [logicalResourceNames.assetsBucket]: {

    Type: "AWS::S3::Bucket",
    Properties: {
      AcelerationConfiguration: {
        AcelerationStatus: true
      },
      CorsRules: {
        AllowedOrigins: ["*"],
        AllowedMethods: [
          "GET",
          "PUT"
        ],
        AllowedHeader: ["*"]
      }
    }
  }
}