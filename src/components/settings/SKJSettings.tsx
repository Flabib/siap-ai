import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getJabatan, getSKJ, saveSKJ, updateSKJ, deleteSKJ, type Jabatan, type SKJ } from "@/lib/storage";

export const SKJSettings = () => {
  const [skjList, setSkjList] = useState<SKJ[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [jabatanId, setJabatanId] = useState("");
  const [tugasJabatan, setTugasJabatan] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = () => {
    setSkjList(getSKJ());
    setJabatanList(getJabatan());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jabatanId || !tugasJabatan.trim()) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateSKJ(editingId, { jabatan_id: jabatanId, tugas_jabatan: tugasJabatan });
      toast({ title: "Berhasil", description: "Data SKJ berhasil diperbarui" });
      setEditingId(null);
    } else {
      saveSKJ({ jabatan_id: jabatanId, tugas_jabatan: tugasJabatan });
      toast({ title: "Berhasil", description: "Data SKJ berhasil ditambahkan" });
    }
    setJabatanId("");
    setTugasJabatan("");
    loadData();
  };

  const handleEdit = (skj: SKJ) => {
    setJabatanId(skj.jabatan_id);
    setTugasJabatan(skj.tugas_jabatan);
    setEditingId(skj.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteSKJ(id);
      toast({ title: "Berhasil", description: "Data SKJ berhasil dihapus" });
      loadData();
    }
  };

  const handleCancel = () => {
    setJabatanId("");
    setTugasJabatan("");
    setEditingId(null);
  };

  const getJabatanName = (id: string) => {
    const jabatan = jabatanList.find((j) => j.id === id);
    return jabatan?.nama_jabatan || "-";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Tambah"} Data SKJ</CardTitle>
          <CardDescription>
            {editingId ? "Perbarui" : "Tambahkan"} Standar Kompetensi Jabatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Select value={jabatanId} onValueChange={setJabatanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {jabatanList.map((jabatan) => (
                    <SelectItem key={jabatan.id} value={jabatan.id}>
                      {jabatan.nama_jabatan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tugas_jabatan">Tugas Jabatan</Label>
              <Textarea
                id="tugas_jabatan"
                value={tugasJabatan}
                onChange={(e) => setTugasJabatan(e.target.value)}
                placeholder="Masukkan tugas dan tanggung jawab jabatan"
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update" : <><Plus className="h-4 w-4 mr-2" /> Tambah</>}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar SKJ</CardTitle>
          <CardDescription>Kelola data Standar Kompetensi Jabatan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jabatan</TableHead>
                <TableHead>Tugas Jabatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skjList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Belum ada data SKJ
                  </TableCell>
                </TableRow>
              ) : (
                skjList.map((skj) => (
                  <TableRow key={skj.id}>
                    <TableCell>{getJabatanName(skj.jabatan_id)}</TableCell>
                    <TableCell className="max-w-md truncate">{skj.tugas_jabatan}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(skj)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(skj.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
