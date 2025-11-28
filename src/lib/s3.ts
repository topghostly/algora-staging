import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function uploadToS3(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME is not defined");
    }

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: "public-read" as any, // Make the file publicly accessible
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
