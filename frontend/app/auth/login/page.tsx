import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { ModeToggle } from "@/components/theme"

export default function LoginPage() {
    return (
        <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="absolute top-4 right-4 z-10">
                <ModeToggle />
            </div>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    CogniHub
                </a>
                <LoginForm />
            </div>
        </div>
    )
}