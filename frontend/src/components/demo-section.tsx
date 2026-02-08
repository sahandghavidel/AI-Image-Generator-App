import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DemoSection() {
  const examples = [
    {
      title: "Cinematic Portrait",
      prompt:
        "A cinematic portrait photo of a fox astronaut, soft rim light, 35mm, shallow depth of field",
      tag: "portrait",
      imageSrc: "/demo/cinematic-portrait.png",
    },
    {
      title: "Isometric City",
      prompt:
        "An isometric futuristic city at sunset, neon signage, ultra-detailed, clean lines",
      tag: "isometric",
      imageSrc: "/demo/isometric-city.png",
    },
    {
      title: "Product Shot",
      prompt:
        "A premium product photo of a sleek water bottle on a marble surface, studio lighting, crisp reflections",
      tag: "product",
      imageSrc: "/demo/product-shot.png",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            See what you can{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              generate
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A few prompt ideas to get you started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {examples.map((ex) => (
            <Card
              key={ex.tag}
              className="relative overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-600 text-white">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-slate-800">
                      {ex.title}
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {ex.tag}
                  </span>
                </div>

                <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                    <Image
                      src={ex.imageSrc}
                      alt={`${ex.title} example`}
                      fill
                       unoptimized
                    className="object-contain"
                    />
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  &ldquo;{ex.prompt}&rdquo;
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard/create">
            <Button size="lg" className="cursor-pointer gap-2 px-8 py-6">
              <Sparkles className="h-5 w-5" />
              Try It Free Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}