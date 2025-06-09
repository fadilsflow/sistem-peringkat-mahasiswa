"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Plus,
  Upload,
  Download,
  School,
  Pencil,
  Trash,
} from "lucide-react";
import { MahasiswaForm } from "./mahasiswa-form";
import ExcelImport from "./excel-import";
import ExcelExport from "./excel-export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeriodes, useMahasiswaByPeriode } from "@/lib/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { Mahasiswa } from "@prisma/client";
import { deleteMahasiswa } from "@/lib/actions/mahasiswa";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

export function MahasiswaContent() {
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mahasiswaToDelete, setMahasiswaToDelete] = useState<Mahasiswa | null>(
    null
  );
  const queryClient = useQueryClient();

  const {
    data: periodeList = [],
    isError: isPeriodeError,
    error: periodeError,
  } = usePeriodes();

  const {
    data: mahasiswaList = [],
    isError: isMahasiswaError,
    error: mahasiswaError,
  } = useMahasiswaByPeriode(selectedPeriodeId);

  // Set initial periode
  useEffect(() => {
    if (selectedPeriodeId === "" && periodeList.length > 0) {
      setSelectedPeriodeId(periodeList[0].id_periode);
    }
  }, [periodeList, selectedPeriodeId]);

  const handleSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedMahasiswa(null);
    // Invalidate and refetch queries
    queryClient.invalidateQueries({ queryKey: ["periodes"] });
    if (selectedPeriodeId) {
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa", selectedPeriodeId],
      });
    }
  };

  const handleEdit = (mahasiswa: Mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (mahasiswa: Mahasiswa) => {
    try {
      await deleteMahasiswa(mahasiswa.nim);
      toast.success("Data mahasiswa berhasil dihapus");
      if (selectedPeriodeId) {
        await queryClient.invalidateQueries({
          queryKey: ["mahasiswa", selectedPeriodeId],
        });
      }
      setIsDeleteDialogOpen(false);
      setMahasiswaToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data mahasiswa");
    }
  };

  if (isPeriodeError || isMahasiswaError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(periodeError as Error)?.message ||
            (mahasiswaError as Error)?.message ||
            "Terjadi kesalahan saat memuat data"}
        </AlertDescription>
      </Alert>
    );
  }

  const columns: ColumnDef<Mahasiswa>[] = [
    {
      accessorKey: "nim",
      header: "NIM",
    },
    {
      accessorKey: "nama",
      header: "Nama",
    },
    {
      accessorKey: "nilai_akademik",
      header: "Nilai Akademik",
    },
    {
      accessorKey: "kehadiran",
      header: "Kehadiran",
    },
    {
      accessorKey: "prestasi_akademik",
      header: "Prestasi Akademik",
    },
    {
      accessorKey: "prestasi_nonakademik",
      header: "Prestasi Non-akademik",
    },
    {
      accessorKey: "perilaku",
      header: "Perilaku",
    },
    {
      accessorKey: "keaktifan_organisasi",
      header: "Keaktifan Organisasi",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const mahasiswa = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(mahasiswa)}
              className="hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setMahasiswaToDelete(mahasiswa);
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Data Mahasiswa</h2>
        <p className="text-muted-foreground mt-2">
          Kelola data mahasiswa berdasarkan periode
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Daftar Mahasiswa</CardTitle>
            </div>
            <Select
              value={selectedPeriodeId}
              onValueChange={setSelectedPeriodeId}
            >
              <SelectTrigger className="w-[240px]">
                <School className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                {periodeList.map((periode) => (
                  <SelectItem
                    key={periode.id_periode}
                    value={periode.id_periode}
                  >
                    {periode.tahun} - Semester {periode.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedPeriodeId && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Data Mahasiswa</DialogTitle>
                  </DialogHeader>
                  <ExcelImport
                    periodeId={selectedPeriodeId}
                    key={selectedPeriodeId}
                  />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={() => ExcelExport({ data: mahasiswaList })}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Mahasiswa
            </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedMahasiswa
                        ? "Edit Mahasiswa"
                        : "Tambah Mahasiswa Baru"}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedMahasiswa
                        ? "Edit data mahasiswa yang sudah ada"
                        : "Tambahkan data mahasiswa baru ke dalam sistem"}
                    </DialogDescription>
                  </DialogHeader>
                  <MahasiswaForm
                    initialData={selectedMahasiswa || undefined}
                    periodeList={periodeList}
                    onSuccess={handleSuccess}
                  />
                </DialogContent>
              </Dialog>
          </div>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mahasiswaList}
            filterColumn="nama"
            filterPlaceholder="Filter nama..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data mahasiswa ini?
              {mahasiswaToDelete && (
                <p className="mt-2 font-medium">
                  {mahasiswaToDelete.nim} - {mahasiswaToDelete.nama}
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setMahasiswaToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                mahasiswaToDelete && handleDelete(mahasiswaToDelete)
              }
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
