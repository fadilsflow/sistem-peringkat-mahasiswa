import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ManageContent } from "@/components/features/manage/manage-content";

export const metadata: Metadata = {
  title: "Manage Data",
  description:
    "Kelola data mahasiswa dan periode penilaian dengan mudah. Tambah, edit, dan hapus data secara efisien.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ManagePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <ManageContent />;
}
