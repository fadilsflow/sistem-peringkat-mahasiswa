import Link from "next/link";
export default function Footer() {
  return (
    <footer className="py-4 text-primary flex flex-col  items-center px-4 sm:px-10 space-y-4 justify-center pb-[150px]">
      <div className="flex gap-4 mb-4">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa/"
          className="text-primary hover:text-foreground transition-colors"
        >
          Github
        </a>
        <Link
          href="/about"
          className="text-primary hover:text-foreground transition-colors"
        >
          About
        </Link>
      </div>
      <div className="w-fit flex justify-start">
        <p className=" text-sm text-left">
          &copy; 2025{" "}
          <a
            href="https://fadils.xyz"
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
    </footer>
  );
}
