import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type SupabaseStorageConfig = {
  bucket: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
};

let cachedClient: S3Client | null = null;
let cachedConfig: SupabaseStorageConfig | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for Supabase Storage uploads.`);
  }
  return value;
}

function getConfig(): SupabaseStorageConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const bucket = requireEnv("SUPABASE_STORAGE_BUCKET");
  const endpoint = requireEnv("SUPABASE_S3_ENDPOINT");
  const region = process.env.SUPABASE_S3_REGION || "us-east-1";
  const accessKeyId = requireEnv("SUPABASE_S3_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("SUPABASE_S3_SECRET_ACCESS_KEY");
  const configuredPublicBase = process.env.SUPABASE_STORAGE_PUBLIC_URL?.replace(/\/$/, "");
  const publicBaseUrl = configuredPublicBase
    ? configuredPublicBase.endsWith(`/${bucket}`)
      ? configuredPublicBase
      : `${configuredPublicBase}/${bucket}`
    : process.env.SUPABASE_URL
      ? `${process.env.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${bucket}`
      : undefined;

  if (!publicBaseUrl) {
    throw new Error("Set SUPABASE_STORAGE_PUBLIC_URL or SUPABASE_URL so public asset URLs can be built.");
  }

  cachedConfig = { bucket, endpoint, region, accessKeyId, secretAccessKey, publicBaseUrl };
  return cachedConfig;
}

function getClient(): { client: S3Client; config: SupabaseStorageConfig } {
  const config = getConfig();

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
    });
  }

  return { client: cachedClient, config };
}

export async function createSupabaseUploadUrl(options: {
  key: string;
  contentType?: string;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; bucket: string }> {
  const { client, config } = getClient();
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: options.key,
    ContentType: options.contentType || "application/octet-stream"
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: options.expiresIn ?? 300 });
  return { uploadUrl, bucket: config.bucket };
}

export function buildSupabasePublicUrl(key: string): string {
  const config = getConfig();
  return `${config.publicBaseUrl.replace(/\/$/, "")}/${key}`;
}
