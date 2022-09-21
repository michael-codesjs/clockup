import S3 from "aws-sdk/clients/s3";
import { configureEnviromentVariables } from "../utilities/functions";

const { REGION } = configureEnviromentVariables();

export const s3Client = new S3({
	useAccelerateEndpoint: true,
	region: REGION
});