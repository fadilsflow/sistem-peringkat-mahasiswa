import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function CTA() {
  return (
    <div className="text-center space-y-4 text-primary  py-16 flex flex-col justify-center items-center">
      <Badge variant="outline" className="text-primary">
        Gratis, Mudah, dan Cepat
      </Badge>
      <h2 className="text-3xl font-light max-w-md mx-auto text-foreground mb-4">
        Hitung ranking mahasiswa dengan Akurat dan Efisien
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Kelola dan mengevaluasi prestasi akademik mahasiswa dengan metode SAW
        yang akurat dan terpercaya.
      </p>

      <div className="flex justify-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Mulai Sekarang</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button asChild>
            <Link href="/dashboard">Mulai Sekarang</Link>
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
