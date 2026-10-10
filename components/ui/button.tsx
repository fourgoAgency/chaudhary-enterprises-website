import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md border font-semibold whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:border-line disabled:bg-line disabled:text-muted [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-blue bg-blue text-white hover:border-blue-hover hover:bg-blue-hover",
        secondary: "border-black bg-black text-white hover:border-black/80 hover:bg-black/80",
        outline: "border-black/25 bg-white text-black hover:border-black",
        /** White button for blue/black surfaces. */
        light: "border-white bg-white text-black hover:bg-blue-tint",
        "outline-light": "border-white bg-transparent text-white hover:bg-white hover:text-black",
        ghost: "border-transparent text-black hover:bg-blue-tint",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child element (e.g. a Link) with button styles instead of a <button>. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
