import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Temporal } from '@js-temporal/polyfill'
import { useCalendar } from '@tanstack/react-time'
import type { Event } from '@tanstack/time'
import './index.css'

const sampleEvents: Event[] = [
  {
    id: '1',
    start: '2024-06-10T09:00:00',
    end: '2024-06-10T10:00:00',
    title: 'Team Meeting',
    resources: [{ id: 'room-1', label: 'Room 201' }],
  },
  {
    id: '2',
    start: '2024-06-12T11:00:00',
    end: '2024-06-12T12:00:00',
    title: 'Project Review',
    resources: [
      { id: 'room-2', label: 'Room 305' },
      { id: 'person-1', label: 'John Doe' },
    ],
  },
  {
    id: '3',
    start: '2024-06-12T14:00:00',
    end: '2024-06-12T15:30:00',
    title: 'Client Call',
  },
  {
    id: '4',
    start: '2024-06-15T10:00:00',
    end: '2024-06-15T11:00:00',
    title: 'Workshop',
    resources: [{ id: 'room-3', label: 'Auditorium' }],
  },
  {
    id: '5',
    start: '2024-06-20T09:00:00',
    end: '2024-06-22T17:00:00',
    title: 'Multi-day Conference',
    resources: [
      { id: 'room-4', label: 'Room 101' },
      { id: 'person-2', label: 'Jane Smith' },
    ],
  },
]

const HOURS_PER_DAY = 24

function getEventTimePosition(event: Event, dateStr: string) {
  const timeZone = 'UTC'
  const eventStart = Temporal.PlainDateTime.from(event.start).toZonedDateTime(
    timeZone,
  )
  const eventEnd = Temporal.PlainDateTime.from(event.end).toZonedDateTime(
    timeZone,
  )
  const eventStartDate = eventStart.toPlainDate()
  const eventEndDate = eventEnd.toPlainDate()
  const eventStartDateStr = eventStartDate.toString()
  const eventEndDateStr = eventEndDate.toString()
  const date = Temporal.PlainDate.from(dateStr)

  if (eventStartDateStr > dateStr || eventEndDateStr < dateStr) {
    return null
  }

  const startDateTime =
    eventStartDateStr === dateStr
      ? eventStart.toPlainDateTime()
      : date.toPlainDateTime({
          hour: 0,
          minute: 0,
          second: 0,
        })
  const endDateTime =
    eventEndDateStr === dateStr
      ? eventEnd.toPlainDateTime()
      : date.toPlainDateTime({
          hour: 23,
          minute: 59,
          second: 59,
        })

  const startMinutes = startDateTime.hour * 60 + startDateTime.minute
  const endMinutes = endDateTime.hour * 60 + endDateTime.minute
  const duration = endMinutes - startMinutes

  const top = (startMinutes / (HOURS_PER_DAY * 60)) * 100
  const height = (duration / (HOURS_PER_DAY * 60)) * 100

  return {
    top: `${top}%`,
    height: `${height}%`,
    startTime: startDateTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    endTime: endDateTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  }
}

