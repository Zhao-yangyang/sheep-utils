"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

interface ShortcutItemProps {
  keys: string[]
  description: string
}

function ShortcutItem({ keys, description }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="rounded border bg-muted px-2 py-1 text-xs font-semibold"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  )
}

export function KeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>键盘快捷键</DialogTitle>
          <DialogDescription>
            使用以下快捷键可以更快地操作图片
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <ShortcutItem
            keys={["←"]}
            description="选择上一张图片"
          />
          <ShortcutItem
            keys={["→"]}
            description="选择下一张图片"
          />
          <ShortcutItem
            keys={["Delete"]}
            description="删除选中的图片"
          />
          <ShortcutItem
            keys={["Esc"]}
            description="取消选择"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 