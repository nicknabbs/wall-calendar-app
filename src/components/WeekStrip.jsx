import React from 'react'
import { startOfWeek, addDays, format, isSameDay, isToday } from 'date-fns'

export function WeekStrip({ currentDate, events, onSelectDate }) {
    const start = startOfWeek(currentDate)
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i))

    const getDayDensity = (day) => {
        const count = events.filter(e => isSameDay(new Date(e.start_date), day)).length
        if (count === 0) return 0
        if (count <= 2) return 1
        if (count <= 4) return 2
        return 3
    }

    return (
        <div className="week-strip glass-panel">
            {weekDays.map((day) => {
                const density = getDayDensity(day)
                const active = isSameDay(day, currentDate)
                const today = isToday(day)

                return (
                    <button
                        key={day.toISOString()}
                        className={`week-day ${active ? 'active' : ''} ${today ? 'today' : ''}`}
                        onClick={() => onSelectDate(day)}
                    >
                        <span className="day-name">{format(day, 'EEE')}</span>
                        <span className="day-num">{format(day, 'd')}</span>

                        <div className="density-dots">
                            {Array.from({ length: density }).map((_, i) => (
                                <div key={i} className="dot" />
                            ))}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
