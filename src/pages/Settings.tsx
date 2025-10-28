import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Briefcase, FileText, GraduationCap } from "lucide-react";
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";
import { JabatanSettings } from "@/components/settings/JabatanSettings";
import { SKJSettings } from "@/components/settings/SKJSettings";
import { PelatihanSettings } from "@/components/settings/PelatihanSettings";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan & Data Master</h1>
          <p className="text-muted-foreground">Kelola konfigurasi dan data master SIAP-AI</p>
        </div>

        <Tabs defaultValue="apikey" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="apikey" className="gap-2">
              <Key className="h-4 w-4" />
              API Key
            </TabsTrigger>
            <TabsTrigger value="jabatan" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Data Jabatan
            </TabsTrigger>
            <TabsTrigger value="skj" className="gap-2">
              <FileText className="h-4 w-4" />
              Data SKJ
            </TabsTrigger>
            <TabsTrigger value="pelatihan" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Data Pelatihan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apikey" className="mt-6">
            <ApiKeySettings />
          </TabsContent>

          <TabsContent value="jabatan" className="mt-6">
            <JabatanSettings />
          </TabsContent>

          <TabsContent value="skj" className="mt-6">
            <SKJSettings />
          </TabsContent>

          <TabsContent value="pelatihan" className="mt-6">
            <PelatihanSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
