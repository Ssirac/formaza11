"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, Link2, X, LoaderCircle, Star } from "lucide-react";
import { inputClass } from "@/components/ui/field";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Downscale + re-encode an image in the browser before upload. Keeps payloads
 * small (well under Server Action body limits) and Cloudinary storage light.
 */
async function compressImage(
  file: File,
  maxDim = 1400,
  quality = 0.82
): Promise<string> {
  const dataUrl = await fileToDataUri(file);
  // SVGs and tiny files: skip canvas re-encode.
  if (file.type === "image/svg+xml") return dataUrl;
  try {
    const img = document.createElement("img");
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("load"));
      img.src = dataUrl;
    });
    let { width, height } = img;
    if (Math.max(width, height) > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return dataUrl;
  }
}

export function ImageManager({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(0);
  const dragIndex = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function addUrl() {
    const u = url.trim();
    if (!u) return;
    try {
      new URL(u);
    } catch {
      toast.error("Düzgün şəkil URL-i daxil et");
      return;
    }
    if (value.includes(u)) {
      toast.info("Bu şəkil artıq əlavə olunub");
      return;
    }
    onChange([...value, u]);
    setUrl("");
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) {
      toast.error(
        "Fayl yükləmə üçün Cloudinary qurulmayıb. Şəkil URL-i yapışdırın."
      );
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const arr = Array.from(files);
    setUploading((n) => n + arr.length);
    const uploaded: string[] = [];

    for (const file of arr) {
      try {
        const dataUri = await compressImage(file);
        const form = new FormData();
        form.append("file", dataUri);
        form.append("upload_preset", preset);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
          { method: "POST", body: form }
        );
        const json = await res.json();
        if (res.ok && json.secure_url) {
          uploaded.push(json.secure_url as string);
        } else {
          toast.error(json?.error?.message ?? "Yüklənmədi");
        }
      } catch {
        toast.error("Yükləmə xətası");
      } finally {
        setUploading((n) => n - 1);
      }
    }

    if (uploaded.length) onChange([...value, ...uploaded]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  function makePrimary(i: number) {
    if (i === 0) return;
    reorder(i, 0);
  }

  return (
    <div className="space-y-4">
      {/* Upload + URL row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={buttonClasses("outline", "md")}
          disabled={uploading > 0}
        >
          {uploading > 0 ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          {uploading > 0 ? `Yüklənir (${uploading})…` : "Şəkil yüklə"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="Şəkil URL-i yapışdır…"
              className={`${inputClass} pl-10`}
            />
          </div>
          <button
            type="button"
            onClick={addUrl}
            className={buttonClasses("ghost", "md")}
          >
            Əlavə et
          </button>
        </div>
      </div>

      {/* Previews */}
      {value.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {value.map((src, i) => (
            <div
              key={src + i}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null) reorder(dragIndex.current, i);
                dragIndex.current = null;
              }}
              className={cn(
                "group relative aspect-[4/5] cursor-grab overflow-hidden rounded-lg border bg-ink-2",
                i === 0 ? "border-gold" : "border-line"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-metal-gold px-1.5 py-0.5 text-[10px] font-bold text-ink">
                  <Star className="h-2.5 w-2.5" />
                  Əsas
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    className="rounded bg-white/15 p-1.5 text-white hover:bg-white/25"
                    aria-label="Əsas et"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded bg-red-500/80 p-1.5 text-white hover:bg-red-500"
                  aria-label="Sil"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-line-strong bg-surface/50 px-4 py-8 text-center text-sm text-faint">
          Hələ şəkil əlavə edilməyib. İlk şəkil əsas (cover) olacaq.
        </div>
      )}
    </div>
  );
}
