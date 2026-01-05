import React, { useState } from 'react'
import { format, isToday } from 'date-fns'
import { Calendar as CalendarIcon, Edit2, CheckCircle2, Plus } from 'lucide-react'
import { WeekStrip } from './WeekStrip'

export function Dashboard({ currentDate, events, onSelectDate, onOpenMonthView, onAddEvent }) {
    const [completedIds, setCompletedIds] = useState([])

    // Filter events for the selected day
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.start_date)
        return eventDate.toDateString() === currentDate.toDateString()
    })

    // Sort: Time-specific first
    const sortedEvents = [...dayEvents].sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

    // Logic: "Now" is the first *uncompleted* event
    const uncompleted = sortedEvents.filter(e => !completedIds.includes(e.id))

    const nowItem = uncompleted[0]
    const nextItems = uncompleted.slice(1, 4)

    // Routines: Filter by type 'routine'
    const routines = events.filter(e =>
        e.type === 'routine' &&
        new Date(e.start_date).toDateString() === currentDate.toDateString()
    )

    const handleComplete = (id) => {
        setCompletedIds(prev => [...prev, id])
        // Trigger confetti or sound here if we had it
        // For now, CSS animation handles the strikethrough
    }

    return (
        <div className="dashboard-grid">
            {/* HEADER */}
            <header className="dash-header">
                <div className="date-display">
                    <h1 className="text-gradient" style={{ marginBottom: '0.2rem' }}>
                        {isToday(currentDate) ? 'Today' : format(currentDate, 'EEEE')}
                    </h1>
                    <span className="subtitle" style={{ color: 'var(--text-secondary)' }}>{format(currentDate, 'MMMM do')}</span>
                </div>

                <div className="header-actions">
                    {/* QUICK ADD */}
                    <button className="btn-primary" onClick={onAddEvent}>
                        <Plus size={20} />
                        <span style={{ marginLeft: '8px' }}>Add</span>
                    </button>

                    <button className="btn-icon glassy" onClick={onOpenMonthView}>
                        <CalendarIcon size={24} />
                    </button>
                </div>
            </header>

            {/* NOW BLOCK - Main Focus */}
            <section
                className={`now-block glass-panel glow-border ${nowItem && completedIds.includes(nowItem.id) ? 'completed' : ''}`}
                onClick={() => nowItem && handleComplete(nowItem.id)}
            >
                <div className="label">NOW / FOCUS</div>
                {nowItem ? (
                    <div className="now-content">
                        <h2>{nowItem.title}</h2>
                        <div className="time-badge">
                            {format(new Date(nowItem.start_date), 'h:mm a')}
                        </div>
                        <div style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>Tap to complete</div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <h2>Clear Schedule</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>You're all caught up.</p>
                    </div>
                )}
            </section>

            {/* NEXT QUEUE */}
            <section className="next-queue">
                <div className="label">UP NEXT</div>
                {nextItems.length > 0 ? (
                    <div className="queue-list">
                        {nextItems.map(item => (
                            <div
                                key={item.id}
                                className={`queue-item glass-panel ${completedIds.includes(item.id) ? 'completed' : ''}`}
                                onClick={() => handleComplete(item.id)}
                            >
                                <span className="time">{format(new Date(item.start_date), 'h:mm a')}</span>
                                <span className="title">{item.title}</span>
                                {completedIds.includes(item.id) && <CheckCircle2 size={16} color="var(--success-color)" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-queue glass-panel" style={{ padding: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <CheckCircle2 size={20} className="muted" />
                        <span style={{ color: 'var(--text-secondary)' }}>Nothing else queued</span>
                    </div>
                )}
            </section>

            {/* ROUTINES */}
            <section className="routines glass-panel" style={{ padding: '1rem', gridArea: 'routines' }}>
                <div className="label">ROUTINES</div>
                <div className="routine-list">
                    {routines.length > 0 ? routines.map(r => (
                        <div
                            key={r.id}
                            className={`routine-pill ${completedIds.includes(r.id) ? 'done' : ''}`}
                            onClick={() => handleComplete(r.id)}
                        >
                            {r.title}
                        </div>
                    )) : (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                            No routines set. Add one via the + button.
                        </div>
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
