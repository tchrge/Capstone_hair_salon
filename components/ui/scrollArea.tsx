import { cnn } from "@/../../lib/utils"

// ScrollArea Component
export const ScrollArea = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cnn("overflow-auto", className)}>
        {children}
    </div>
);
