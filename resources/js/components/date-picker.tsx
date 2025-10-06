"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
    label?: string
    placeholder?: string
    value?: Date | null
    onChange?: (date: Date | null) => void
    required?: boolean
    name?: string
    error?: string
    className?: string
}

export function DatePicker({
    label,
    placeholder = "Pilih Tanggal",
    value,
    onChange,
    required = false,
    name,
    error,
    className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(value || null)

    const handleDateSelect = (date: Date | undefined) => {
        const newDate = date || null
        setSelectedDate(newDate)
        onChange?.(newDate)
        setOpen(false)
    }

    return (
        <div className={cn("grid gap-3 relative", className)}>
            {label && (
                <Label>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            {/* Hidden input for form validation */}
            <input
                type="text"
                name={name}
                value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                required={required}
                style={{
                    position: "absolute",
                    opacity: 0,
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "62px",
                    pointerEvents: "none",
                    zIndex: -1,
                }}
                tabIndex={-1}
                onChange={() => { }} // Controlled by DatePicker component
            />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal bg-white"
                        aria-required={required}
                    >
                        {selectedDate ? selectedDate.toLocaleDateString("id-ID") : placeholder}
                        <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate ?? undefined}
                        captionLayout="dropdown"
                        onSelect={handleDateSelect}
                        required={required}
                    />
                </PopoverContent>
            </Popover>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}
