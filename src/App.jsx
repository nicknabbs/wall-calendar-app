import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Loader2, LayoutDashboard } from 'lucide-react'
import { addMonths, subMonths, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { CalendarGrid } from './components/CalendarGrid'
import { Dashboard } from './components/Dashboard'
import { useBurnIn } from './hooks/useBurnIn'
import { supabase } from './lib/supabase'
import './index.css'

function App() {
  const [viewMode, setViewMode] = useState('dashboard') // 'dashboard' | 'month'
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const { burnInStyle, isIdle } = useBurnIn()

  // Form State
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventType, setNewEventType] = useState('todo')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // 1. Initial Fetch
  useEffect(() => {
    fetchEvents()
  }, [])

  // 2. Real-time Subscription
  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          console.log('Realtime update:', payload)
          handleRealtimeUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [events])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRealtimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    if (eventType === 'INSERT') {
      setEvents((prev) => [...prev, newRecord])
    } else if (eventType === 'DELETE') {
      setEvents((prev) => prev.filter(e => e.id !== oldRecord.id))
    } else if (eventType === 'UPDATE') {
      setEvents((prev) => prev.map(e => e.id === newRecord.id ? newRecord : e))
    }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    if (!newEventTitle.trim()) return

    setIsSubmitting(true)

    // Default to currently selected date + current time
    // If we are in month view, it uses selected month (which is a bit simpler).
    // Better UX: Start date should be the specific day selected if possible.
    // For now, let's use "Today" or the current view's start.
    const startDate = new Date().toISOString()

    try {
      const { error } = await supabase
        .from('events')
        .insert([
          {
            title: newEventTitle,
            type: newEventType,
            start_date: startDate
          }
        ])

      if (error) throw error

      setShowAddModal(false)
      setNewEventTitle('')
    } catch (error) {
      alert('Error adding event: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell" style={burnInStyle}>
      {/* GLOBAL HEADER (Only visible in Month Mode or if we want it) 
          Actually, Dashboard has its own header. Let's make this conditional.
      */}

      {viewMode === 'month' && (
        <header style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="flex-center" style={{ gap: '1rem' }}>
            <button onClick={() => setViewMode('dashboard')} className="btn-icon">
              <LayoutDashboard size={24} color="var(--accent-color)" />
            </button>
            <h1 className="text-gradient" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className="flex-center" style={{ gap: '4px', background: 'var(--surface-color)', borderRadius: '8px', padding: '4px' }}>
              <button onClick={prevMonth} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '4px' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0 8px' }}>
                Today
              </button>
              <button onClick={nextMonth} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '4px' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {loading && <Loader2 className="animate-spin" size={20} color="var(--text-secondary)" />}
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={20} style={{ marginRight: '8px' }} />
              Add Event
            </button>
          </div>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {viewMode === 'dashboard' ? (
          <Dashboard
            currentDate={currentDate}
            events={events}
            onSelectDate={setCurrentDate}
            onOpenMonthView={() => setViewMode('month')}
          />
        ) : (
          <div className="container">
            <div className="glass-panel" style={{ padding: '1rem', height: 'calc(100vh - 140px)', boxSizing: 'border-box' }}>
              <CalendarGrid currentDate={currentDate} events={events} />
            </div>
          </div>
        )}
      </main>

      {/* Add Modal Global */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>New Event</h2>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Event Title"
                autoFocus
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
              <select
                value={newEventType}
                onChange={e => setNewEventType(e.target.value)}
                style={{ marginBottom: '1rem' }}
              >
                <option value="todo">Task / Event</option>
                <option value="vacation">Vacation / Out</option>
                <option value="routine">Routine Check</option>
              </select>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  style={{ background: 'transparent', color: '#fff', padding: '0.5rem 1rem' }}
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
