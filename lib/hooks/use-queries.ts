import { useQuery } from "@tanstack/react-query";
import { Mahasiswa, Periode } from "@prisma/client";

interface DashboardStats {
  totalMahasiswa: number;
  avgNilaiAkademik: number;
  avgKehadiran: number;
  avgPrestasi: number;
}

async function fetchPeriodes(): Promise<Periode[]> {
  const response = await fetch("/api/periode");
  if (!response.ok) {
    throw new Error("Failed to fetch periodes");
  }
  return response.json();
}

async function fetchMahasiswaByPeriode(
  periodeId: string
): Promise<Mahasiswa[]> {
  const response = await fetch(
    `/api/mahasiswa?periode=${encodeURIComponent(periodeId)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch mahasiswa");
  }
  return response.json();
}

async function fetchDashboardStats(periodeId: string): Promise<DashboardStats> {
  const response = await fetch(
    `/api/dashboard?periode=${encodeURIComponent(periodeId)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return response.json();
}

export function usePeriodes() {
  return useQuery({
    queryKey: ["periodes"],
    queryFn: fetchPeriodes,
  });
}

export function useMahasiswaByPeriode(periodeId: string | null) {
  return useQuery({
    queryKey: ["mahasiswa", periodeId],
    queryFn: () => fetchMahasiswaByPeriode(periodeId!),
    enabled: !!periodeId,
  });
}

export function useDashboardStats(periodeId: string | null) {
  return useQuery({
    queryKey: ["dashboard", periodeId],
    queryFn: () => fetchDashboardStats(periodeId!),
    enabled: !!periodeId,
  });
}
