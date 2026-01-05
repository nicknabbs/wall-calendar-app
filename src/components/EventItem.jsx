import React from 'react'
import { Clock, MapPin } from 'lucide-react'

export function EventItem({ event }) {
    const isVacation = event.type === 'vacation'

    const style = {
        backgroundColor: isVacation ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
        borderLeft: `3px solid ${isVacation ? '#10b981' : '#6366f1'}`,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        marginBottom: '4px',
        fontSize: '0.85rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    }

    return (
        <div style={style}>
            <span style={{ fontWeight: 500 }}>{event.title}</span>
        </div>
    )
}
