"use client"

import { Mahasiswa } from "@/lib/generated/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useState } from "react"
import { MahasiswaForm } from "./mahasiswa-form"
import { toast } from "sonner"
import { deleteMahasiswa } from "@/lib/actions/mahasiswa"

interface MahasiswaTableProps {
  data: Mahasiswa[]
  periodeList: any[]
  onSuccess: () => void
}

export function MahasiswaTable({ data, periodeList, onSuccess }: MahasiswaTableProps) {
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleDelete(nim: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) return

    try {
      await deleteMahasiswa(nim)
      toast.success("Data mahasiswa berhasil dihapus")
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Gagal menghapus data mahasiswa")
    }
  }

  function handleEdit(mahasiswa: Mahasiswa) {
    setSelectedMahasiswa(mahasiswa)
    setIsDialogOpen(true)
  }

  function handleFormSuccess() {
    setIsDialogOpen(false)
    setSelectedMahasiswa(null)
    onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Mahasiswa</CardTitle>
        <CardDescription>Daftar mahasiswa untuk periode yang dipilih</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Tambah Mahasiswa</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedMahasiswa ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}
                </DialogTitle>
              </DialogHeader>
              <MahasiswaForm
                initialData={selectedMahasiswa || undefined}
                periodeList={periodeList}
                onSuccess={handleFormSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIM</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Nilai Akademik</TableHead>
              <TableHead>Kehadiran</TableHead>
              <TableHead>Prestasi Akademik</TableHead>
              <TableHead>Prestasi Non-akademik</TableHead>
              <TableHead>Perilaku</TableHead>
              <TableHead>Keaktifan Organisasi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((mahasiswa) => (
              <TableRow key={mahasiswa.nim}>
                <TableCell>{mahasiswa.nim}</TableCell>
                <TableCell>{mahasiswa.nama}</TableCell>
                <TableCell>{mahasiswa.nilai_akademik.toFixed(2)}</TableCell>
                <TableCell>{mahasiswa.kehadiran.toFixed(2)}%</TableCell>
                <TableCell>{mahasiswa.prestasi_akademik}</TableCell>
                <TableCell>{mahasiswa.prestasi_nonakademik}</TableCell>
                <TableCell>{mahasiswa.perilaku}</TableCell>
                <TableCell>{mahasiswa.keaktifan_organisasi}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(mahasiswa)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(mahasiswa.nim)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 