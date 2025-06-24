"use client";

import { useState, useEffect } from "react";
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
import { DataTable } from "@/components/shared/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Plus,
  Upload,
  MoreHorizontal,
  Loader2,
  Calendar,
} from "lucide-react";
import { MahasiswaForm } from "@/components/forms/mahasiswa-form";
import { PeriodeForm } from "@/components/forms/periode-form";
import ExcelImport from "@/components/shared/excel-import";
import ExcelExport from "@/components/shared/excel-export";
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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const {
    data: periodeList = [],
    isError: isPeriodeError,
    error: periodeError,
  } = usePeriodes();

  // Only fetch mahasiswa if we have a valid period selected
  const {
    data: mahasiswaList = [],
    isError: isMahasiswaError,
    error: mahasiswaError,
  } = useMahasiswaByPeriode(
    // Only pass the periodeId if it exists in the current list
    periodeList.some((p) => p.id === selectedPeriodeId)
      ? selectedPeriodeId
      : null
  );

  // Set initial periode only if we have periods and current selection is invalid
  useEffect(() => {
    if (periodeList.length > 0) {
      // If no period is selected or selected period doesn't exist anymore
      if (
        !selectedPeriodeId ||
        !periodeList.some((p) => p.id === selectedPeriodeId)
      ) {
        setSelectedPeriodeId(periodeList[0].id);
      }
    } else {
      // If no periods exist, clear selection
      setSelectedPeriodeId("");
    }
  }, [periodeList, selectedPeriodeId]);

  const handleSuccess = () => {
    // Close all dialogs
    setIsEditPeriodeDialogOpen(false);
    setIsEditMahasiswaDialogOpen(false);
    setSelectedPeriode(null);
    setSelectedMahasiswa(null);

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
      toast.loading("Menghapus periode...");
      await deletePeriode(periode.id);
      toast.dismiss();
      toast.success("Periode berhasil dihapus");

      // Invalidate both queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["periodes"] });

      // Remove the mahasiswa data for the deleted period from the cache
      queryClient.setQueryData(["mahasiswa", periode.id], []);
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa", periode.id],
        exact: true,
      });

      // If we're deleting the currently selected periode, select the next available one
      if (selectedPeriodeId === periode.id) {
        const updatedPeriodes = periodeList.filter((p) => p.id !== periode.id);
        if (updatedPeriodes.length > 0) {
          setSelectedPeriodeId(updatedPeriodes[0].id);
        } else {
          setSelectedPeriodeId("");
        }
      }

      setIsDeleteDialogOpen(false);
      setPeriodeToDelete(null);
      setSelectedPeriode(null);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error((error as Error)?.message || "Gagal menghapus periode", {
        description:
          "Pastikan tidak ada mahasiswa yang terdaftar di periode ini sebelum menghapus.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMahasiswa = async (mahasiswa: Mahasiswa) => {
    try {
      setIsDeleting(true);
      toast.loading("Menghapus data mahasiswa...");
      await deleteMahasiswa(mahasiswa.nim, selectedPeriodeId);
      toast.dismiss();
      toast.success("Data mahasiswa berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa", selectedPeriodeId],
      });
      setSelectedMahasiswa(null);
      setIsDeleteMahasiswaDialogOpen(false);
      setMahasiswaToDelete(null);
    } catch (error) {
      console.error(error);
      toast.dismiss();
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
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditMahasiswa(mahasiswa)}>
                Ubah
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setMahasiswaToDelete(mahasiswa);
                  setIsDeleteMahasiswaDialogOpen(true);
                }}
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const periodeColumns: PeriodeColumn[] = [
    {
      accessorKey: "kode_periode",
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
      header: "Bobot Nilai Akademik",
    },
    {
      accessorKey: "w2_kehadiran",
      header: "Bobot Kehadiran",
    },
    {
      accessorKey: "w3_prestasi_akademik",
      header: "Bobot Prestasi Akademik",
    },
    {
      accessorKey: "w4_prestasi_nonakademik",
      header: "Bobot Prestasi Non-akademik",
    },
    {
      accessorKey: "w5_perilaku",
      header: "Bobot Perilaku",
    },
    {
      accessorKey: "w6_keaktifan_organisasi",
      header: "Bobot Keaktifan Organisasi",
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
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditPeriode(periode)}>
                Ubah
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setPeriodeToDelete(periode);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handlePeriodeChange = (value: string) => {
    setSelectedPeriodeId(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kelola Data</h2>
        <p className="text-muted-foreground mt-2">
          Kelola data periode dan mahasiswa yang terdaftar di dalamnya
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Data Periode</CardTitle>
                <CardDescription>
                  Daftar periode yang tersedia. Klik tombol di bawah untuk
                  menambah periode baru.
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
                  </DialogHeader>
                  <PeriodeForm onSuccess={handleSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isPeriodeError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Memuat Periode</AlertTitle>
                <AlertDescription>
                  {(periodeError as Error)?.message ||
                    "Gagal memuat daftar periode."}
                </AlertDescription>
              </Alert>
            ) : (
              <DataTable
                columns={periodeColumns}
                data={periodeList}
                filterColumn="deskripsi"
                filterPlaceholder="Cari berdasarkan deskripsi..."
              />
            )}
          </CardContent>
        </Card>

        {/* Section Mahasiswa */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Data Mahasiswa</CardTitle>
                <CardDescription>
                  Pilih periode untuk melihat dan mengelola data mahasiswa
                </CardDescription>
              </div>
              <Select
                value={selectedPeriodeId}
                onValueChange={handlePeriodeChange}
              >
                <SelectTrigger className="w-full sm:w-[350px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  {periodeList.map((periode) => (
                    <SelectItem key={periode.id} value={periode.id}>
                      Periode {periode.kode_periode} - Tahun {periode.tahun}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPeriodeId && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Dialog
                  open={isImportDialogOpen}
                  onOpenChange={setIsImportDialogOpen}
                >
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
                      onSuccess={() => {
                        handleSuccess();
                        setIsImportDialogOpen(false);
                      }}
                      periodeId={selectedPeriodeId}
                    />
                  </DialogContent>
                </Dialog>

                <ExcelExport
                  data={mahasiswaList}
                  filename={`mahasiswa_${selectedPeriodeId}`}
                />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Mahasiswa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Data Mahasiswa</DialogTitle>
                    </DialogHeader>
                    <MahasiswaForm
                      onSuccess={handleSuccess}
                      periodeId={selectedPeriodeId}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!selectedPeriodeId ? (
              <div className="text-center text-muted-foreground">
                <p>Pilih periode untuk menampilkan data mahasiswa.</p>
              </div>
            ) : isMahasiswaError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Memuat Mahasiswa</AlertTitle>
                <AlertDescription>
                  {(mahasiswaError as Error)?.message ||
                    "Gagal memuat data mahasiswa untuk periode ini."}
                </AlertDescription>
              </Alert>
            ) : (
              <DataTable
                columns={mahasiswaColumns}
                data={mahasiswaList}
                filterColumn="nama"
                filterPlaceholder="Cari mahasiswa..."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Periode Dialog */}
      <Dialog
        open={isEditPeriodeDialogOpen}
        onOpenChange={setIsEditPeriodeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Data Periode</DialogTitle>
          </DialogHeader>
          {selectedPeriode && (
            <PeriodeForm
              initialData={selectedPeriode}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Mahasiswa Dialog */}
      <Dialog
        open={isEditMahasiswaDialogOpen}
        onOpenChange={setIsEditMahasiswaDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Data Mahasiswa</DialogTitle>
          </DialogHeader>
          {selectedMahasiswa && selectedPeriodeId && (
            <MahasiswaForm
              initialData={selectedMahasiswa}
              onSuccess={handleSuccess}
              periodeId={selectedPeriodeId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Periode Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus periode{" "}
              <strong>{periodeToDelete?.kode_periode}</strong>? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Mahasiswa Confirmation */}
      <Dialog
        open={isDeleteMahasiswaDialogOpen}
        onOpenChange={setIsDeleteMahasiswaDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus mahasiswa dengan NIM{" "}
              <strong>{mahasiswaToDelete?.nim}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteMahasiswaDialogOpen(false)}
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
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
