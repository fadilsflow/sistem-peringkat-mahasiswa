"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

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
    cell: ({ row }) => {
      const value = row.getValue<number>("nilai_akademik");
      return <div>{value ? value.toFixed(2) : "0.00"}</div>;
    },
  },
  {
    accessorKey: "kehadiran",
    header: "Kehadiran",
    cell: ({ row }) => {
      const value = row.getValue<number>("kehadiran");
      return <div>{value ? value.toFixed(2) : "0.00"}%</div>;
    },
  },
  {
    accessorKey: "prestasi_akademik",
    header: "Prestasi Akademik",
    cell: ({ row }) => {
      const value = row.getValue<number>("prestasi_akademik");
      return <div>{value || "0"}</div>;
    },
  },
  {
    accessorKey: "prestasi_nonakademik",
    header: "Prestasi Non-Akademik",
    cell: ({ row }) => {
      const value = row.getValue<number>("prestasi_nonakademik");
      return <div>{value || "0"}</div>;
    },
  },
  {
    accessorKey: "perilaku",
    header: "Perilaku",
    cell: ({ row }) => {
      const value = row.getValue<number>("perilaku");
      return <div>{value || "0"}</div>;
    },
  },
  {
    accessorKey: "keaktifan_organisasi",
    header: "Keaktifan Organisasi",
    cell: ({ row }) => {
      const value = row.getValue<number>("keaktifan_organisasi");
      return <div>{value || "0"}</div>;
    },
  },
  {
    accessorKey: "final_score",
    header: "Nilai Akhir",
    cell: ({ row }) => {
      const value = row.getValue<number>("final_score");
      return <div>{value ? value.toFixed(4) : "0.0000"}</div>;
    },
  },
];

export function HasilSawContent({ periodeId }: { periodeId: string }) {
  const [data, setData] = useState<HasilSAW[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!periodeId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/saw?periode=${periodeId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching SAW results:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Skeleton className="h-100 w-full bg-card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hasil Perhitungan SAW</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          filterColumn="nama"
          filterPlaceholder="Cari Nama"
          key={periodeId}
        />
      </CardContent>
    </Card>
  );
}
