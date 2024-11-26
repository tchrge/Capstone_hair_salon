import {cnn} from "@/../../lib/utils"
// Avatar Components
export const Avatar = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cnn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
    )}>
        {children}
    </div>
);

export const AvatarImage = ({
    src,
    alt
}: {
    src?: string;
    alt: string;
}) => (
    <img
        src={src}
        alt={alt}
        className="aspect-square h-full w-full object-cover"
    />
);

export const AvatarFallback = ({
    children
}: {
    children: React.ReactNode;
}) => (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
        {children}
    </div>
);
