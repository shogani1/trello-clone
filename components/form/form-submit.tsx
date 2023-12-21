"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface FormSubmit {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

export const FormSubmit = ({
  children,
  className,
  disabled,
  variant = "primary",
}: FormSubmit) => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || disabled}
      variant={variant}
      type="submit"
      size="sm"
      className={cn(className)}
    >
      {children}
    </Button>
  );
};
