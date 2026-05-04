import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-secret-key-change-me-please";
const KEY = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

export class SecurityService {
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const tag = cipher.getAuthTag();
    
    // Format: iv:tag:encrypted
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
  }

  static decrypt(encryptedData: string): string {
    const [ivHex, tagHex, encryptedText] = encryptedData.split(":");
    
    if (!ivHex || !tagHex || !encryptedText) {
      // If it's not encrypted (e.g. migration or old data), return as is for safety
      // Or throw error if you want strictness.
      return encryptedData;
    }

    try {
      const iv = Buffer.from(ivHex, "hex");
      const tag = Buffer.from(tagHex, "hex");
      const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
      
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8") as string;
      
      return decrypted;
    } catch (error) {
      return encryptedData;
    }
  }
}
