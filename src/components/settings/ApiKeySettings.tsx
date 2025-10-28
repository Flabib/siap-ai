import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Key } from "lucide-react";
import { getGeminiApiKey, saveGeminiApiKey } from "@/lib/storage";

export const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setApiKey(getGeminiApiKey());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API Key tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }
    saveGeminiApiKey(apiKey);
    toast({
      title: "Berhasil",
      description: "API Key Gemini berhasil disimpan",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Gemini AI
          </CardTitle>
          <CardDescription>
            Masukkan API Key Gemini Anda untuk mengaktifkan fitur rekomendasi pelatihan berbasis AI.
            Dapatkan API Key di{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google AI Studio
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key</Label>
              <Input
                id="apikey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="font-mono"
              />
            </div>
            <Button type="submit">
              Simpan API Key
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cara Mendapatkan API Key Gemini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal list-inside space-y-2">
            <li>Buka Google AI Studio di link di atas</li>
            <li>Login dengan akun Google Anda</li>
            <li>Klik "Get API Key" atau "Create API Key"</li>
            <li>Copy API Key yang dihasilkan</li>
            <li>Paste di form di atas dan klik "Simpan API Key"</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
