"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ModeToggle } from "./mode-togle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navItemsSignedIn = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/manage", label: "Manage Data" },
    { href: "/ai-report", label: "AI Report" },
  ];
  const isHome = pathname === "/" || pathname === "/about";
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background  shadow-sm  mx-auto rounded-b-lg",
        isHome && "max-w-5xl"
      )}
    >
      <div className="container mx-auto px-4 sm:px-10">
        <div className="flex h-12 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-6"
          >
            <Link
              href="/"
              className="flex items-center text-primary transform transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="font-bold">SYNCRANK</span>
            </Link>
          </motion.div>
          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="text-sm bg-primary transform transition-all duration-300 hover:-translate-y-0.5"
                >
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {isHome ? (
                <Button
                  size="sm"
                  className="text-sm transform transition-all duration-300 hover:-translate-y-0.5"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <nav className="hidden md:flex items-center space-x-2">
                    {navItemsSignedIn.map((item) => (
                      <Button
                        key={item.href}
                        asChild
                        variant="ghost"
                        className={cn(
                          "text-sm font-medium",
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    ))}
                  </nav>
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">Buka menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {navItemsSignedIn.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href}>{item.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}

              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverCard: "bg-background",
                    userButtonPopoverCardHeader: "bg-background",
                    userButtonPopoverCardContent: "bg-background",
                    userButtonPopoverCardFooter: "bg-background",
                  },
                }}
              />
            </SignedIn>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
