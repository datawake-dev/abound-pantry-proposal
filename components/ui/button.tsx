import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 font-[var(--font-sans)] tracking-[-0.01em]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand-primary)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_-4px_rgba(12,124,138,0.42),0_1px_2px_rgba(12,124,138,0.18)] hover:bg-[var(--brand-primary-dark)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_20px_-4px_rgba(12,124,138,0.5),0_1px_2px_rgba(12,124,138,0.22)]",
        secondary:
          "border-[rgba(10,10,11,0.14)] text-[var(--ink)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
        ghost:
          "text-[var(--ink-muted)] hover:text-[var(--brand-primary)] hover:bg-[rgba(12,124,138,0.06)]",
        link: "rounded-none text-[var(--brand-primary)] underline-offset-4 hover:underline hover:text-[var(--brand-primary-dark)]",
      },
      size: {
        default: "h-10 gap-2.5 pl-6 pr-2.5 py-2.5",
        sm: "h-8 gap-2 px-3.5 text-[0.8rem]",
        lg: "h-12 gap-3 pl-7 pr-3 py-3 text-[0.95rem]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