export default function App() {
  const {
    changeViewMode,
    getEventProps,
    groupDaysBy,
    getDaysNames,
    days,
    viewMode,
    isPending,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    canGoPreviousPeriod,
    canGoNextPeriod,
    currentPeriod,
    getEventsByDate,
    getTimeSlots,
  } = useCalendar({
    events: sampleEvents,
    viewMode: { value: 1, unit: 'month' },
    locale: 'en-US',
    range: {
      start: '2024-05-10',
      end: '2024-08-20',
    },
  })

  console.log('viewMode', viewMode)
  const daysNames = getDaysNames('short')

  const groupedWeeks =
    viewMode.unit === 'month'
      ? groupDaysBy({
          days: days,
          unit: 'week',
          fillMissingDays: true,
        })
      : viewMode.unit === 'week'
        ? groupDaysBy({
            days: days,
            unit: 'week',
            fillMissingDays: true,
          })
        : viewMode.unit === 'day'
          ? [days.slice(0, viewMode.value)]
          : [[...days]]

  const visibleDaysNames =
    viewMode.unit === 'day'
      ? days
          .slice(0, viewMode.value)
          .map((day) => day.date.toLocaleString('en-US', { weekday: 'short' }))
      : daysNames

  const gridColumns =
    viewMode.unit === 'day' ? viewMode.value : daysNames.length

  const timeSlots = getTimeSlots()
  const weekDays =
    viewMode.unit === 'week'
      ? groupDaysBy({
          days: days,
          unit: 'week',
          fillMissingDays: true,
        })[0] || []
      : []

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold mb-5">
        TanStack Time Calendar Example
      </h1>

      <div className="mb-5">
        <div className="flex gap-2.5 items-center">
          <button
            onClick={goToPreviousPeriod}
            disabled={isPending || !canGoPreviousPeriod()}
            className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={goToCurrentPeriod}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextPeriod}
            disabled={isPending || !canGoNextPeriod()}
            className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
          <div className="ml-5 text-lg font-bold">
            {/* {formatDate(currentPeriod)} */}
            currentPeriod: {currentPeriod}
          </div>
        </div>

        <div className="mt-2.5 flex gap-2.5">
          <button
            onClick={() => changeViewMode({ value: 1, unit: 'month' })}
            className={`px-3 py-1.5 text-xs rounded border border-gray-300 transition-colors ${
              viewMode.unit === 'month'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => changeViewMode({ value: 1, unit: 'week' })}
            className={`px-3 py-1.5 text-xs rounded border border-gray-300 transition-colors ${
              viewMode.unit === 'week'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {viewMode.unit === 'week' ? (
        <div className="border border-gray-300 bg-white">
          <div
            className="grid border-b border-gray-300"
            style={{
              gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)`,
            }}
          >
            <div className="p-2.5 bg-gray-50 border-r border-gray-300"></div>
            {weekDays.map((day: (typeof days)[0] | null, dayIndex: number) => {
              if (!day) return null
              const isToday = day.isToday
              return (
                <div
                  key={dayIndex}
                  className={`p-2.5 text-center border-r border-gray-300 last:border-r-0 ${
                    isToday ? 'bg-blue-50 font-bold' : 'bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {day.date.toLocaleString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={`text-sm ${isToday ? 'font-bold' : 'font-normal'}`}
                  >
                    {day.date.day}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex overflow-x-auto">
            <div className="shrink-0 w-20 border-r border-gray-300">
              {timeSlots.map((slot) => (
                <div
                  key={slot.hour}
                  className="h-[60px] border-b border-gray-200 flex items-start justify-end pr-2 pt-1"
                >
                  <span className="text-xs text-gray-600">{slot.label}</span>
                </div>
              ))}
            </div>
            <div
              className="flex-1 grid"
              style={{
                gridTemplateColumns: `repeat(${weekDays.length}, 1fr)`,
              }}
            >
              {weekDays.map((day, dayIndex) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${dayIndex}`}
                      className="border-r border-gray-300 last:border-r-0"
                    >
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.hour}
                          className="h-[60px] border-b border-gray-200 bg-gray-50"
                        />
                      ))}
                    </div>
                  )
                }

                const isToday = day.isToday
                const dateStr = day.date.toString()
                const events = getEventsByDate(dateStr)

                return (
                  <div
                    key={dateStr}
                    className={`relative border-r border-gray-300 last:border-r-0 ${
                      isToday ? 'bg-blue-50/30' : 'bg-white'
                    }`}
                  >
                    {timeSlots.map((_, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="h-[60px] border-b border-gray-200"
                      />
                    ))}
                    {events.map((event) => {
                      const position = getEventTimePosition(event, dateStr)
                      if (!position) return null

                      const eventProps = getEventProps(event.id)
                      const hasOverlappingEvents =
                        (eventProps?.overlappingEvents.length ?? 0) > 0

                      return (
                        <div
                          key={event.id}
                          className={`absolute left-0 right-0 px-1.5 py-0.5 rounded text-white text-[11px] cursor-pointer overflow-hidden ${
                            hasOverlappingEvents ? 'bg-red-500' : 'bg-blue-500'
                          } ${eventProps?.isSplitEvent ? 'opacity-70' : 'opacity-100'}`}
                          style={{
                            top: position.top,
                            height: position.height,
                            minHeight: '20px',
                          }}
                          title={`${event.title} (${position.startTime} - ${position.endTime})`}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-[9px] opacity-90 mt-0.5">
                            {position.startTime} - {position.endTime}
                          </div>
                          {event.resources && event.resources.length > 0 && (
                            <div className="mt-0.5 flex flex-wrap gap-0.5">
                              {event.resources.map((resource) => (
                                <span
                                  key={resource.id}
                                  className="text-[8px] px-1 py-0.5 rounded bg-white/20 backdrop-blur-sm"
                                  title={resource.label}
                                >
                                  {resource.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-px bg-gray-300 border border-gray-300">
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            }}
          >
            {visibleDaysNames.map((dayName: string, index: number) => {
              const dayDate =
                viewMode.unit === 'day' && days[index] ? days[index].date : null
              return (
                <div
                  key={`${dayName}-${index}`}
                  className="p-2.5 bg-white text-center font-bold text-xs"
                >
                  <div>{dayName}</div>
                  {dayDate && (
                    <div className="text-[10px] font-normal text-gray-600 mt-0.5">
                      {dayDate.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {groupedWeeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="grid gap-px"
              style={{
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              }}
            >
              {week.map((day: (typeof days)[0] | null) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${weekIndex}`}
                      className="min-h-[100px] p-2 bg-gray-50 border border-gray-200"
                    />
                  )
                }

                const dateStr = day.date.toString()
                const isToday = day.isToday
                const isInCurrentPeriod = day.isInCurrentPeriod
                const dayEvents =
                  'events' in day ? (day as { events: Event[] }).events : []

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[100px] p-2 ${
                      isToday
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : isInCurrentPeriod
                          ? 'bg-white border border-gray-200'
                          : 'bg-gray-100 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div
                      className={`text-sm mb-1 ${isToday ? 'font-bold' : 'font-normal'}`}
                    >
                      {day.date.day}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {dayEvents.map((event: Event) => {
                        const eventProps = getEventProps(event.id)
                        const hasOverlappingEvents =
                          (eventProps?.overlappingEvents.length ?? 0) > 0
                        return (
                          <div
                            key={event.id}
                            className={`text-[11px] px-1.5 py-1 rounded cursor-pointer text-white ${
                              hasOverlappingEvents
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                            } ${eventProps?.isSplitEvent ? 'opacity-70' : 'opacity-100'}`}
                            title={event.title}
                          >
                            <div className="font-medium">{event.title}</div>
                            {event.resources && event.resources.length > 0 && (
                              <div className="mt-0.5 flex flex-wrap gap-0.5">
                                {event.resources.map((resource) => (
                                  <span
                                    key={resource.id}
                                    className="text-[9px] px-1 py-0.5 rounded bg-white/20 backdrop-blur-sm"
                                    title={resource.label}
                                  >
                                    {resource.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {isPending && (
        <div className="mt-2.5 text-gray-600 text-sm">Loading...</div>
      )}
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
