"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createMahasiswa } from "@/lib/actions/mahasiswa";

interface MahasiswaFormInputProps {
  periodeId: string;
  onSuccess: () => void;
}

export function MahasiswaFormInput({
  periodeId,
  onSuccess,
}: MahasiswaFormInputProps) {
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    nilai_akademik: "",
    kehadiran: "",
    prestasi_akademik: "0",
    prestasi_nonakademik: "0",
    perilaku: "1",
    keaktifan_organisasi: "1",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!periodeId) {
      toast.error("Pilih periode terlebih dahulu");
      return;
    }

    try {
      await createMahasiswa({
        ...formData,
        nilai_akademik: parseFloat(formData.nilai_akademik),
        kehadiran: parseFloat(formData.kehadiran),
        prestasi_akademik: parseInt(formData.prestasi_akademik),
        prestasi_nonakademik: parseInt(formData.prestasi_nonakademik),
        perilaku: parseInt(formData.perilaku),
        keaktifan_organisasi: parseInt(formData.keaktifan_organisasi),
        periodeId: periodeId,
      });

      setFormData({
        nim: "",
        nama: "",
        nilai_akademik: "",
        kehadiran: "",
        prestasi_akademik: "0",
        prestasi_nonakademik: "0",
        perilaku: "1",
        keaktifan_organisasi: "1",
      });

      toast.success("Data mahasiswa berhasil disimpan");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data mahasiswa");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Data Mahasiswa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="nim">NIM</Label>
            <Input
              id="nim"
              value={formData.nim}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nim: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nama: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="nilai_akademik">Nilai Akademik (0-100)</Label>
            <Input
              id="nilai_akademik"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.nilai_akademik}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nilai_akademik: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="kehadiran">Kehadiran (%)</Label>
            <Input
              id="kehadiran"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.kehadiran}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  kehadiran: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="prestasi_akademik">Prestasi Akademik (0-5)</Label>
            <Select
              value={formData.prestasi_akademik}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  prestasi_akademik: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="prestasi_nonakademik">
              Prestasi Non-Akademik (0-5)
            </Label>
            <Select
              value={formData.prestasi_nonakademik}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  prestasi_nonakademik: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="perilaku">Perilaku (1-5)</Label>
            <Select
              value={formData.perilaku}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, perilaku: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="keaktifan_organisasi">
              Keaktifan Organisasi (1-5)
            </Label>
            <Select
              value={formData.keaktifan_organisasi}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  keaktifan_organisasi: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">Simpan</Button>
        </form>
      </CardContent>
    </Card>
  );
}
