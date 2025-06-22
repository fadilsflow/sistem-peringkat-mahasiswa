"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navItemsSignedIn = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/manage", label: "Manage Data" },
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
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center text-primary">
              <span className="font-bold">SYNCRANK</span>
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm" className="text-sm bg-primary">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {isHome ? (
                <Button size="sm" className="text-sm">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <nav className="flex">
                  {navItemsSignedIn.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-3.5 text-sm font-light transition-colors text-primary hover:text-primary hover:bg-muted/50 ${
                        pathname === item.href
                          ? " text-primary border-b-2 border-primary"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              )}
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
