"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";

const mahasiswaData = [
  {
    nim: "2021001",
    nama: "Ahmad Rizki Pratama",
    periode: "2024/2025-1",
    nilaiAkademik: 85.5,
    kehadiran: 95.0,
    prestasiAkademik: 3,
    prestasiNonakademik: 2,
    perilaku: 90,
    keaktifanOrganisasi: 85,
    tanggalInput: "2024-01-15",
  },
  {
    nim: "2021002",
    nama: "Siti Nurhaliza",
    periode: "2024/2025-1",
    nilaiAkademik: 88.2,
    kehadiran: 98.0,
    prestasiAkademik: 4,
    prestasiNonakademik: 1,
    perilaku: 95,
    keaktifanOrganisasi: 90,
    tanggalInput: "2024-01-15",
  },
  {
    nim: "2021003",
    nama: "Budi Santoso",
    periode: "2024/2025-1",
    nilaiAkademik: 82.7,
    kehadiran: 92.0,
    prestasiAkademik: 2,
    prestasiNonakademik: 3,
    perilaku: 88,
    keaktifanOrganisasi: 75,
    tanggalInput: "2024-01-16",
  },
  {
    nim: "2021004",
    nama: "Dewi Sartika",
    periode: "2024/2025-1",
    nilaiAkademik: 90.1,
    kehadiran: 96.0,
    prestasiAkademik: 5,
    prestasiNonakademik: 2,
    perilaku: 92,
    keaktifanOrganisasi: 88,
    tanggalInput: "2024-01-16",
  },
  {
    nim: "2021005",
    nama: "Eko Prasetyo",
    periode: "2024/2025-1",
    nilaiAkademik: 87.3,
    kehadiran: 94.0,
    prestasiAkademik: 3,
    prestasiNonakademik: 4,
    perilaku: 89,
    keaktifanOrganisasi: 82,
    tanggalInput: "2024-01-17",
  },
];

export function MahasiswaContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Mahasiswa</CardTitle>
              <CardDescription>
                Kelola data mahasiswa dan kriteria penilaian SAW
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Mahasiswa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari mahasiswa..." className="pl-8" />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Nilai Akademik</TableHead>
                  <TableHead>Kehadiran</TableHead>
                  <TableHead>Prestasi Akademik</TableHead>
                  <TableHead>Prestasi Non-Akademik</TableHead>
                  <TableHead>Perilaku</TableHead>
                  <TableHead>Keaktifan Organisasi</TableHead>
                  <TableHead>Tanggal Input</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mahasiswaData.map((mahasiswa) => (
                  <TableRow key={mahasiswa.nim}>
                    <TableCell className="font-medium">
                      {mahasiswa.nim}
                    </TableCell>
                    <TableCell>{mahasiswa.nama}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{mahasiswa.periode}</Badge>
                    </TableCell>
                    <TableCell>{mahasiswa.nilaiAkademik}</TableCell>
                    <TableCell>{mahasiswa.kehadiran}%</TableCell>
                    <TableCell>{mahasiswa.prestasiAkademik}</TableCell>
                    <TableCell>{mahasiswa.prestasiNonakademik}</TableCell>
                    <TableCell>{mahasiswa.perilaku}</TableCell>
                    <TableCell>{mahasiswa.keaktifanOrganisasi}</TableCell>
                    <TableCell>{mahasiswa.tanggalInput}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
