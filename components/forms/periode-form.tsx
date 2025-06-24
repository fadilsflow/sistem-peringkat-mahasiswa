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
import { createPeriode, updatePeriode } from "@/lib/actions/periode";
import { Periode } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

// Helper function to format number to 2 decimal places
const formatNumber = (num: number) => Number(num.toFixed(2));

const periodeFormSchema = z
  .object({
    id_periode: z.string().min(1, "ID Periode harus diisi"),
    tahun: z.string().min(1, "Tahun harus diisi"),
    semester: z.coerce.number().min(1).max(2),
    w1_nilai_akademik: z.coerce
      .number()
      .min(0, "Minimal 0")
      .max(1, "Maksimal 1")
      .transform(formatNumber),
    w2_kehadiran: z.coerce
      .number()
      .min(0, "Minimal 0")
      .max(1, "Maksimal 1")
      .transform(formatNumber),
    w3_prestasi_akademik: z.coerce
      .number()
      .min(0, "Minimal 0")
      .max(1, "Maksimal 1")
      .transform(formatNumber),
    w4_prestasi_nonakademik: z.coerce
      .number()
      .min(0, "Minimal 0")
      .max(1, "Maksimal 1")
      .transform(formatNumber),
    w5_perilaku: z.coerce
      .number()
      .min(0, "Minimal 0")
      .max(1, "Maksimal 1")
      .transform(formatNumber),
    w6_keaktifan_organisasi: z.coerce
      .number()
      .min(0, "Minimal 0")
      .max(1, "Maksimal 1")
      .transform(formatNumber),
    deskripsi: z.string(),
  })
  .refine(
    (data) => {
      const sum = formatNumber(
        data.w1_nilai_akademik +
          data.w2_kehadiran +
          data.w3_prestasi_akademik +
          data.w4_prestasi_nonakademik +
          data.w5_perilaku +
          data.w6_keaktifan_organisasi
      );
      return sum === 1;
    },
    {
      message: "Total bobot harus sama dengan 1",
      path: ["w1_nilai_akademik"],
    }
  );

type PeriodeFormValues = z.infer<typeof periodeFormSchema>;

interface PeriodeFormProps {
  initialData?: Periode;
  onSuccess?: () => void;
}

export function PeriodeForm({ initialData, onSuccess }: PeriodeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const form = useForm<PeriodeFormValues>({
    resolver: zodResolver(periodeFormSchema),
    defaultValues: {
      id_periode: initialData?.id_periode || "",
      tahun:
        initialData?.tahun.toString() || new Date().getFullYear().toString(),
      semester: initialData?.semester || 1,
      w1_nilai_akademik: initialData?.w1_nilai_akademik || 0.3,
      w2_kehadiran: initialData?.w2_kehadiran || 0.2,
      w3_prestasi_akademik: initialData?.w3_prestasi_akademik || 0.15,
      w4_prestasi_nonakademik: initialData?.w4_prestasi_nonakademik || 0.15,
      w5_perilaku: initialData?.w5_perilaku || 0.1,
      w6_keaktifan_organisasi: initialData?.w6_keaktifan_organisasi || 0.1,
      deskripsi: initialData?.deskripsi || "",
    },
  });

  async function onSubmit(data: PeriodeFormValues) {
    if (!userId) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    try {
      setIsLoading(true);
      const periodeData = {
        ...data,
        userId, // Add userId to the periode data
      };

      if (initialData) {
        await updatePeriode(initialData.id_periode, periodeData);
        toast.success("Periode berhasil diupdate");
      } else {
        await createPeriode(periodeData);
        toast.success("Periode berhasil dibuat");
        form.reset();
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Error:", error);
      if (error.message?.includes("Unique constraint")) {
        toast.error("Periode dengan ID tersebut sudah ada untuk user ini");
      } else {
        toast.error("Terjadi kesalahan");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[500px] overflow-y-auto px-1"
      >
        <FormField
          control={form.control}
          name="id_periode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Periode</FormLabel>
              <FormControl>
                <Input placeholder="2024-1" {...field} />
              </FormControl>
              <FormDescription>
                Format: TAHUN-SEMESTER (contoh: 2024-1)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tahun"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={2}
                    placeholder="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Bobot Kriteria</h3>
          <p className="text-sm text-muted-foreground">
            Total bobot harus sama dengan 1 (100%)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="w1_nilai_akademik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Akademik</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.3"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value * 100).toFixed(0)}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="w2_kehadiran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kehadiran</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.2"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value * 100).toFixed(0)}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="w3_prestasi_akademik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prestasi Akademik</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.15"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value * 100).toFixed(0)}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="w4_prestasi_nonakademik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prestasi Non-akademik</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.15"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value * 100).toFixed(0)}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="w5_perilaku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perilaku</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.1"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value * 100).toFixed(0)}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="w6_keaktifan_organisasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keaktifan Organisasi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.1"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value * 100).toFixed(0)}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Input placeholder="Deskripsi periode..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Menyimpan..."
            : initialData
              ? "Update Periode"
              : "Tambah Periode"}
        </Button>
      </form>
    </Form>
  );
}
