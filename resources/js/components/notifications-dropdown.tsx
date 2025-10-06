"use client"

import * as React from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"

type NotificationItem = {
    id: string
    title: string
    description?: string
    time?: string
    read?: boolean
    url: string
}

export default function NotificationsDropdown({ initialItems, }: { initialItems?: NotificationItem[] }) {
    const [items, setItems] = React.useState<NotificationItem[]>(
        initialItems ?? [
            { id: "1", title: "Welcome!", description: "Thanks for joining us.", time: "Just now", read: false, url: "#" },
            { id: "2", title: "Update available", description: "New features have landed.", time: "10m", read: false, url: "#" },
            { id: "3", title: "Weekly summary", description: "Your activity report is ready.", time: "2h", read: true, url: "#" },
        ],
    )

    const unreadCount = items.filter((i) => !i.read).length

    const markAllRead = () => {
        setItems((prev) => prev.map((i) => ({ ...i, read: true })))
    }

    const clearAll = () => {
        setItems([])
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open notifications" className="relative">
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    {unreadCount > 0 ? (
                        <span
                            aria-label={`${unreadCount} unread notifications`}
                            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 z-10 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground ring-1 ring-background"
                        >
                            {unreadCount}
                        </span>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-72 p-0" sideOffset={8}>
                <div className="p-3">
                    <div className="flex items-center justify-between">
                        <DropdownMenuLabel className="p-0 text-sm font-medium">Notifications</DropdownMenuLabel>
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllRead}
                                aria-label="Mark all as read"
                                className="h-7 px-2 text-xs"
                            >
                                <Check className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                                Mark all read
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                aria-label="Clear all notifications"
                                className="h-7 px-2 text-xs"
                            >
                                <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto p-1">
                    {items.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">You’re all caught up</div>
                    ) : (
                        items.map((n) => (
                            <DropdownMenuItem key={n.id} asChild>
                                <Link href={n.url} className="flex items-start gap-2 rounded-md px-3 py-2.5">
                                    <span
                                        className={["mt-1 inline-block h-2 w-2 rounded-full", n.read ? "bg-muted" : "bg-primary"].join(" ")}
                                        aria-hidden="true"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium leading-none">{n.title}</p>
                                            {n.time ? <span className="text-xs text-muted-foreground">{n.time}</span> : null}
                                        </div>
                                        {n.description ? <p className="mt-1 text-xs text-muted-foreground">{n.description}</p> : null}
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
