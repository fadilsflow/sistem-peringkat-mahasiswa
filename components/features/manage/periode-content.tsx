"use client";

import { useState } from "react";
import { Periode } from "@prisma/client";
import { deletePeriode } from "@/lib/actions/periode";
import { PeriodeForm } from "@/components/forms/periode-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Plus, Pencil, Trash, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePeriodes } from "@/lib/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";

export function PeriodeContent() {
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [periodeToDelete, setPeriodeToDelete] = useState<Periode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const { data: periodeList = [], isError, error } = usePeriodes();

  async function handleDelete(periode: Periode) {
    try {
      setIsDeleting(true);
      toast.loading("Menghapus periode...");
      await deletePeriode(periode.id_periode);
      toast.dismiss();
      toast.success("Periode berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["periodes"] });
      setIsDeleteDialogOpen(false);
      setPeriodeToDelete(null);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Gagal menghapus periode");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEdit(periode: Periode) {
    setSelectedPeriode(periode);
    setIsEditDialogOpen(true);
  }

  function handleSuccess() {
    setIsEditDialogOpen(false);
    setSelectedPeriode(null);
    queryClient.invalidateQueries({ queryKey: ["periodes"] });
  }

  const columns: ColumnDef<Periode>[] = [
    {
      accessorKey: "id_periode",
      header: "ID Periodex",
    },
    {
      accessorKey: "tahun",
      header: "Tahun",
    },
    {
      accessorKey: "semester",
      header: "Semester",
    },
    {
      accessorKey: "w1_nilai_akademik",
      header: "Bobot Nilai Akademik",
      cell: ({ row }) => row.original.w1_nilai_akademik.toFixed(2),
    },
    {
      accessorKey: "w2_kehadiran",
      header: "Bobot Kehadiran",
      cell: ({ row }) => row.original.w2_kehadiran.toFixed(2),
    },
    {
      accessorKey: "w3_prestasi_akademik",
      header: "Bobot Prestasi Akademik",
      cell: ({ row }) => row.original.w3_prestasi_akademik.toFixed(2),
    },
    {
      accessorKey: "w4_prestasi_nonakademik",
      header: "Bobot Prestasi Non-akademik",
      cell: ({ row }) => row.original.w4_prestasi_nonakademik.toFixed(2),
    },
    {
      accessorKey: "w5_perilaku",
      header: "Bobot Perilaku",
      cell: ({ row }) => row.original.w5_perilaku.toFixed(2),
    },
    {
      accessorKey: "w6_keaktifan_organisasi",
      header: "Bobot Keaktifan Organisasi",
      cell: ({ row }) => row.original.w6_keaktifan_organisasi.toFixed(2),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const periode = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(periode)}
              className="hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setPeriodeToDelete(periode);
                setIsDeleteDialogOpen(true);
              }}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error)?.message || "Terjadi kesalahan saat memuat data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Periode</h2>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Periode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPeriode ? "Edit Periode" : "Tambah Periode"}
              </DialogTitle>
              <DialogDescription>
                {selectedPeriode
                  ? "Edit data periode yang sudah ada"
                  : "Tambahkan periode baru ke dalam sistem"}
              </DialogDescription>
            </DialogHeader>

            <PeriodeForm
              initialData={selectedPeriode || undefined}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {periodeList.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak ada data</CardTitle>
            <CardDescription>
              Silakan tambahkan periode baru dengan mengklik tombol Tambah
              Periode
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Periode</CardTitle>
            <CardDescription>
              Daftar periode yang tersedia dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={periodeList}
              filterColumn="id_periode"
              filterPlaceholder="Filter ID periode..."
            />
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus periode ini?
              {periodeToDelete && (
                <p className="mt-2 font-medium">
                  {periodeToDelete.tahun} - Semester {periodeToDelete.semester}
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPeriodeToDelete(null);
              }}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => periodeToDelete && handleDelete(periodeToDelete)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
