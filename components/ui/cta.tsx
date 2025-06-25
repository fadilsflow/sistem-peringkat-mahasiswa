import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./button";
import Link from "next/link";

export default function Cta() {
  return (
    <div className="border rounded-lg   border-primary">
      <div className="mx-auto max-w-4xl py-12 px-4 text-center sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          <span className="block">Siap Mengubah Data Menjadi Aksi?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary">
          Coba SyncRank sekarang dan rasakan kemudahan evaluasi akademik yang
          adil dan transparan.
        </p>
        <div className="mt-8 flex justify-center">
          <SignedIn>
            <Button
              asChild
              className="px-8 transform transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/dashboard">Buka Dashboard</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="px-8 transform transition-all duration-300 hover:-translate-y-0.5">
                Mulai Gratis
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
