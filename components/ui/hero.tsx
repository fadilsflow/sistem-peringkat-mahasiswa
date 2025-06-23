"use client";

import { motion } from "motion/react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "./badge";
import { Rocket } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 mx-auto w-full">
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="flex items-center justify-center pb-4 sm:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Badge variant="outline" className="text-primary">
              <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
              <span className="text-xs sm:text-sm font-bold">
                Akurat & Cepat
              </span>
            </Badge>
          </motion.div>
        </div>
        <h1 className="z-10  text-center max-w-[280px] xs:max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto text-xl sm:text-2xl md:text-3xl lg:text-5xl font-medium text-primary">
          {"Sistem Peringkat Mahasiswa dengan Metode SAW"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 py-3 sm:py-4 text-center text-sm sm:text-base md:text-lg text-primary max-w-xs sm:max-w-sm md:max-w-xl mx-auto"
        >
          Hitung ranking mahasiswa dalam hitungan detik dengan syncrank.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="w-full sm:w-auto px-8 transform transition-all duration-300 hover:-translate-y-0.5">
                Mulai Sekarang
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              className="w-full sm:w-auto px-8 transform transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/dashboard">Mulai Sekarang</Link>
            </Button>
          </SignedIn>
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto px-8 transform transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link href="/about">Pelajari Lebih Lanjut</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className=" z-10 mt-12 sm:mt-16 md:mt-20 rounded-2xl sm:rounded-3xl border border-primary bg-background p-2 sm:p-3 shadow-md "
        >
          <div className="w-full overflow-hidden rounded-xl border border-primary">
            <Image
              src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1750670899/syncrank-dashboard_sxgeqt.png"
              alt="Dashboard preview"
              className="aspect-[16/9] w-full object-cover"
              height={500}
              width={1000}
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
