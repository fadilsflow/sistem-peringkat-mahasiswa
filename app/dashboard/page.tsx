import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/features/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Kelola dan pantau peringkat mahasiswa dengan mudah melalui dashboard SyncRank. Lihat statistik, analisis, dan peringkat terkini.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <DashboardContent />;
}
