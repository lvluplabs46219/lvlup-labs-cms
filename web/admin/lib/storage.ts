/**
 * S3-Compatible Storage Abstraction Layer
 * 
 * Implements the "Asset Layer" decoupling. 
 * By using the standard AWS S3 Protocol, this works identically for:
 * - Cloudflare R2 (cheap/start)
 * - DigitalOcean Spaces
 * - Google Cloud Storage (scale/enterprise)
 * - AWS S3
 */

export interface StorageAdapter {
  uploadFile(file: File, path: string): Promise<string>;
  deleteFile(path: string): Promise<boolean>;
  getPresignedUrl(path: string): Promise<string>;
}

class S3StorageAdapter implements StorageAdapter {
  private endpoint: string;
  private bucket: string;

  constructor() {
    this.endpoint = process.env.S3_ENDPOINT || '';
    this.bucket = process.env.S3_BUCKET_NAME || '';
    // AWS S3 client initialization would go here using S3_ACCESS_KEY_ID etc.
  }

  async uploadFile(file: File, path: string): Promise<string> {
    console.log(`[Storage] Uploading to ${this.endpoint}/${this.bucket}/${path}`);
    // Mock implementation
    return `${process.env.S3_PUBLIC_URL}/${path}`;
  }

  async deleteFile(path: string): Promise<boolean> {
    console.log(`[Storage] Deleting from ${this.bucket}/${path}`);
    return true;
  }

  async getPresignedUrl(path: string): Promise<string> {
    return `${process.env.S3_PUBLIC_URL}/${path}?token=mock_presigned`;
  }
}

// Export a singleton instance
export const storage = new S3StorageAdapter();
