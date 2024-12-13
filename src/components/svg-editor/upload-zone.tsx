"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onSvgUpload: (svgCode: string) => void;
}

export function UploadZone({ onSvgUpload }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".svg")) {
        toast({
          title: "错误",
          description: "请上传 SVG 文件",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onSvgUpload(result);
      };
      reader.readAsText(file);
    },
    [onSvgUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/svg+xml": [".svg"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`h-full border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <p className="text-gray-500 mb-4">
          {isDragActive
            ? "释放文件以上传"
            : "拖拽 SVG 文件到此处，或点击选择文件"}
        </p>
        <Button type="button">选择文件</Button>
      </div>
    </div>
  );
} 