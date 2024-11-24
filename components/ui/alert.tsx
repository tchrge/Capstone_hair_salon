// Alert.tsx
import React from 'react'

type AlertProps = {
    children: React.ReactNode
    variant?: 'default' | 'destructive'
    className?: string
}

export function Alert({
    children,
    variant = 'default',
    className = ''
}: AlertProps) {
    const baseStyles = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground'
    const variantStyles = {
        default: 'bg-background text-foreground',
        destructive: 'border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600'
    }

    return (
        <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            {children}
        </div>
    )
}

export function AlertDescription({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
            {children}
        </div>
    )
}