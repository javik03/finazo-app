"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import { updateArticleStatus } from "@/lib/queries/articles";

export async function loginAdmin(formData: FormData): Promise<void> {
  const token = formData.get("token") as string;
  if (token && token === config.ADMIN_SECRET) {
    const cookieStore = await cookies();
    cookieStore.set("finazo_admin", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
  const token = cookieStore.get("finazo_admin")?.value;
  if (token !== config.ADMIN_SECRET) {
    redirect("/admin");
  }
}

export async function publishArticle(id: string): Promise<void> {
  await requireAdmin();
  await updateArticleStatus(id, "published");
  redirect("/admin");
}

export async function unpublishArticle(id: string): Promise<void> {
  await requireAdmin();
  await updateArticleStatus(id, "draft");
  redirect("/admin");
}
