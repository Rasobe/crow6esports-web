"use client";
// features/store/components/SizeSelector.tsx
import type { Size } from "../types";

interface SizeSelectorProps {
  sizes: { size: Size; available: boolean }[];
  selected: Size | null;
  onSelect: (size: Size) => void;
}

export function SizeSelector({ sizes: _, selected: _s, onSelect: _o }: SizeSelectorProps) {
  return <div />;
}
