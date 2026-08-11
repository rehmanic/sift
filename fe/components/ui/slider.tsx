"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "value" | "onValueChange"> & {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={(val) => onValueChange?.(val as number[])}
      min={min}
      max={max}
      step={step}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center py-2">
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Indicator className="absolute h-full bg-foreground" />
        </SliderPrimitive.Track>
        {(value ?? [0]).map((_v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="block h-4 w-4 rounded-full border border-foreground/30 bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
