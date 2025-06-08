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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Trophy } from "lucide-react";

const hasilSawData = [
  {
    ranking: 1,
    tahun: "2024/2025",
    semester: 1,
    nim: "2021001",
    nama: "Ahmad Rizki Pratama",
    nilaiAkhir: 0.952,
  },
  {
    ranking: 2,
    tahun: "2024/2025",
    semester: 1,
    nim: "2021002",
    nama: "Siti Nurhaliza",
    nilaiAkhir: 0.924,
  },
  {
    ranking: 3,
    tahun: "2024/2025",
    semester: 1,
    nim: "2021004",
    nama: "Dewi Sartika",
    nilaiAkhir: 0.891,
  },
  {
    ranking: 4,
    tahun: "2024/2025",
    semester: 1,
    nim: "2021005",
    nama: "Eko Prasetyo",
    nilaiAkhir: 0.876,
  },
  {
    ranking: 5,
    tahun: "2024/2025",
    semester: 1,
    nim: "2021003",
    nama: "Budi Santoso",
    nilaiAkhir: 0.843,
  },
];

export function HasilSawContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hasil Ranking SAW</CardTitle>
              <CardDescription>
                Hasil perhitungan ranking mahasiswa menggunakan metode Simple
                Additive Weighting
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari mahasiswa..." className="pl-8" />
            </div>
            <Select defaultValue="2024/2025-1">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024/2025-1">
                  2024/2025 - Semester 1
                </SelectItem>
                <SelectItem value="2023/2024-2">
                  2023/2024 - Semester 2
                </SelectItem>
                <SelectItem value="2023/2024-1">
                  2023/2024 - Semester 1
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ranking</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Nilai Akhir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasilSawData.map((hasil) => (
                  <TableRow
                    key={`${hasil.nim}-${hasil.tahun}-${hasil.semester}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {hasil.ranking <= 3 && (
                          <Trophy
                            className={`h-4 w-4 ${
                              hasil.ranking === 1
                                ? "text-yellow-500"
                                : hasil.ranking === 2
                                ? "text-gray-400"
                                : "text-amber-600"
                            }`}
                          />
                        )}
                        <span className="font-medium">#{hasil.ranking}</span>
                      </div>
                    </TableCell>
                    <TableCell>{hasil.tahun}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Semester {hasil.semester}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{hasil.nim}</TableCell>
                    <TableCell>{hasil.nama}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={hasil.ranking <= 3 ? "default" : "secondary"}
                        className="font-mono"
                      >
                        {hasil.nilaiAkhir.toFixed(3)}
                      </Badge>
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
