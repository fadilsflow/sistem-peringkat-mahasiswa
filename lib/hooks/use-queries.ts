import { useQuery } from "@tanstack/react-query";
import { Mahasiswa, Periode } from "@prisma/client";

interface DashboardStats {
  totalMahasiswa: number;
  avgNilaiAkademik: number;
  avgKehadiran: number;
  avgPrestasi: number;
}

async function fetchMahasiswaByPeriode(
  periodeId: string | null
): Promise<Mahasiswa[]> {
  if (!periodeId) return [];

  const response = await fetch(`/api/mahasiswa?periodeId=${periodeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch mahasiswa");
  }
  return response.json();
}

async function fetchPeriodes(): Promise<Periode[]> {
  const response = await fetch("/api/periode");
  if (!response.ok) {
    throw new Error("Failed to fetch periodes");
  }
  const data = await response.json();
  return data;
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

export function useMahasiswaByPeriode(periodeId: string | null) {
  return useQuery({
    queryKey: ["mahasiswa", periodeId],
    queryFn: () => fetchMahasiswaByPeriode(periodeId),
    enabled: !!periodeId,
  });
}

export function usePeriodes() {
  return useQuery({
    queryKey: ["periodes"],
    queryFn: fetchPeriodes,
  });
}

export function useDashboardStats(periodeId: string | null) {
  return useQuery({
    queryKey: ["dashboard", periodeId],
    queryFn: () => fetchDashboardStats(periodeId!),
    enabled: !!periodeId,
  });
}

export function useActivePeriode(periodeId: string | null) {
  return useQuery({
    queryKey: ["periode", periodeId],
    queryFn: async () => {
      if (!periodeId) return null;
      const response = await fetch(`/api/periode/${periodeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch periode");
      }
      return response.json();
    },
    enabled: !!periodeId,
  });
}
