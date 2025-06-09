import { ModeToggle } from "@/components/mode-toggle";
import { Nav } from "@/components/nav";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background px-4">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href={"/"} className="flex">
            <span className="font-light">SYNC</span>
            <span className="font-bold">RANK</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center ">
          <Nav />
        </div>
        <div className="flex items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
