import { DEFAULTS, PROCESSING_STATUS } from "./constants";

/**
 * Calculate progress percentage
 * @param completed - Number of completed items
 * @param total - Total number of items
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Generate animation delay for staggered animations
 * @param index - Item index
 * @param baseDelay - Base delay in milliseconds (default: 100)
 * @returns Delay string for CSS
 */
export function getAnimationDelay(
  index: number,
  baseDelay: number = 100
): string {
  return `${index * baseDelay}ms`;
}

/**
 * Get default fallback image for posts
 * @returns Default image URL
 */
export function getDefaultPostImage(): string {
  return DEFAULTS.POST_IMAGE;
}

/**
 * Generate CSS classes for animated item
 * @param isAnimated - Whether the item should be animated
 * @returns CSS class string
 */
export function getAnimatedItemClasses(isAnimated: boolean): string {
  return `transform transition-all duration-500 ${
    isAnimated
      ? "translate-y-0 opacity-100 scale-100"
      : "translate-y-4 opacity-0 scale-95"
  }`;
}

/**
 * Check if processing is completed
 * @param status - Processing status string
 * @returns Boolean indicating if completed
 */
export function isProcessingCompleted(status: string): boolean {
  return status === PROCESSING_STATUS.COMPLETED || status === "completed";
}
