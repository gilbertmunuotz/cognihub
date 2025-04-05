import { Home, User2, ChevronUp } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "../logout";

// Menu item
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    }
];

export default async function AppSidebar() {

    const session = await auth();

    return (
        <Sidebar className="flex flex-col h-full">
            <SidebarContent className="bg-zinc-100 dark:bg-black">
                <SidebarGroup>
                    <SidebarGroupLabel className="flex flex-row justify-center text-2xl font-bold mb-2">
                        CogniHub
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-zinc-100 dark:bg-black">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <User2 className="mr-2" />
                                    <span>{session?.user.name}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-full">
                                <DropdownMenuItem>
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    );
}