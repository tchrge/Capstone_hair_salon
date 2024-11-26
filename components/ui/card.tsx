import { cnn } from "@/../../lib/utils"
import React from 'react'
// Card Components
export const Card = ({
    children,
    className,
    onClick
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => (
    <div
        className={cnn(
            "bg-white rounded-lg border shadow-sm",
            onClick && "cursor-pointer",
            className
        )}
        onClick={onClick}
    >
        {children}
    </div>
);

export const CardContent = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cnn("p-6", className)}>{children}</div>
);

export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cnn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cnn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

