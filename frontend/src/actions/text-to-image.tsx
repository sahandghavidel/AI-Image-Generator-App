"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { env } from "~/env";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

interface GenerateImageData {
  prompt: string;
  negative_prompt?: string;
  width: number;
  height: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  attention_backend?: string;
}

interface GenerateImageResult {
  success: boolean;
  s3_key?: string;
  imageUrl?: string;
  projectId?: string;
  seed?: number;
  modelId?: string;
  error?: string;
}

export async function generateImage(
  data: GenerateImageData,
): Promise<GenerateImageResult> {
  try {
    if (!env.MODAL_ZIMAGE_URL) {
      return {
        success: false,
        error: "MODAL_ZIMAGE_URL is not set",
      };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    if (!data.prompt || !data.width || !data.height)
      return { success: false, error: "Missing required fields" };

    const creditsNeeded = 1;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });
    if (!user) return { success: false, error: "User not found" };
    if (user.credits < creditsNeeded)
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.credits}`,
      };

    const response = await fetch(env.MODAL_ZIMAGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: data.prompt,
        negative_prompt: data.negative_prompt,
        width: data.width,
        height: data.height,
        num_inference_steps: data.num_inference_steps,
        guidance_scale: data.guidance_scale,
        seed: data.seed,
        attention_backend: data.attention_backend,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        success: false,
        error: text ? `Generation failed: ${text}` : "Failed to generate image",
      };
    }

    const result = (await response.json()) as {
      image_s3_key: string;
      image_url: string;
      seed: number;
      model_id: string;
    };

    const [, imageProject] = await db.$transaction([
      db.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: creditsNeeded } },
      }),
      db.imageProject.create({
        data: {
          prompt: data.prompt,
          negativePrompt: data.negative_prompt,
          imageUrl: result.image_url,
          s3Key: result.image_s3_key,
          width: data.width,
          height: data.height,
          numInferenceSteps: data.num_inference_steps ?? 9,
          guidanceScale: data.guidance_scale ?? 0,
          seed: BigInt(result.seed),
          modelId: result.model_id,
          userId: session.user.id,
        },
      }),
    ]);

    return {
      success: true,
      s3_key: result.image_s3_key,
      imageUrl: result.image_url,
      seed: result.seed,
      modelId: result.model_id,
      projectId: imageProject.id,
    };
  } catch (error) {
    console.error("Image generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export const getUserImageProjects = cache(async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const imageProjects = await db.imageProject.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Prisma BigInt values aren't JSON-serializable; convert seed to number.
    const safeProjects = imageProjects.map((project) => ({
      ...project,
      seed: Number(project.seed),
    }));

    return { success: true, imageProjects: safeProjects };
  } catch (error) {
    console.error("Error fetching image projects:", error);
    return { success: false, error: "Failed to fetch image projects" };
  }
});

export async function deleteImageProject(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const project = await db.imageProject.findUnique({ where: { id } });
    if (!project || project.userId !== session.user.id)
      return { success: false, error: "Not found or unauthorized" };

    await db.imageProject.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting image project:", error);
    return { success: false, error: "Failed to delete image project" };
  }
}
