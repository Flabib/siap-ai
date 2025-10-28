import { useState, useEffect } from "react";
import { getJabatan, getSKJ, getPelatihan, getGeminiApiKey } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Sparkles, Loader2, FileText } from "lucide-react";

const Home = () => {
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jabatanId, setJabatanId] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [recommendations, setRecommendations] = useState<Array<{ judul: string; tema?: string; alasan: string }>>([]);
  const [tugasJabatan, setTugasJabatan] = useState("");
  const { toast } = useToast();

  const [jabatanList, setJabatanList] = useState<any[]>([]);

  useEffect(() => {
    setJabatanList(getJabatan().sort((a, b) => a.nama_jabatan.localeCompare(b.nama_jabatan)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nip.trim() || !nama.trim() || !jabatanId) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setShowResults(false);
    setAiResponse("");
    setRecommendations([]);
    setTugasJabatan("");

    try {
      // Get SKJ data for selected position
      const skjData = getSKJ().find((skj) => skj.jabatan_id === jabatanId);

      if (!skjData) {
        toast({
          title: "Data tidak ditemukan",
          description: "Tidak ada data SKJ untuk jabatan yang dipilih",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setTugasJabatan(skjData.tugas_jabatan);

      // Get all training data
      const pelatihanData = getPelatihan();

      // Get API key
      const apiKey = getGeminiApiKey();

      if (!apiKey) {
        toast({
          title: "API Key tidak ditemukan",
          description: "Silakan atur API Key Gemini di halaman Pengaturan",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get selected position name
      const selectedJabatan = jabatanList.find((j: any) => j.id === jabatanId);
      const namaJabatan = selectedJabatan?.nama_jabatan || "";

      // Format training list
      const pelatihanList = pelatihanData
        .map((p: any) => `${p.judul_pelatihan} | ${p.tema_pelatihan}`)
        .join("\n");

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            generationConfig: {
              response_mime_type: "application/json",
            },
            contents: [
              {
                parts: [
                  {
                    text: `Anda adalah seorang konsultan SDM (Sumber Daya Manusia) dan pakar pengembangan karir. Tugas Anda adalah membantu pegawai menemukan pelatihan yang tepat berdasarkan jabatannya.

Data Pegawai:
Jabatan: ${namaJabatan}
Tugas Utama Jabatan: ${skjData.tugas_jabatan}

Daftar Pelatihan yang Tersedia (Judul | Tema):
${pelatihanList}

Perintah: Berdasarkan Tugas Utama Jabatan di atas, tolong analisis dan rekomendasikan 3 hingga 5 pelatihan yang paling relevan dari Daftar Pelatihan yang Tersedia.

Format keluaran HARUS berupa JSON valid dengan struktur berikut, tanpa teks tambahan:
{
  "rekomendasi": [
    { "judul": "...", "tema": "...", "alasan": "..." }
  ]
}

Pastikan hanya mengembalikan JSON valid.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mendapatkan respons dari Gemini API");
      }

      const result = await response.json();
      const textPayload = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let parsed: any = null;
      try {
        parsed = textPayload ? JSON.parse(textPayload) : null;
      } catch (_) {
        parsed = null;
      }

      if (parsed && Array.isArray(parsed.rekomendasi)) {
        const items = parsed.rekomendasi
          .filter((it: any) => it && (it.judul || it.tema || it.alasan))
          .map((it: any) => ({
            judul: String(it.judul || ""),
            tema: it.tema ? String(it.tema) : undefined,
            alasan: String(it.alasan || ""),
          }));
        setRecommendations(items);
      } else {
        setAiResponse(textPayload || "Tidak ada rekomendasi");
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses permintaan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SIAP-AI
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Sistem Informasi Arahan Pelatihan berbasis AI
            </p>
            <p className="text-sm text-muted-foreground">
              Dapatkan rekomendasi pelatihan yang tepat untuk pengembangan karir Anda
            </p>
          </div>
        </div>

        <Card className="border-2 shadow-xl backdrop-blur-sm bg-card/95 animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Informasi Pegawai</CardTitle>
            <CardDescription>Masukkan data pegawai untuk mendapatkan rekomendasi pelatihan yang sesuai</CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Masukkan NIP"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Pegawai</Label>
                <Input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama pegawai"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Select value={jabatanId} onValueChange={setJabatanId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {jabatanList.map((jabatan: any) => (
                    <SelectItem key={jabatan.id} value={jabatan.id}>
                      {jabatan.nama_jabatan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full gap-2 h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Dapatkan Rekomendasi AI
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

        {showResults && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-primary/50 shadow-lg backdrop-blur-sm bg-card/95">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6 text-primary" />
                  Detail Kompetensi Jabatan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{tugasJabatan}</p>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-xl backdrop-blur-sm bg-gradient-to-br from-primary/10 via-card/95 to-card/95">
              <CardHeader className="bg-gradient-to-r from-primary/20 to-transparent">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Rekomendasi Pelatihan dari AI
                </CardTitle>
                <CardDescription className="text-base">
                  Berikut adalah rekomendasi pelatihan yang sesuai dengan kompetensi jabatan
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {recommendations.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((rec, idx) => (
                      <Card key={idx} className="border shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {rec.judul || `Rekomendasi ${idx + 1}`}
                          </CardTitle>
                          {rec.tema && (
                            <CardDescription className="text-xs text-muted-foreground">
                              Tema: {rec.tema}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">
                            {rec.alasan}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiResponse}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
