"use client";

import { motion } from "motion/react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSectionOne() {
    return (
        <div className="relative mx-auto flex flex-col items-center justify-center">

            <div className="px-4 py-10 md:py-20">
                <h1 className="relative z-10  text-center text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
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
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 0.8,
                    }}
                    className="relative z-10  py-4 text-center text-lg font-normal text-muted-foreground"
                >
                    Platform yang dirancang untuk membantu institusi pendidikan dalam mengelola dan memantau prestasi akademik mahasiswa menggunakan metode SAW (Simple Additive Weighting).
                </motion.p>
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 1,
                    }}
                    className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button className="w-60 transform transition-all duration-300 hover:-translate-y-0.5">
                                Mulai Sekarang
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Button asChild className="w-60 transform transition-all duration-300 hover:-translate-y-0.5">
                            <Link href="/dashboard">
                                Mulai Sekarang
                            </Link>
                        </Button>
                    </SignedIn>
                    <Button variant="outline" asChild className="w-60 transform transition-all duration-300 hover:-translate-y-0.5">
                        <Link href="/about">
                            Pelajari Lebih Lanjut
                        </Link>
                    </Button>
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 1.2,
                    }}
                    className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
                        <Image
                            src="/dash.png"
                            alt="Dashboard preview"
                            className="aspect-[16/9] w-full object-cover"
                            height={500}
                            width={1000}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}