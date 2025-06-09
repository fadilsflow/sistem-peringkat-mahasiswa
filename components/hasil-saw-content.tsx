"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface HasilSAW {
  nim: string;
  nama: string;
  nilai_akademik: number;
  kehadiran: number;
  prestasi_akademik: number;
  prestasi_nonakademik: number;
  perilaku: number;
  keaktifan_organisasi: number;
  final_score: number;
  rank: number;
}

interface Periode {
  id_periode: string;
  tahun: string;
  semester: number;
  deskripsi: string;
}

const columns: ColumnDef<HasilSAW>[] = [
  {
    accessorKey: "rank",
    header: "Peringkat",
  },
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
    cell: ({ row }) => (
      <div>{row.getValue<number>("nilai_akademik").toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "kehadiran",
    header: "Kehadiran",
    cell: ({ row }) => (
      <div>{row.getValue<number>("kehadiran").toFixed(2)}%</div>
    ),
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
    accessorKey: "final_score",
    header: "Nilai Akhir",
    cell: ({ row }) => (
      <div>{row.getValue<number>("final_score").toFixed(4)}</div>
    ),
  },
];

export function HasilSawContent() {
  const [data, setData] = useState<HasilSAW[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string>("");

  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await fetch("/api/periode");
        const data = await response.json();
        setPeriodes(data);
        if (data.length > 0) {
          setSelectedPeriode(data[0].id_periode);
        }
      } catch (error) {
        console.error("Error fetching periodes:", error);
      }
    };

    fetchPeriodes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPeriode) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/saw?periode=${selectedPeriode}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching SAW results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hasil Perhitungan SAW</CardTitle>
          <Select value={selectedPeriode} onValueChange={setSelectedPeriode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              {periodes.map((periode) => (
                <SelectItem key={periode.id_periode} value={periode.id_periode}>
                  {periode.tahun} Semester {periode.semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
