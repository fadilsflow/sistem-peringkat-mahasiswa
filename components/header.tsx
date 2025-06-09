"use client";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/manage", label: "Manage Data" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-background   shadow-sm">
      <div className="container mx-auto px-4 sm:px-10">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center ">
              <span className="font-light">SYNC</span>
              <span className="font-semibold">RANK</span>
            </Link>
            <nav className="flex ">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-3.5  text-sm hover:bg-foreground/15 hover:text-primary-foreground font-light transition-colors ${
                    pathname === item.href
                      ? "bg-foreground/15 "
                      : "text-background/70 hover:text-background "
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa/">
              <Image
                src="/github.svg"
                alt="github"
                width={15}
                height={15}
                className="invert"
              />
            </Link>
            <Link href="/about">
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
