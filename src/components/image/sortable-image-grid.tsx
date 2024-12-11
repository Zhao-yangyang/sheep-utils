"use client"

import type {
  DragEndEvent
} from '@dnd-kit/core';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ImageFile } from '@/types/image'
import { Button } from '@/components/ui/button'
import { ImagePreview } from './image-preview'
import { cn } from '@/lib/utils'
import { Maximize2, X } from 'lucide-react'
import { formatFileSize } from '@/lib/image'

interface SortableItemProps {
  id: string
  image: ImageFile
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
  onDelete: () => void
}

function SortableItem({
  id,
  image,
  isSelected,
  onSelect,
  onPreview,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-lg border",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 z-10 cursor-move"
      />

      <div
        className="relative"
        onClick={(e) => {
          e.preventDefault()
          onSelect()
        }}
      >
        <ImagePreview src={image.preview} />
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPreview()
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 p-2 text-xs text-white">
          <p className="truncate">{image.file.name}</p>
          <p>{formatFileSize(image.file.size)}</p>
        </div>
      </div>
    </div>
  )
}

interface SortableImageGridProps {
  images: ImageFile[]
  selectedIndex: number
  onImagesChange: (images: ImageFile[]) => void
  onSelect: (index: number) => void
  onPreview: (preview: string) => void
  onDelete: (index: number) => void
}

export function SortableImageGrid({
  images,
  selectedIndex,
  onImagesChange,
  onSelect,
  onPreview,
  onDelete,
}: SortableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.file.name === active.id)
      const newIndex = images.findIndex(img => img.file.name === over.id)
      onImagesChange(arrayMove(images, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SortableContext
          items={images.map(img => img.file.name)}
          strategy={rectSortingStrategy}
        >
          {images.map((image, index) => (
            <SortableItem
              key={image.file.name}
              id={image.file.name}
              image={image}
              isSelected={selectedIndex === index}
              onSelect={() => onSelect(index)}
              onPreview={() => onPreview(image.preview)}
              onDelete={() => {
                onDelete(index)
                document.body.style.cursor = 'default'
              }}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
} 