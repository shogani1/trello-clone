"use client";

import { unsplash } from "@/lib/usplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { defaultImages } from "@/consts/images";
import Link from "next/link";
import { FormErrors } from "./form-errors";
interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // throw new Error("Uploading default images");
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error("Failed to get images from unsplash");
        }
      } catch (error) {
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);
  if (isLoading)
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  return (
    <div className="relative">
      <div className="grid grid-cols-3 mb-2 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video  bg-muted group hover:opacity-75 transition",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelected(image.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selected === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              readOnly
            />
            <Image
              fill
              alt="unsplash image"
              className="object-cover rounded-sm"
              src={image.urls.thumb}
            />
            {selected === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              target="_blank"
              href={image.links.html}
              className="opacity-0 group-hover:opacity-100 absolute w-full bottom-0 text-[10px] text-white truncate hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
