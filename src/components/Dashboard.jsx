import React from 'react'
import { format, isToday } from 'date-fns'
import { Calendar as CalendarIcon, Edit2, CheckCircle2 } from 'lucide-react'
import { WeekStrip } from './WeekStrip'

export function Dashboard({ currentDate, events, onSelectDate, onOpenMonthView }) {
    // Filter events for the selected day
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.start_date)
        return eventDate.toDateString() === currentDate.toDateString()
    })

    // Sort: Time-specific first, then others. Simply sorting by start_date for now.
    const sortedEvents = [...dayEvents].sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

    const nowItem = sortedEvents[0]
    const nextItems = sortedEvents.slice(1, 4) // Next 3 items
    const routines = events.filter(e => e.type === 'routine' && new Date(e.start_date).toDateString() === currentDate.toDateString())

    return (
        <div className="dashboard-grid">
            {/* HEADER */}
            <header className="dash-header">
                <div className="date-display">
                    <h1 className="text-gradient">
                        {isToday(currentDate) ? 'Today' : format(currentDate, 'EEEE')}
                    </h1>
                    <span className="subtitle">{format(currentDate, 'MMMM do')}</span>
                </div>
                <button className="btn-icon glassy" onClick={onOpenMonthView}>
                    <CalendarIcon size={24} />
                    <span>Month</span>
                </button>
            </header>

            {/* NOW BLOCK - Main Focus */}
            <section className="now-block glass-panel glow-border">
                <div className="label">NOW / FOCUS</div>
                {nowItem ? (
                    <div className="now-content">
                        <h2>{nowItem.title}</h2>
                        <div className="time-badge">
                            {format(new Date(nowItem.start_date), 'h:mm a')}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <h2>Clear Schedule</h2>
                        <p>Enjoy your free time.</p>
                    </div>
                )}
            </section>

            {/* NEXT QUEUE */}
            <section className="next-queue">
                <div className="label">UP NEXT</div>
                {nextItems.length > 0 ? (
                    <div className="queue-list">
                        {nextItems.map(item => (
                            <div key={item.id} className="queue-item glass-panel">
                                <span className="time">{format(new Date(item.start_date), 'h:mm a')}</span>
                                <span className="title">{item.title}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-queue glass-panel">
                        <CheckCircle2 size={20} className="muted" />
                        <span>Nothing else queued</span>
                    </div>
                )}
            </section>

            {/* ROUTINES (Placeholder for now) */}
            <section className="routines glass-panel">
                <div className="label">ROUTINES</div>
                <div className="routine-list">
                    {/* We will implement real routine logic later. For now, static placeholders or empty. */}
                    {routines.length > 0 ? routines.map(r => (
                        <div key={r.id} className="routine-pill">{r.title}</div>
                    )) : (
                        <span className="muted">No routines set</span>
                    )}
                </div>
            </section>

            {/* WEEK STRIP */}
            <div className="strip-container">
                <WeekStrip
                    currentDate={currentDate}
                    events={events}
                    onSelectDate={onSelectDate}
                />
            </div>
        </div>
    )
}
