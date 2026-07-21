import Image from "next/image"
import { Icon, type IconName } from "@/components/shared/icon"
import { isImageUrl } from "@/lib/images"
import { cn } from "@/lib/utils"

/*
  Product media. When `tone` is an image URL it renders that photo (object-cover
  on a glacier backdrop, Design.md §3 — photography always sits on glacier).
  Otherwise it falls back to a glacier tone-wash tile with the category icon.
*/

const TONES: Record<string, string> = {
  cyan: "from-[#14c6de]/25 to-[#14c6de]/0",
  cobalt: "from-[#3457ff]/22 to-[#3457ff]/0",
  mint: "from-[#35e0a6]/22 to-[#35e0a6]/0",
  steel: "from-[#7c93a3]/20 to-[#7c93a3]/0",
}

const CATEGORY_ICON: Record<string, IconName> = {
  fashion: "shirt",
  "home-living": "sofa",
  beauty: "sparkles",
  electronics: "phone",
  sports: "dumbbell",
  groceries: "basket",
  toys: "toys",
  books: "book",
}

export function ProductMedia({
  tone,
  categorySlug,
  className,
  iconClassName,
  alt = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
}: {
  tone: string
  categorySlug: string
  className?: string
  iconClassName?: string
  alt?: string
  sizes?: string
  priority?: boolean
}) {
  if (isImageUrl(tone)) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl bg-glacier", className)}>
        <Image
          src={tone}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }

  const wash = TONES[tone] ?? TONES.steel
  const iconName = CATEGORY_ICON[categorySlug] ?? "package"
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-glacier",
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", wash)} />
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7), transparent 45%)",
        }}
      />
      <Icon
        name={iconName}
        strokeWidth={1.25}
        className={cn("relative size-1/3 text-ink/70", iconClassName)}
      />
    </div>
  )
}
