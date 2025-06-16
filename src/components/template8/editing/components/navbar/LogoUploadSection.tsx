
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadSectionProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  pushToHistory: (data: any) => void;
  markDirty: () => void;
}

const LogoUploadSection: React.FC<LogoUploadSectionProps> = ({
  pageData,
  onUpdate,
  pushToHistory,
  markDirty
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    pushToHistory(pageData);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUpdate({ logoUrl: e.target.result as string });
          markDirty();
          toast({
            title: "Logo uploaded successfully",
            description: "Your logo is now the primary identity of your page",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    pushToHistory(pageData);
    onUpdate({ logoUrl: "" });
    markDirty();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 mb-3 block">
        Logo (Recommended)
      </Label>
      
      {pageData.logoUrl ? (
        <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <img 
            src={pageData.logoUrl} 
            alt="Logo preview" 
            className="w-16 h-16 object-contain rounded border border-gray-200 bg-white"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">✓ Logo Active</p>
            <p className="text-xs text-green-600">This is your primary page identity</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveLogo}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-blue-700">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload size={32} className="mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Your Logo</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB • Click or drag to upload</p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default LogoUploadSection;
