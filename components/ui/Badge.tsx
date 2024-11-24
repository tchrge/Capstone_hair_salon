import * as React from "react";
import { cnn } from "@/../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-primary text-primary-foreground",
            secondary: "bg-secondary text-secondary-foreground",
            destructive: "bg-destructive text-destructive-foreground",
            outline: "text-foreground border border-input",
            success: "bg-green-100 text-green-800 border-green-200",
        };

        return (
            <div
                ref={ref}
                className={cnn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };