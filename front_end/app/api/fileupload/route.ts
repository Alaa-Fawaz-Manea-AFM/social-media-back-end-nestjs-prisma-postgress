import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderName = formData.get("folderName") as string;

    if (!file) {
      return NextResponse.json({
        msg: "File not found",
        statusCode: 404,
      });
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const res = await new Promise<any>((res, rej) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folderName,
          },
          (error, result) => {
            if (error) rej(error);
            else res(result as any);
          },
        );
        uploadStream.end(buffer);
      });

      return NextResponse.json({
        msg: "File uploaded to cloudinary",
        res,
        statusCode: 200,
      });
    }
  } catch {
    return NextResponse.json({
      msg: "Error in fileupload route",
      statusCode: 500,
    });
  }
}
