import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-4">
        <Link href="/">
          <span className="font-light">SYNC</span>
          <span className="font-semibold">RANK</span>
        </Link>
      </div>
            
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </nav>
  );
}
