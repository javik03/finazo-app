"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { config } from "@/lib/config";
import { updateArticleStatus } from "@/lib/queries/articles";
import { regenerateEvergreenArticle } from "@/agents/writer/content-strategist";

/** Timing-safe comparison to prevent brute-force via response-time analysis */
function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Still run timingSafeEqual to avoid length-based timing leak
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function loginAdmin(formData: FormData): Promise<void> {
  const token = (formData.get("token") as string) ?? "";
  const secret = config.ADMIN_SECRET ?? "";
  if (token && timingSafeCompare(token, secret)) {
    const cookieStore = await cookies();
    cookieStore.set("finazo_admin", token, {
      httpOnly: true,
      secure: config.SECURE_COOKIES === "true",
      sameSite: "strict",
      path: "/admin",
      maxAge: 60 * 60 * 2, // 2 hours
    });
    redirect("/admin");
  }
  redirect("/admin?error=1");
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("finazo_admin");
  redirect("/admin");
}

async function requireAdmin(): Promise<void> {
  if (!config.ADMIN_SECRET) {
    throw new Error("ADMIN_SECRET not configured");
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("finazo_admin")?.value ?? "";
  if (!timingSafeCompare(token, config.ADMIN_SECRET)) {
    redirect("/admin");
  }
}

export async function publishArticle(id: string, slug: string): Promise<void> {
  await requireAdmin();
  await updateArticleStatus(id, "published");
  revalidatePath("/guias", "layout");
  revalidatePath(`/guias/${slug}`);
  redirect("/admin");
}

export async function unpublishArticle(id: string, slug: string): Promise<void> {
  await requireAdmin();
  await updateArticleStatus(id, "draft");
  revalidatePath("/guias", "layout");
  revalidatePath(`/guias/${slug}`);
  redirect("/admin");
}

export async function regenerateArticle(slug: string): Promise<void> {
  await requireAdmin();
  try {
    await regenerateEvergreenArticle(slug);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    redirect(`/admin?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/guias", "layout");
  revalidatePath(`/guias/${slug}`);
  revalidatePath(`/admin/preview/${slug}`);
  redirect("/admin");
}
