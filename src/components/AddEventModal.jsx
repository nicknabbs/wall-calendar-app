import React, { useState } from 'react'
import { X, Check, Sun, Plane, CheckCircle2 } from 'lucide-react'

export function AddEventModal({ onClose, onSave }) {
    const [title, setTitle] = useState('')
    const [type, setType] = useState('todo') // 'todo' | 'routine' | 'vacation'
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsSubmitting(true)
        await onSave({ title, type })
        setIsSubmitting(false)
    }

    const types = [
        { id: 'todo', label: 'Task', icon: CheckCircle2, color: 'var(--accent-color)' },
        { id: 'routine', label: 'Routine', icon: Sun, color: '#f59e0b' }, // Amber
        { id: 'vacation', label: 'Away', icon: Plane, color: '#10b981' }, // Emerald
    ]

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content">
                <div className="modal-header">
                    <h2>New Item</h2>
                    <button onClick={onClose} className="btn-icon">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Type Selector - New "Pill" Design */}
                    <div className="type-selector">
                        {types.map((t) => {
                            const Icon = t.icon
                            const isActive = type === t.id
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    className={`type-option ${isActive ? 'active' : ''}`}
                                    onClick={() => setType(t.id)}
                                    style={{
                                        '--opt-color': t.color
                                    }}
                                >
                                    <Icon size={20} />
                                    <span>{t.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="What needs doing?"
                            autoFocus
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="large-input"
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting || !title.trim()}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {isSubmitting ? 'Saving...' : 'Add to Dashboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
