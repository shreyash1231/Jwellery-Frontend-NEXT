import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// parentCategory may come back populated ({ _id, name }) or as a plain id
export const getParentId = (category: any): string =>
  category?.parentCategory?._id || category?.parentCategory || ""

export const isTopLevelCategory = (category: any) => !getParentId(category)
