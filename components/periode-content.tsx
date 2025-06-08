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

const periodeData = [
  {
    idPeriode: "P2024001",
    tahun: "2024/2025",
    semester: 1,
    w1NilaiAkademik: 0.35,
    w2Kehadiran: 0.15,
    w3PrestasiAkademik: 0.15,
    w4PrestasiNonakademik: 0.1,
    w5Perilaku: 0.15,
    w6KeaktifanOrganisasi: 0.1,
    deskripsi: "Periode Semester Ganjil 2024/2025",
    status: "Aktif",
  },
  {
    idPeriode: "P2023002",
    tahun: "2023/2024",
    semester: 2,
    w1NilaiAkademik: 0.3,
    w2Kehadiran: 0.2,
    w3PrestasiAkademik: 0.15,
    w4PrestasiNonakademik: 0.1,
    w5Perilaku: 0.15,
    w6KeaktifanOrganisasi: 0.1,
    deskripsi: "Periode Semester Genap 2023/2024",
    status: "Selesai",
  },
  {
    idPeriode: "P2023001",
    tahun: "2023/2024",
    semester: 1,
    w1NilaiAkademik: 0.35,
    w2Kehadiran: 0.15,
    w3PrestasiAkademik: 0.15,
    w4PrestasiNonakademik: 0.1,
    w5Perilaku: 0.15,
    w6KeaktifanOrganisasi: 0.1,
    deskripsi: "Periode Semester Ganjil 2023/2024",
    status: "Selesai",
  },
];

export function PeriodeContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Periode</CardTitle>
              <CardDescription>
                Kelola periode akademik dan bobot kriteria SAW
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Periode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari periode..." className="pl-8" />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Periode</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>W1 (Nilai Akademik)</TableHead>
                  <TableHead>W2 (Kehadiran)</TableHead>
                  <TableHead>W3 (Prestasi Akademik)</TableHead>
                  <TableHead>W4 (Prestasi Non-Akademik)</TableHead>
                  <TableHead>W5 (Perilaku)</TableHead>
                  <TableHead>W6 (Keaktifan Organisasi)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodeData.map((periode) => (
                  <TableRow key={periode.idPeriode}>
                    <TableCell className="font-medium">
                      {periode.idPeriode}
                    </TableCell>
                    <TableCell>{periode.tahun}</TableCell>
                    <TableCell>{periode.semester}</TableCell>
                    <TableCell>{periode.w1NilaiAkademik}</TableCell>
                    <TableCell>{periode.w2Kehadiran}</TableCell>
                    <TableCell>{periode.w3PrestasiAkademik}</TableCell>
                    <TableCell>{periode.w4PrestasiNonakademik}</TableCell>
                    <TableCell>{periode.w5Perilaku}</TableCell>
                    <TableCell>{periode.w6KeaktifanOrganisasi}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          periode.status === "Aktif" ? "default" : "secondary"
                        }
                      >
                        {periode.status}
                      </Badge>
                    </TableCell>
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
