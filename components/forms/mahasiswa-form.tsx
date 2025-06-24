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
import { Mahasiswa } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePeriodes } from "@/lib/hooks/use-queries";
import { Loader2 } from "lucide-react";

const mahasiswaFormSchema = z.object({
  nim: z.string().min(1, "NIM harus diisi"),
  nama: z.string().min(1, "Nama harus diisi"),
  periodeId: z.string().min(1, "Periode harus dipilih"),
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
  periodeId?: string;
  onSuccess?: () => void;
}

export function MahasiswaForm({
  initialData,
  periodeId,
  onSuccess,
}: MahasiswaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: periodeList, isLoading: isPeriodeLoading } = usePeriodes();

  const form = useForm<MahasiswaFormValues>({
    resolver: zodResolver(mahasiswaFormSchema),
    defaultValues: {
      nim: initialData?.nim || "",
      nama: initialData?.nama || "",
      periodeId: initialData?.periodeId || periodeId || "",
      nilai_akademik: initialData?.nilai_akademik || 0,
      kehadiran: initialData?.kehadiran || 0,
      prestasi_akademik: initialData?.prestasi_akademik || 0,
      prestasi_nonakademik: initialData?.prestasi_nonakademik || 0,
      perilaku: initialData?.perilaku || 1,
      keaktifan_organisasi: initialData?.keaktifan_organisasi || 1,
    },
  });

  useEffect(() => {
    const defaultValues = {
      nim: initialData?.nim || "",
      nama: initialData?.nama || "",
      periodeId: initialData?.periodeId || periodeId || "",
      nilai_akademik: initialData?.nilai_akademik || 0,
      kehadiran: initialData?.kehadiran || 0,
      prestasi_akademik: initialData?.prestasi_akademik || 0,
      prestasi_nonakademik: initialData?.prestasi_nonakademik || 0,
      perilaku: initialData?.perilaku || 1,
      keaktifan_organisasi: initialData?.keaktifan_organisasi || 1,
    };
    form.reset(defaultValues);
  }, [initialData, periodeId, form]);

  async function onSubmit(data: MahasiswaFormValues) {
    try {
      setIsLoading(true);
      if (initialData) {
        await updateMahasiswa(initialData.nim, initialData.periodeId, {
          ...data,
          periodeId: data.periodeId, // ensure periodeId is passed
        });
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
      toast.error(
        (error as Error)?.message || "Terjadi kesalahan saat menyimpan data."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const effectivePeriodeId = form.watch("periodeId");

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
                    disabled={!!initialData || isLoading}
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
                  <Input
                    placeholder="Nama Mahasiswa"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="periodeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periode</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!initialData || !!periodeId || isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    {isPeriodeLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Memuat periode...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Pilih periode" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {periodeList?.map((periode) => (
                    <SelectItem key={periode.id} value={periode.id}>
                      {`Periode ${periode.kode_periode} - ${periode.tahun}`}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>Skala 1-5</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={!effectivePeriodeId || isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Simpan Perubahan" : "Tambah Mahasiswa"}
        </Button>
      </form>
    </Form>
  );
}
