import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

function getS3Client() {
  return new S3Client({
    region: process.env.AMA_REGION,
    credentials: {
      accessKeyId: process.env.AMA_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AMA_SECRET_ACCESS_KEY ?? "",
    },
  });
}

export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  const bucketName = process.env.AMA_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AMA_S3_BUCKET_NAME is not defined");
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read" as any, // Make the file publicly accessible
  };

  const command = new PutObjectCommand(params);
  await getS3Client().send(command);

  return `https://${bucketName}.s3.${process.env.AMA_REGION}.amazonaws.com/${fileName}`;
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  const bucketName = process.env.AMA_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AMA_S3_BUCKET_NAME is not defined");
  }

  try {
    // Extract key from URL: https://bucket.s3.region.amazonaws.com/key
    const url = new URL(fileUrl);
    const key = url.pathname.startsWith("/")
      ? url.pathname.slice(1)
      : url.pathname;

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await getS3Client().send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    // We don't necessarily want to throw here to avoid blocking database deletions
    // if the file is already gone or there's a temporary S3 issue
  }
}
