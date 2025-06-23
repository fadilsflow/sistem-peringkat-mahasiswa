import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ManageContent } from "@/components/features/manage/manage-content";

export default async function ManagePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <ManageContent />;
}
