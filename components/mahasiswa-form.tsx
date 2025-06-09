"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMahasiswa, updateMahasiswa } from "@/lib/actions/mahasiswa";
import { Mahasiswa, Periode } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

const mahasiswaFormSchema = z.object({
  nim: z.string().min(1, "NIM harus diisi"),
  nama: z.string().min(1, "Nama harus diisi"),
  periodeId_periode: z.string().min(1, "Periode harus dipilih"),
  nilai_akademik: z.coerce.number().min(0).max(100),
  kehadiran: z.coerce.number().min(0).max(100),
  prestasi_akademik: z.coerce.number().min(0).max(5),
  prestasi_nonakademik: z.coerce.number().min(0).max(5),
  perilaku: z.coerce.number().min(1).max(5),
  keaktifan_organisasi: z.coerce.number().min(1).max(5),
});

type MahasiswaFormValues = z.infer<typeof mahasiswaFormSchema>;

interface MahasiswaFormProps {
  initialData?: Mahasiswa;
  periodeList: Periode[];
  onSuccess?: () => void;
}

export function MahasiswaForm({
  initialData,
  periodeList,
  onSuccess,
}: MahasiswaFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MahasiswaFormValues>({
    resolver: zodResolver(mahasiswaFormSchema),
    defaultValues: initialData || {
      nim: "",
      nama: "",
      periodeId_periode: "",
      nilai_akademik: 0,
      kehadiran: 0,
      prestasi_akademik: 0,
      prestasi_nonakademik: 0,
      perilaku: 1,
      keaktifan_organisasi: 1,
    },
  });

  async function onSubmit(data: MahasiswaFormValues) {
    try {
      setIsLoading(true);
      if (initialData) {
        await updateMahasiswa(initialData.nim, data);
      } else {
        await createMahasiswa(data);
      }
      toast.success(
        initialData
          ? "Data mahasiswa berhasil diupdate"
          : "Data mahasiswa berhasil ditambahkan"
      );
      onSuccess?.();
      if (!initialData) form.reset();
    } catch (error) {
      toast.error("Terjadi kesalahan");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIM</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345"
                    {...field}
                    disabled={!!initialData}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Mahasiswa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="periodeId_periode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {periodeList.map((periode) => (
                    <SelectItem
                      key={periode.id_periode}
                      value={periode.id_periode}
                    >
                      {periode.tahun} Semester {periode.semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nilai_akademik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Akademik</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    placeholder="80"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Skala 0-100</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kehadiran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kehadiran</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    placeholder="90"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Persentase 0-100</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prestasi_akademik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prestasi Akademik</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Skala 0-5</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prestasi_nonakademik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prestasi Non-akademik</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Skala 0-5</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="perilaku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perilaku</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Skala 1-5</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keaktifan_organisasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keaktifan Organisasi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Skala 1-5</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Menyimpan..."
            : initialData
            ? "Update Data"
            : "Tambah Data"}
        </Button>   
      </form>
    </Form>
  );
}
