
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { StyleGenerator } from "@/components/chairlinked/utils/StyleGenerator";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Remove hardcoded "luxury" = gold, make accent dynamic based on palette!
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        luxury: "", // We'll assign colors below using palette
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  brandVibe?: "luxury" | "modern" | "feminine" | "bold";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, brandVibe, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // If brandVibe not set, fallback to "luxury" for luxury variant, else "modern"
    const palette = StyleGenerator.getVibePalette(brandVibe ?? (variant === "luxury" ? "luxury" : "modern"));

    // Dynamic accent styles for variant
    let dynamicClass = "";
    if (variant === "luxury" || variant === "default") {
      dynamicClass = `bg-[${palette.accent}] text-[${palette.primary}] hover:bg-[${palette.accent}cc] transition`;
    } else if (variant === "outline") {
      dynamicClass = `border border-[${palette.border}] text-[${palette.text}] hover:bg-[${palette.accent}1A]`; // 1A ~ 10% opacity
    } else if (variant === "secondary") {
      dynamicClass = `bg-[${palette.secondary}] text-[${palette.primary}] hover:bg-[${palette.backgroundSecondary}]`;
    } else if (variant === "destructive") {
      dynamicClass = `bg-red-700 text-white hover:bg-red-800`;
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          dynamicClass
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }
