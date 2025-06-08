"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Calendar, GraduationCap, TrendingUp, Users } from "lucide-react";

export function DashboardContent() {
  return (
    <>
      <div className="flex gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jumlah Mahasiswa
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jumlah Periode
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Total periode aktif
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Periode Aktif
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2024/2025</div>
              <p className="text-xs text-muted-foreground">Semester Ganjil</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ranking Terbaru
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">
                Mahasiswa ter-ranking
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full">
            <CardHeader>
              <CardTitle>Top 5 Mahasiswa</CardTitle>
              <CardDescription>
                Mahasiswa dengan ranking tertinggi periode ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, nim: "2021001", nama: "Ahmad Rizki", nilai: 0.95 },
                  {
                    rank: 2,
                    nim: "2021002",
                    nama: "Siti Nurhaliza",
                    nilai: 0.92,
                  },
                  {
                    rank: 3,
                    nim: "2021003",
                    nama: "Budi Santoso",
                    nilai: 0.89,
                  },
                  {
                    rank: 4,
                    nim: "2021004",
                    nama: "Dewi Sartika",
                    nilai: 0.87,
                  },
                  {
                    rank: 5,
                    nim: "2021005",
                    nama: "Eko Prasetyo",
                    nilai: 0.85,
                  },
                ].map((student) => (
                  <div key={student.nim} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {student.rank}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {student.nama}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.nim}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {student.nilai.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
