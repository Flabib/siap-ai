import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getPelatihan, savePelatihan, updatePelatihan, deletePelatihan, type Pelatihan } from "@/lib/storage";

export const PelatihanSettings = () => {
  const [pelatihanList, setPelatihanList] = useState<Pelatihan[]>([]);
  const [judulPelatihan, setJudulPelatihan] = useState("");
  const [temaPelatihan, setTemaPelatihan] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = () => {
    setPelatihanList(getPelatihan());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulPelatihan.trim() || !temaPelatihan.trim()) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updatePelatihan(editingId, { judul_pelatihan: judulPelatihan, tema_pelatihan: temaPelatihan });
      toast({ title: "Berhasil", description: "Data pelatihan berhasil diperbarui" });
      setEditingId(null);
    } else {
      savePelatihan({ judul_pelatihan: judulPelatihan, tema_pelatihan: temaPelatihan });
      toast({ title: "Berhasil", description: "Data pelatihan berhasil ditambahkan" });
    }
    setJudulPelatihan("");
    setTemaPelatihan("");
    loadData();
  };

  const handleEdit = (pelatihan: Pelatihan) => {
    setJudulPelatihan(pelatihan.judul_pelatihan);
    setTemaPelatihan(pelatihan.tema_pelatihan);
    setEditingId(pelatihan.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deletePelatihan(id);
      toast({ title: "Berhasil", description: "Data pelatihan berhasil dihapus" });
      loadData();
    }
  };

  const handleCancel = () => {
    setJudulPelatihan("");
    setTemaPelatihan("");
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Tambah"} Data Pelatihan</CardTitle>
          <CardDescription>
            {editingId ? "Perbarui" : "Tambahkan"} data pelatihan baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judul_pelatihan">Judul Pelatihan</Label>
              <Input
                id="judul_pelatihan"
                value={judulPelatihan}
                onChange={(e) => setJudulPelatihan(e.target.value)}
                placeholder="Contoh: Analisis Data dengan Python"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tema_pelatihan">Tema Pelatihan</Label>
              <Input
                id="tema_pelatihan"
                value={temaPelatihan}
                onChange={(e) => setTemaPelatihan(e.target.value)}
                placeholder="Contoh: Data Science"
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
          <CardTitle>Daftar Pelatihan</CardTitle>
          <CardDescription>Kelola data pelatihan yang ada</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Pelatihan</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pelatihanList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Belum ada data pelatihan
                  </TableCell>
                </TableRow>
              ) : (
                pelatihanList.map((pelatihan) => (
                  <TableRow key={pelatihan.id}>
                    <TableCell>{pelatihan.judul_pelatihan}</TableCell>
                    <TableCell>{pelatihan.tema_pelatihan}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(pelatihan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pelatihan.id)}
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
