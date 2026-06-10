import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface CustomJwtPayload extends jwt.JwtPayload {
  userId: string;
}


export const getUserId = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;

  if (!token) return true;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!,
    ) as CustomJwtPayload;

    return decoded?.userId;
  } catch {
    return true;
  }
};
