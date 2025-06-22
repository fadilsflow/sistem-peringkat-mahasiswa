import { auth } from "@clerk/nextjs/server";

export async function getCurrentUserId(): Promise<string> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized - User not authenticated");
    }

    return userId;
} 