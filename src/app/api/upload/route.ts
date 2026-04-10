import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { allowUpload } from "@/lib/uploadRateLimit";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_WIDTH = 2000;

async function getAuthenticatedUserId() {
  const cookieStore = cookies();
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor." },
        { status: 401 },
      );
    }

    if (!allowUpload(userId)) {
      return NextResponse.json(
        { error: "Çok fazla yükleme denemesi. Lütfen bir dakika sonra tekrar deneyin." },
        { status: 429 },
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary credentials are missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
        },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only image/jpeg, image/png and image/webp are allowed." },
        { status: 415 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Each file must be 5MB or less." },
        { status: 413 },
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${fileBuffer.toString("base64")}`;

    const result = (await cloudinary.uploader.upload(dataUri, {
      folder: "listings",
      transformation: [
        { width: MAX_IMAGE_WIDTH, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      resource_type: "image",
    })) as {
      public_id: string;
      secure_url: string;
    };

    return NextResponse.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected upload error.",
      },
      { status: 500 },
    );
  }
}
