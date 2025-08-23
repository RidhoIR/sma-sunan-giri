"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface Option {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps {
    options: Option[]
    onValueChange: (value: string[]) => void
    defaultValue?: string[]
    placeholder?: string
    variant?: "default" | "secondary" | "destructive" | "outline"
    animation?: number
    maxCount?: number
    modalPopover?: boolean
    asChild?: boolean
    className?: string
    required?: boolean
    name?: string
}

export function MultiSelect({
    options,
    onValueChange,
    defaultValue = [],
    placeholder = "Select items",
    variant = "default",
    animation = 0,
    maxCount = 3,
    modalPopover = true,
    asChild = false,
    className,
    required = false,
    name,
    ...props
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue)

    const onValueChangeRef = React.useRef(onValueChange)
    React.useEffect(() => {
        onValueChangeRef.current = onValueChange
    })

    const handleUnselect = React.useCallback((value: string) => {
        setSelectedValues((prev) => {
            const newValues = prev.filter((v) => v !== value)
            onValueChangeRef.current(newValues)
            return newValues
        })
    }, [])

    const handleClearAll = React.useCallback(() => {
        setSelectedValues([])
        onValueChangeRef.current([])
    }, [])

    const handleSelectAll = React.useCallback(() => {
        const allValues = options.map((option) => option.value)
        setSelectedValues(allValues)
        onValueChangeRef.current(allValues)
    }, [options])

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = e.target as HTMLInputElement
        if (input.value === "") {
            if (e.key === "Backspace") {
                setSelectedValues((prev) => {
                    const newSelectedValues = [...prev]
                    newSelectedValues.pop()
                    onValueChangeRef.current(newSelectedValues)
                    return newSelectedValues
                })
            }
            if (e.key === "Escape") {
                input.blur()
                setOpen(false)
            }
        }
    }, [])

    const selectables = options.filter((option) => !selectedValues.includes(option.value))

    // React.useEffect(() => {
    //   onValueChange(selectedValues)
    // }, [selectedValues, onValueChange])

    const isAllSelected = selectedValues.length === options.length && options.length > 0

    return (
        <div className="space-y-2 relative">
            <input
                type="text"
                name={name}
                value={selectedValues.length > 0 ? selectedValues.join(",") : ""}
                required={required}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "40px", // Match the min-height of the button
                    opacity: 0,
                    pointerEvents: "none",
                    zIndex: -1,
                }}
                tabIndex={-1}
                onChange={() => { }} // Controlled by MultiSelect component
            />

            <Popover open={open} onOpenChange={setOpen} modal={modalPopover}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-required={required}
                        className={cn("w-full justify-between text-left font-normal h-auto min-h-10 px-3 py-2", className)}
                        onClick={() => setOpen(!open)}
                    >
                        <div className="flex gap-1 flex-wrap">
                            {selectedValues.length > 0 ? (
                                <span className="text-sm text-muted-foreground">
                                    {selectedValues.length} item{selectedValues.length > 1 ? "s" : ""} selected
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search options..." onKeyDown={handleKeyDown} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        if (isAllSelected) {
                                            handleClearAll()
                                        } else {
                                            handleSelectAll()
                                        }
                                    }}
                                    className="flex items-center space-x-2 cursor-pointer font-medium"
                                >
                                    <div
                                        className={cn(
                                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isAllSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                                        )}
                                    >
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="flex-1">Select All</span>
                                </CommandItem>
                                <Separator className="my-1" />
                                {options.map((option) => {
                                    const IconComponent = option.icon
                                    const isSelected = selectedValues.includes(option.value)
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                if (isSelected) {
                                                    handleUnselect(option.value)
                                                } else {
                                                    setSelectedValues((prev) => {
                                                        const newValues = [...prev, option.value]
                                                        onValueChangeRef.current(newValues)
                                                        return newValues
                                                    })
                                                }
                                            }}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                                                )}
                                            >
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                            {IconComponent && <IconComponent className="h-4 w-4" />}
                                            <span className="flex-1">{option.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                        <Separator />
                        <div className="flex items-center justify-between p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                disabled={selectedValues.length === 0}
                                className="h-8 px-2 text-sm "
                            >
                                Clear
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-8 px-2 text-sm ">
                                Close
                            </Button>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedValues.map((value) => {
                        const option = options.find((option) => option.value === value)
                        const IconComponent = option?.icon
                        return (
                            <Badge
                                variant="secondary"
                                key={value}
                                className="text-xs"
                                style={{
                                    animationDuration: `${animation}s`,
                                }}
                            >
                                {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                                {option?.label}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(value)
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={() => handleUnselect(value)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
