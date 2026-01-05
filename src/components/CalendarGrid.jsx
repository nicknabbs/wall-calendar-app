import React from 'react'
import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, isSameMonth, isSameDay, isToday
} from 'date-fns'
import { EventItem } from './EventItem'

export function CalendarGrid({ currentDate, events }) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    })

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Weekday Headers */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                padding: '10px 0', borderBottom: '1px solid var(--glass-border)',
                marginBottom: '10px'
            }}>
                {weekDays.map(day => (
                    <div key={day} style={{
                        textAlign: 'center', color: 'var(--text-secondary)',
                        fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem'
                    }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Cells */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px', flex: 1, gridAutoRows: 'minmax(100px, 1fr)'
            }}>
                {calendarDays.map((day) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start_date), day))
                    const isCurrentMonth = isSameMonth(day, monthStart)
                    const isDayToday = isToday(day)

                    return (
                        <div
                            key={day.toString()}
                            style={{
                                background: isDayToday ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                border: isDayToday ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '8px',
                                opacity: isCurrentMonth ? 1 : 0.4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}
                        >
                            <div style={{
                                textAlign: 'right', marginBottom: '4px',
                                color: isDayToday ? 'var(--accent-color)' : 'inherit',
                                fontWeight: isDayToday ? 'bold' : 'normal'
                            }}>
                                {format(day, 'd')}
                            </div>

                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                {dayEvents.map(event => (
                                    <EventItem key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
