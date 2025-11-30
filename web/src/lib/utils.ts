import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 根据小时获取问候语
 */
export function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "早上好"
  } else if (hour >= 12 && hour < 14) {
    return "中午好"
  } else if (hour >= 14 && hour < 18) {
    return "下午好"
  } else {
    return "晚上好"
  }
}

/**
 * 获取一年中的第几天
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

/**
 * 根据日期获取今日英雄（确定性选择）
 */
export function getTodayHero<T extends { id: string }>(dayOfYear: number, heroes: T[]): T {
  if (heroes.length === 0) {
    throw new Error("Heroes array cannot be empty")
  }
  const index = dayOfYear % heroes.length
  return heroes[index]
}

/**
 * 根据日期获取每日名言（确定性选择）
 */
export function getDailyQuote<T>(dayOfYear: number, quotes: T[]): T {
  if (quotes.length === 0) {
    throw new Error("Quotes array cannot be empty")
  }
  const index = dayOfYear % quotes.length
  return quotes[index]
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
