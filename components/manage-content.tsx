"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { MahasiswaForm } from "./mahasiswa-form";
import { PeriodeForm } from "./periode-form";
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
import { Mahasiswa, Periode } from "@prisma/client";
import { deletePeriode } from "@/lib/actions/periode";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMahasiswa } from "@/lib/actions/mahasiswa";

interface PeriodeColumn {
  id?: string;
  accessorKey?: keyof Periode;
  header: string;
  cell?: ({ row }: { row: { original: Periode } }) => React.ReactElement;
}
interface MahasiswaColumn {
  id?: string;
  accessorKey?: keyof Mahasiswa;
  header: string;
  cell?: ({ row }: { row: { original: Mahasiswa } }) => React.ReactElement;
}

export function ManageContent() {
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(
    null
  );
  const [isEditPeriodeDialogOpen, setIsEditPeriodeDialogOpen] = useState(false);
  const [isEditMahasiswaDialogOpen, setIsEditMahasiswaDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [periodeToDelete, setPeriodeToDelete] = useState<Periode | null>(null);
  const [isDeleteMahasiswaDialogOpen, setIsDeleteMahasiswaDialogOpen] =
    useState(false);
  const [mahasiswaToDelete, setMahasiswaToDelete] = useState<Mahasiswa | null>(
    null
  );
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

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
  if (selectedPeriodeId === "" && periodeList.length > 0) {
    setSelectedPeriodeId(periodeList[0].id_periode);
  }

  const handleSuccess = () => {
    // Invalidate and refetch queries
    queryClient.invalidateQueries({ queryKey: ["periodes"] });
    if (selectedPeriodeId) {
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa", selectedPeriodeId],
      });
    }
  };

  const handleEditPeriode = (periode: Periode) => {
    setSelectedPeriode(periode);
    setIsEditPeriodeDialogOpen(true);
  };

  const handleEditMahasiswa = (mahasiswa: Mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setIsEditMahasiswaDialogOpen(true);
  };

  const handleDelete = async (periode: Periode) => {
    try {
      setIsDeleting(true);
      await deletePeriode(periode.id_periode);
      // Invalidate both queries to update the UI
      await queryClient.invalidateQueries({ queryKey: ["periodes"] });
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa", periode.id_periode],
        exact: true,
      });

      // If we're deleting the currently selected periode, reset selection
      if (selectedPeriodeId === periode.id_periode) {
        setSelectedPeriodeId("");
      }

      toast.success("Periode berhasil dihapus");
      setIsDeleteDialogOpen(false);
      setPeriodeToDelete(null);
      setSelectedPeriode(null);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus periode");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMahasiswa = async (mahasiswa: Mahasiswa) => {
    try {
      setIsDeleting(true);
      await deleteMahasiswa(mahasiswa.nim);
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa", selectedPeriodeId],
      });
      setSelectedMahasiswa(null);
      setIsDeleteMahasiswaDialogOpen(false);
      setMahasiswaToDelete(null);
      toast.success("Data mahasiswa berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data mahasiswa");
    } finally {
      setIsDeleting(false);
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

  const mahasiswaColumns: MahasiswaColumn[] = [
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
      header: "Prestasi Non-Akademik",
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setMahasiswaToDelete(mahasiswa);
                  setIsDeleteMahasiswaDialogOpen(true);
                }}
                className="text-red-600"
              >
                Hapus
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditMahasiswa(mahasiswa)}
                className="text-blue-600"
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const periodeColumns: PeriodeColumn[] = [
    {
      accessorKey: "id_periode",
      header: "ID Periode",
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
      header: "Bobot Nilai",
      cell: ({ row }) => (
        <span>{(row.original.w1_nilai_akademik * 100).toFixed(1)}%</span>
      ),
    },
    {
      accessorKey: "w2_kehadiran",
      header: "Bobot Kehadiran",
      cell: ({ row }) => (
        <span>{(row.original.w2_kehadiran * 100).toFixed(1)}%</span>
      ),
    },
    {
      accessorKey: "w3_prestasi_akademik",
      header: "Bobot Prestasi Akademik",
      cell: ({ row }) => (
        <span>{(row.original.w3_prestasi_akademik * 100).toFixed(1)}%</span>
      ),
    },
    {
      accessorKey: "w4_prestasi_nonakademik",
      header: "Bobot Prestasi Non Akademik",
      cell: ({ row }) => (
        <span>{(row.original.w4_prestasi_nonakademik * 100).toFixed(1)}%</span>
      ),
    },
    {
      accessorKey: "w5_perilaku",
      header: "Bobot Perilaku",
      cell: ({ row }) => (
        <span>{(row.original.w5_perilaku * 100).toFixed(1)}%</span>
      ),
    },
    {
      accessorKey: "w6_keaktifan_organisasi",
      header: "Bobot Keaktifan Organisasi",
      cell: ({ row }) => (
        <span>{(row.original.w6_keaktifan_organisasi * 100).toFixed(1)}%</span>
      ),
    },
    {
      accessorKey: "deskripsi",
      header: "Deskripsi",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const periode = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setPeriodeToDelete(periode);
                  setIsDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditPeriode(periode)}
                className="text-blue-600"
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Manajemen Data
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Kelola data mahasiswa dan periode penilaian
        </p>
      </div>

      {/* Periode Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Periode</CardTitle>
              <CardDescription>
                Daftar periode penilaian yang tersedia
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Periode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Periode Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan periode penilaian baru ke dalam sistem
                  </DialogDescription>
                </DialogHeader>
                <PeriodeForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={periodeColumns}
            data={periodeList}
            filterColumn="tahun"
            filterPlaceholder="Filter tahun..."
          />
        </CardContent>
      </Card>

      {/* Mahasiswa Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Data Mahasiswa</CardTitle>
              <CardDescription>
                Kelola data mahasiswa berdasarkan periode yang dipilih
              </CardDescription>
            </div>
            <Select
              value={selectedPeriodeId}
              onValueChange={setSelectedPeriodeId}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                {periodeList.map((periode) => (
                  <SelectItem
                    key={periode.id_periode}
                    value={periode.id_periode}
                  >
                    {periode.id_periode} - {periode.tahun}
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
                    <DialogDescription>
                      Upload file Excel untuk menambahkan data mahasiswa secara
                      massal
                    </DialogDescription>
                  </DialogHeader>
                  <ExcelImport
                    periodeId={selectedPeriodeId}
                    onSuccess={() => {
                      // Invalidate mahasiswa query to refresh the data
                      queryClient.invalidateQueries({
                        queryKey: ["mahasiswa", selectedPeriodeId],
                        exact: true,
                      });
                      toast.success("Data mahasiswa berhasil diimpor");
                    }}
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Mahasiswa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
                    <DialogDescription>
                      Tambahkan data mahasiswa baru ke dalam sistem
                    </DialogDescription>
                  </DialogHeader>
                  <MahasiswaForm
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
            columns={mahasiswaColumns}
            data={mahasiswaList}
            filterColumn="nama"
            filterPlaceholder="Filter nama..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open);
            if (!open) setPeriodeToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>Apakah Anda yakin ingin menghapus periode ini?</p>
                {periodeToDelete && (
                  <div className="rounded-lg border p-3">
                    <p>
                      <strong>Periode:</strong> {periodeToDelete.tahun} -
                      Semester {periodeToDelete.semester}
                    </p>
                    <p>
                      <strong>Deskripsi:</strong>{" "}
                      {periodeToDelete.deskripsi || "-"}
                    </p>
                    <p className="text-red-500 mt-2">
                      Perhatian: Semua data mahasiswa dalam periode ini akan
                      ikut terhapus!
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (periodeToDelete) {
                  handleDelete(periodeToDelete);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Periode Dialog */}
      <Dialog
        open={isEditPeriodeDialogOpen}
        onOpenChange={setIsEditPeriodeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Periode</DialogTitle>
            <DialogDescription>
              Edit data periode yang sudah ada
            </DialogDescription>
          </DialogHeader>
          <PeriodeForm
            initialData={selectedPeriode || undefined}
            onSuccess={() => {
              setIsEditPeriodeDialogOpen(false);
              setSelectedPeriode(null);
              handleSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Mahasiswa Dialog */}
      <Dialog
        open={isEditMahasiswaDialogOpen}
        onOpenChange={setIsEditMahasiswaDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mahasiswa</DialogTitle>
            <DialogDescription>
              Edit data mahasiswa yang sudah ada
            </DialogDescription>
          </DialogHeader>
          <MahasiswaForm
            initialData={selectedMahasiswa || undefined}
            periodeList={periodeList}
            onSuccess={() => {
              setIsEditMahasiswaDialogOpen(false);
              setSelectedMahasiswa(null);
              handleSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Mahasiswa Confirmation Dialog */}
      <Dialog
        open={isDeleteMahasiswaDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteMahasiswaDialogOpen(open);
            if (!open) setMahasiswaToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>Apakah Anda yakin ingin menghapus data mahasiswa ini?</p>
                {mahasiswaToDelete && (
                  <div className="rounded-lg border p-3">
                    <p>
                      <strong>NIM:</strong> {mahasiswaToDelete.nim}
                    </p>
                    <p>
                      <strong>Nama:</strong> {mahasiswaToDelete.nama}
                    </p>
                    <p>
                      <strong>Nilai Akademik:</strong>{" "}
                      {mahasiswaToDelete.nilai_akademik}
                    </p>
                    <p>
                      <strong>Kehadiran:</strong> {mahasiswaToDelete.kehadiran}%
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteMahasiswaDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (mahasiswaToDelete) {
                  handleDeleteMahasiswa(mahasiswaToDelete);
                }
              }}
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
