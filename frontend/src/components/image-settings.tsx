"use client";

import { Image as ImageIcon, Settings, Loader2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface ImageSettingsProps {
  prompt: string;
  width: number;
  setWidth: (v: number) => void;
  height: number;
  setHeight: (v: number) => void;
  numInferenceSteps: number;
  setNumInferenceSteps: (v: number) => void;
  guidanceScale: number;
  setGuidanceScale: (v: number) => void;
  seed: string;
  setSeed: (v: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function ImageSettings({
  prompt,
  width,
  setWidth,
  height,
  setHeight,
  numInferenceSteps,
  setNumInferenceSteps,
  guidanceScale,
  setGuidanceScale,
  seed,
  setSeed,
  isGenerating,
  onGenerate,
}: ImageSettingsProps) {
  const creditsNeeded = 1;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2 sm:p-3">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 text-sm font-bold">Settings</h3>
            <p className="text-muted-foreground text-xs">
              Customize your image
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-semibold">
                <ImageIcon className="h-3 w-3" /> Width
              </label>
              <input
                type="number"
                min={256}
                step={16}
                value={width}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (Number.isFinite(next)) setWidth(next);
                }}
                className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-semibold">
                <ImageIcon className="h-3 w-3" /> Height
              </label>
              <input
                type="number"
                min={256}
                step={16}
                value={height}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (Number.isFinite(next)) setHeight(next);
                }}
                className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Settings className="h-3 w-3" /> Steps
              </span>
              <span className="text-muted-foreground">{numInferenceSteps}</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={numInferenceSteps}
              onChange={(e) => setNumInferenceSteps(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Settings className="h-3 w-3" /> Guidance
              </span>
              <span className="text-muted-foreground">
                {guidanceScale.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-semibold">
              <Settings className="h-3 w-3" /> Seed (optional)
            </label>
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="leave blank for random"
              className="border-input bg-background w-full rounded-md border px-2 py-1.5 text-xs"
            />
          </div>

          <div className="space-y-2">
            {prompt.trim() && (
              <div className="rounded-md bg-blue-50 px-3 py-2 text-center">
                <p className="text-xs text-blue-700">
                  Cost:{" "}
                  <span className="font-bold">
                    {creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            )}
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="h-9 w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}