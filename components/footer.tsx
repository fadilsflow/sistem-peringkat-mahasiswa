import Link from "next/link";
import { Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-4 bg-card text-primary flex justify-between items-center px-4 sm:px-10">
      <div className="w-fit flex justify-start">
        <p className=" text-sm text-left">
          Copyright &copy; 2025{" "}
          <a
            href="https://fadils.xyz"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            fadils.xyz
          </a>{" "}
          -{" "}
          <a
            href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa/blob/main/LICENSE"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
          .
        </p>
      </div>
      <div className="  w-fit justify-end flex items-center ">
        <Link href="/about">
          <Info className="w-4 h-4" />
        </Link>
      </div>
    </footer>
  );
}
