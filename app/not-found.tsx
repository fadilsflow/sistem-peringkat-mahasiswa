import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-100">
      <h2 className="text-2xl font-bold">404 Not Found</h2>
      <p className="text-sm text-muted-foreground">
        Could not find requested resource
      </p>
      <Link href="/" className="text-sm text-primary underline mt-4">
        Return Home
      </Link>
    </div>
  );
}
