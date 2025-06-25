"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ManageDataPreview() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-3xl font-light text-primary mb-4"
          >
            Kelola Data dengan Mudah dan Intuitif
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="max-w-2xl mx-auto text-primary"
          >
            Manajemen data mahasiswa, kriteria, dan alternatif menjadi lebih
            sederhana. Dengan dukungan impor dan ekspor file Excel, kelola data
            dalam jumlah besar jadi lebih cepat dan efisien.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="z-10 rounded-2xl sm:rounded-3xl border border-primary bg-background p-2 sm:p-3 shadow-md max-w-5xl mx-auto"
        >
          <div className="w-full overflow-hidden rounded-xl border border-primary">
            <Image
              src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1750844663/3_dhcyul.png"
              alt="Pratinjau Halaman Kelola Data"
              className="aspect-[16/9] w-full object-cover"
              height={720}
              width={1280}
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
