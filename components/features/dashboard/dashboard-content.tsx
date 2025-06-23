"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowUp,
  TrendingUp,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePeriodes,
  useDashboardStats,
  useMahasiswaByPeriode,
} from "@/lib/hooks/use-queries";
import { getRanking } from "@/lib/utils/saw";
import { HasilSawContent } from "@/components/features/saw/hasil-saw-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

export function DashboardContent() {
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const {
    data: periodeList = [],
    isError: isPeriodeError,
    error: periodeError,
    isLoading: isPeriodeLoading,
  } = usePeriodes();

  const {
    data: stats,
    isError: isStatsError,
    error: statsError,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useDashboardStats(selectedPeriodeId);

  const {
    data: mahasiswaList = [],
    isError: isMahasiswaError,
    error: mahasiswaError,
    isLoading: isMahasiswaLoading,
    refetch: refetchMahasiswa,
  } = useMahasiswaByPeriode(selectedPeriodeId);

  // Set initial periode
  React.useEffect(() => {
    if (!isPeriodeLoading && periodeList.length > 0 && !selectedPeriodeId) {
      setSelectedPeriodeId(periodeList[0].id_periode);
    }
  }, [periodeList, isPeriodeLoading, selectedPeriodeId]);

  const activePeriode = periodeList.find(
    (p) => p.id_periode === selectedPeriodeId
  );

  const topMahasiswa =
    mahasiswaList.length > 0 && activePeriode
      ? getRanking(mahasiswaList, activePeriode).slice(0, 5)
      : [];

  // Handle error states
  if (isPeriodeError || isStatsError || isMahasiswaError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(periodeError as Error)?.message ||
            (statsError as Error)?.message ||
            (mahasiswaError as Error)?.message ||
            "Terjadi kesalahan saat memuat data"}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle loading state
  if (isPeriodeLoading || isStatsLoading || isMahasiswaLoading) {
    refetchStats();
    refetchMahasiswa();
    return (
      <div className="space-y-6 md:p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Dashboard
            </h2>
            <p className="text-muted-foreground text-sm">
              Ringkasan data dan statistik mahasiswa
            </p>
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-40 w-full bg-card" />
            ))}
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-100 w-full bg-card" />
          <Skeleton className="h-100 w-full bg-card" />
        </div>
      </div>
    );
  }

  // Handle no periode state
  if (!isPeriodeLoading && periodeList.length === 0) {
    return (
      <div className="h-110 flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary">
          Selamat Datang di SyncRank!
        </h1>
        <p className="text-muted-foreground text-lg text-center">
          Anda Belum memiliki periode yang aktif. Silakan tambahkan periode
          untuk memulai.
        </p>
        <Button asChild>
          <Link href="/manage">Tambah Periode</Link>
        </Button>
      </div>
    );
  }

  // Handle no active periode selected
  if (!activePeriode) {
    return (
      <div className="space-y-6 md:p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Dashboard
            </h2>
            <p className="text-muted-foreground text-sm">
              Silakan pilih periode untuk melihat data
            </p>
          </div>
          <Select
            value={selectedPeriodeId}
            onValueChange={setSelectedPeriodeId}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              {periodeList.map((periode) => (
                <SelectItem key={periode.id_periode} value={periode.id_periode}>
                  {periode.tahun} Semester {periode.semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:p-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Dashboard
          </h2>
          <p className="text-muted-foreground text-sm">
            Ringkasan data dan statistik mahasiswa
          </p>
        </div>
        <Select value={selectedPeriodeId} onValueChange={setSelectedPeriodeId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            {periodeList.map((periode) => (
              <SelectItem key={periode.id_periode} value={periode.id_periode}>
                {periode.tahun} Semester {periode.semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Total Mahasiswa
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats?.totalMahasiswa || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                mahasiswa terdaftar
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Rata-rata Nilai
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold">
                {stats?.avgNilaiAkademik?.toFixed(2) || "0.00"}
              </div>
              <Progress value={stats?.avgNilaiAkademik || 0} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Rata-rata Kehadiran
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold">
                {stats?.avgKehadiran?.toFixed(2) || "0.00"}%
              </div>
              <Progress value={stats?.avgKehadiran || 0} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Rata-rata Prestasi
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold">
                {stats?.avgPrestasi?.toFixed(2) || "0.00"}
              </div>
              <Progress value={stats?.avgPrestasi || 0} className="mt-2" />
            </CardContent>
          </Card>
        </>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Bobot Kriteria</CardTitle>
            <CardDescription className="text-sm">
              Bobot penilaian untuk periode {activePeriode.tahun} Semester{" "}
              {activePeriode.semester}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nilai Akademik</span>
                  <span>
                    {(activePeriode.w1_nilai_akademik * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={activePeriode.w1_nilai_akademik * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Kehadiran</span>
                  <span>{(activePeriode.w2_kehadiran * 100).toFixed(1)}%</span>
                </div>
                <Progress value={activePeriode.w2_kehadiran * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Prestasi Akademik</span>
                  <span>
                    {(activePeriode.w3_prestasi_akademik * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={activePeriode.w3_prestasi_akademik * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Prestasi Non-akademik</span>
                  <span>
                    {(activePeriode.w4_prestasi_nonakademik * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={activePeriode.w4_prestasi_nonakademik * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Perilaku</span>
                  <span>{(activePeriode.w5_perilaku * 100).toFixed(1)}%</span>
                </div>
                <Progress value={activePeriode.w5_perilaku * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Keaktifan Organisasi</span>
                  <span>
                    {(activePeriode.w6_keaktifan_organisasi * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={activePeriode.w6_keaktifan_organisasi * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Top 5 Mahasiswa
            </CardTitle>
            <CardDescription className="text-sm">
              Mahasiswa dengan nilai tertinggi berdasarkan perhitungan SAW
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {isStatsLoading ? (
              <div className="space-y-2 px-6">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Peringkat</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-right">Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topMahasiswa.map((mahasiswa, index) => (
                      <TableRow key={mahasiswa.nim}>
                        <TableCell>
                          <Badge
                            variant={
                              index === 0
                                ? "default"
                                : index < 3
                                  ? "secondary"
                                  : "outline"
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>{mahasiswa.nim}</TableCell>
                        <TableCell className="font-medium">
                          {mahasiswa.nama}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-mono">
                            {mahasiswa.finalScore.toFixed(4)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <HasilSawContent periodeId={selectedPeriodeId} />
    </div>
  );
}
