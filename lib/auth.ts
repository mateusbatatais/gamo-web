// lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: number;
  name: string;
  slug: string;
  role: string;
  email: string;
  profileImage: string;
  hasPassword: boolean;
  description?: string;
}

export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gamo_token")?.value;

    if (!token) return null;

    const decoded = jwt.decode(token) as AuthUser;
    return {
      userId: decoded.userId,
      name: decoded.name || "",
      slug: decoded.slug || "",
      role: decoded.role || "",
      email: decoded.email || "",
      profileImage: decoded.profileImage || "",
      hasPassword: decoded.hasPassword,
      description: decoded.description,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
