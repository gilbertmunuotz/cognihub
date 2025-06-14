"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function LogoutButton() {

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/auth/login" });
            console.log("Token Cleared");
        } catch (error) {
            console.error("Sign-out failed:", error);
        }
    }

    return (
        <Button variant="destructive" onClick={handleSignOut} className=" w-full cursor-pointer">Sign out</Button >
    );
}
