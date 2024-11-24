// Dialog.tsx
import React, { useEffect, useState } from 'react'

type DialogProps = {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

export function Dialog({
    open = false,
    onOpenChange,
    children
}: DialogProps) {
    const [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                    className="absolute inset-0"
                    onClick={() => onOpenChange?.(!isOpen)}
                />
                {children}
            </div>
        </div>
    )
}

export function DialogContent({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`relative z-50 grid w-full max-w-lg gap-4 bg-white p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}>
            {children}
        </div>
    )
}

export function DialogHeader({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
            {children}
        </div>
    )
}

export function DialogTitle({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h3>
    )
}