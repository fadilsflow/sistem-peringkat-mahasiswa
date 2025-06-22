"use client";

import { useUser } from "@clerk/nextjs";

export function UserInfo() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Not signed in</div>;
    }

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">User Information</h3>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
            <p><strong>Name:</strong> {user.fullName}</p>
        </div>
    );
} 