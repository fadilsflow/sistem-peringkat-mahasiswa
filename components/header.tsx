"use client";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Header() {
  const pathname = usePathname();

  const navItemsSignedIn = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/manage", label: "Manage Data" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-10">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center text-foreground">
              <span className="font-light">SYNC</span>
              <span className="font-semibold">RANK</span>
            </Link>
            <nav className="flex">
              <SignedIn>
                {navItemsSignedIn.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-3.5 text-sm font-light transition-colors ${pathname === item.href
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </SignedIn>
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm" variant="outline" className="text-sm">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Image
                src="/github.svg"
                alt="github"
                width={15}
                height={15}
                className="invert"
              />
            </a>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-4 h-4" />
            </Link>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
