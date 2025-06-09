"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mahasiswa, Periode } from "@prisma/client";
import {
  calculateFinalScores,
  calculateWeightedValues,
  normalizeValues,
} from "@/lib/utils/saw";

interface SawDetailProps {
  mahasiswa: Mahasiswa[];
  periode: Periode;
}

export function SawDetail({ mahasiswa, periode }: SawDetailProps) {
  const normalizedValues = normalizeValues(mahasiswa);
  const weightedValues = calculateWeightedValues(normalizedValues, periode);
  const finalScores = calculateFinalScores(weightedValues);

  const formatNumber = (num: number) => num.toFixed(4);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bobot Kriteria</CardTitle>
          <CardDescription>
            Bobot yang digunakan dalam perhitungan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nilai Akademik</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Prestasi Akademik</TableHead>
                <TableHead>Prestasi Non-akademik</TableHead>
                <TableHead>Perilaku</TableHead>
                <TableHead>Keaktifan Organisasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{formatNumber(periode.w1_nilai_akademik)}</TableCell>
                <TableCell>{formatNumber(periode.w2_kehadiran)}</TableCell>
                <TableCell>
                  {formatNumber(periode.w3_prestasi_akademik)}
                </TableCell>
                <TableCell>
                  {formatNumber(periode.w4_prestasi_nonakademik)}
                </TableCell>
                <TableCell>{formatNumber(periode.w5_perilaku)}</TableCell>
                <TableCell>
                  {formatNumber(periode.w6_keaktifan_organisasi)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nilai Awal</CardTitle>
          <CardDescription>Nilai sebelum normalisasi</CardDescription>
        </CardHeader>
        <CardContent>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {mahasiswa.map((m) => (
                <TableRow key={m.nim}>
                  <TableCell>{m.nim}</TableCell>
                  <TableCell>{m.nama}</TableCell>
                  <TableCell>{formatNumber(m.nilai_akademik)}</TableCell>
                  <TableCell>{formatNumber(m.kehadiran)}</TableCell>
                  <TableCell>{m.prestasi_akademik}</TableCell>
                  <TableCell>{m.prestasi_nonakademik}</TableCell>
                  <TableCell>{m.perilaku}</TableCell>
                  <TableCell>{m.keaktifan_organisasi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nilai Normalisasi</CardTitle>
          <CardDescription>
            Hasil normalisasi menggunakan kriteria benefit
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {mahasiswa.map((m, i) => (
                <TableRow key={m.nim}>
                  <TableCell>{m.nim}</TableCell>
                  <TableCell>{m.nama}</TableCell>
                  <TableCell>
                    {formatNumber(normalizedValues[i].nilai_akademik)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(normalizedValues[i].kehadiran)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(normalizedValues[i].prestasi_akademik)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(normalizedValues[i].prestasi_nonakademik)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(normalizedValues[i].perilaku)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(normalizedValues[i].keaktifan_organisasi)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nilai Terbobot</CardTitle>
          <CardDescription>
            Hasil perkalian nilai normalisasi dengan bobot
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mahasiswa.map((m, i) => (
                <TableRow key={m.nim}>
                  <TableCell>{m.nim}</TableCell>
                  <TableCell>{m.nama}</TableCell>
                  <TableCell>
                    {formatNumber(weightedValues[i].nilai_akademik)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(weightedValues[i].kehadiran)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(weightedValues[i].prestasi_akademik)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(weightedValues[i].prestasi_nonakademik)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(weightedValues[i].perilaku)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(weightedValues[i].keaktifan_organisasi)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatNumber(finalScores[i])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
