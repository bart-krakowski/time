/**
 * Accessibility utilities and keyboard navigation helpers
 */

export interface AccessibilityProps {
  role: string
  ariaLabel: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaDisabled?: boolean
  ariaSelected?: boolean
  ariaCurrent?: 'date' | 'page' | 'step' | 'location' | 'time' | boolean
  tabIndex: number
}

export interface KeyboardHandlers {
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
  onKeyPress?: (event: KeyboardEvent) => void
}

export class AccessibilityUtils {
  /**
   * Generate ARIA props for a calendar day
   */
  static getDayAriaProps(day: {
    date: Date
    isToday: boolean
    isSelected: boolean
    isDisabled: boolean
    ariaLabel: string
  }): AccessibilityProps {
    return {
      role: 'gridcell',
      ariaLabel: day.ariaLabel,
      ariaDisabled: day.isDisabled,
      ariaSelected: day.isSelected,
      ariaCurrent: day.isToday ? 'date' : false,
      tabIndex: day.isSelected ? 0 : day.isDisabled ? -1 : -1,
    }
  }

  /**
   * Generate ARIA props for a calendar grid
   */
  static getCalendarGridAriaProps(options: {
    label: string
    month: string
    year: number
  }): AccessibilityProps {
    return {
      role: 'grid',
      ariaLabel: `${options.label} ${options.month} ${options.year}`,
      tabIndex: 0,
    }
  }

  /**
   * Generate keyboard handlers for calendar navigation
   */
  static getCalendarKeyboardHandlers(options: {
    onNavigate: (direction: 'prev' | 'next' | 'today') => void
    onSelectDate?: (date: Date) => void
    onEscape?: () => void
  }): KeyboardHandlers {
    return {
      onKeyDown: (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            options.onNavigate('prev')
            break
          case 'ArrowRight':
            event.preventDefault()
            options.onNavigate('next')
            break
          case 'Home':
            event.preventDefault()
            options.onNavigate('today')
            break
          case 'Escape':
            event.preventDefault()
            options.onEscape?.()
            break
          case 'Enter':
          case ' ':
            if (options.onSelectDate && event.currentTarget instanceof HTMLElement) {
              event.preventDefault()
              const dateStr = event.currentTarget.getAttribute('data-date')
              if (dateStr) {
                options.onSelectDate(new Date(dateStr))
              }
            }
            break
        }
      },
    }
  }

  /**
   * Generate keyboard handlers for date picker
   */
  static getDatePickerKeyboardHandlers(options: {
    onSelectDate: (date: Date) => void
    onClear?: () => void
    onEscape?: () => void
    getFocusedDate: () => Date
    setFocusedDate: (date: Date) => void
  }): KeyboardHandlers {
    return {
      onKeyDown: (event: KeyboardEvent) => {
        const focusedDate = options.getFocusedDate()
        let newDate = new Date(focusedDate)

        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            newDate.setDate(newDate.getDate() - 1)
            options.setFocusedDate(newDate)
            break
          case 'ArrowRight':
            event.preventDefault()
            newDate.setDate(newDate.getDate() + 1)
            options.setFocusedDate(newDate)
            break
          case 'ArrowUp':
            event.preventDefault()
            newDate.setDate(newDate.getDate() - 7)
            options.setFocusedDate(newDate)
            break
          case 'ArrowDown':
            event.preventDefault()
            newDate.setDate(newDate.getDate() + 7)
            options.setFocusedDate(newDate)
            break
          case 'PageUp':
            event.preventDefault()
            if (event.shiftKey) {
              newDate.setFullYear(newDate.getFullYear() - 1)
            } else {
              newDate.setMonth(newDate.getMonth() - 1)
            }
            options.setFocusedDate(newDate)
            break
          case 'PageDown':
            event.preventDefault()
            if (event.shiftKey) {
              newDate.setFullYear(newDate.getFullYear() + 1)
            } else {
              newDate.setMonth(newDate.getMonth() + 1)
            }
            options.setFocusedDate(newDate)
            break
          case 'Home':
            event.preventDefault()
            newDate.setDate(1)
            options.setFocusedDate(newDate)
            break
          case 'End':
            event.preventDefault()
            const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
            newDate.setDate(lastDay)
            options.setFocusedDate(newDate)
            break
          case 'Enter':
          case ' ':
            event.preventDefault()
            options.onSelectDate(focusedDate)
            break
          case 'Escape':
            event.preventDefault()
            options.onEscape?.()
            break
          case 'Delete':
          case 'Backspace':
            if (options.onClear) {
              event.preventDefault()
              options.onClear()
            }
            break
        }
      },
    }
  }

  /**
   * Generate keyboard handlers for time picker
   */
  static getTimePickerKeyboardHandlers(options: {
    onIncrement: (unit: 'hour' | 'minute' | 'second') => void
    onDecrement: (unit: 'hour' | 'minute' | 'second') => void
    onToggleMeridiem?: () => void
    onEscape?: () => void
    focusedUnit?: 'hour' | 'minute' | 'second' | 'meridiem'
  }): KeyboardHandlers {
    return {
      onKeyDown: (event: KeyboardEvent) => {
        const unit = options.focusedUnit ?? 'hour'

        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault()
            options.onIncrement(unit)
            break
          case 'ArrowDown':
            event.preventDefault()
            options.onDecrement(unit)
            break
          case 'ArrowLeft':
            event.preventDefault()
            // Focus previous unit
            break
          case 'ArrowRight':
            event.preventDefault()
            // Focus next unit
            break
          case 'Home':
            event.preventDefault()
            // Set to minimum value
            break
          case 'End':
            event.preventDefault()
            // Set to maximum value
            break
          case 'a':
          case 'A':
            if (options.onToggleMeridiem) {
              event.preventDefault()
              // Toggle to AM
            }
            break
          case 'p':
          case 'P':
            if (options.onToggleMeridiem) {
              event.preventDefault()
              // Toggle to PM
            }
            break
          case 'Escape':
            event.preventDefault()
            options.onEscape?.()
            break
        }
      },
    }
  }

  /**
   * Generate ARIA live region announcement
   */
  static createAriaLiveAnnouncement(message: string): {
    role: string
    'aria-live': 'polite' | 'assertive'
    'aria-atomic': boolean
    textContent: string
  } {
    return {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': true,
      textContent: message,
    }
  }

  /**
   * Format date for screen readers
   */
  static formatDateForScreenReader(date: Date, locale: string = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  /**
   * Format time for screen readers
   */
  static formatTimeForScreenReader(
    date: Date,
    format: '12h' | '24h' = '12h',
    locale: string = 'en-US'
  ): string {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: format === '12h',
    }).format(date)
  }
}
