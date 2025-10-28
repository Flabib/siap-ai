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
import { getJabatan, saveJabatan, updateJabatan, deleteJabatan, type Jabatan } from "@/lib/storage";

export const JabatanSettings = () => {
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [namaJabatan, setNamaJabatan] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = () => {
    setJabatanList(getJabatan());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaJabatan.trim()) {
      toast({
        title: "Error",
        description: "Nama jabatan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateJabatan(editingId, { nama_jabatan: namaJabatan });
      toast({ title: "Berhasil", description: "Data jabatan berhasil diperbarui" });
      setEditingId(null);
    } else {
      saveJabatan({ nama_jabatan: namaJabatan });
      toast({ title: "Berhasil", description: "Data jabatan berhasil ditambahkan" });
    }
    setNamaJabatan("");
    loadData();
  };

  const handleEdit = (jabatan: Jabatan) => {
    setNamaJabatan(jabatan.nama_jabatan);
    setEditingId(jabatan.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteJabatan(id);
      toast({ title: "Berhasil", description: "Data jabatan berhasil dihapus" });
      loadData();
    }
  };

  const handleCancel = () => {
    setNamaJabatan("");
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Tambah"} Data Jabatan</CardTitle>
          <CardDescription>
            {editingId ? "Perbarui" : "Tambahkan"} data jabatan baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama_jabatan">Nama Jabatan</Label>
              <Input
                id="nama_jabatan"
                value={namaJabatan}
                onChange={(e) => setNamaJabatan(e.target.value)}
                placeholder="Contoh: Analis Data"
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
          <CardTitle>Daftar Jabatan</CardTitle>
          <CardDescription>Kelola data jabatan yang ada</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Jabatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jabatanList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Belum ada data jabatan
                  </TableCell>
                </TableRow>
              ) : (
                jabatanList.map((jabatan) => (
                  <TableRow key={jabatan.id}>
                    <TableCell>{jabatan.nama_jabatan}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(jabatan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(jabatan.id)}
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
