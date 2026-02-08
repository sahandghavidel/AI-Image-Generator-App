"use client";

import Image from "next/image";
import { Download, X } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export interface GeneratedImage {
  s3_key: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string | null;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  seed: number;
  modelId: string;
  timestamp: Date;
}

interface PromptInputProps {
  prompt: string;
  setPrompt: (text: string) => void;
  negativePrompt: string;
  setNegativePrompt: (text: string) => void;
  currentImage: GeneratedImage | null;
  onDownload: (img: GeneratedImage) => void;
}

export default function PromptInput({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  currentImage,
  onDownload,
}: PromptInputProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-2 sm:p-3">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 text-sm font-bold">Prompt</h3>
            <p className="text-muted-foreground text-xs">
              Describe the image you want to generate
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A high quality product photo of a nano banana on a wooden table, studio lighting"
            maxLength={500}
            rows={8}
            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
          />
          <input
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="Negative prompt (optional)"
            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{prompt.length}/500 characters</span>
            {prompt.length > 0 && (
              <Button
                onClick={() => setPrompt("")}
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>

          {currentImage && (
            <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-900">
                  Latest Generation
                </h4>
                <Button
                  onClick={() => onDownload(currentImage)}
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-2 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-3 w-3" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
              <p className="mb-2 line-clamp-2 text-xs text-blue-800">
                {currentImage.prompt}
              </p>
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white/50">
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.prompt}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
