import { useState, useEffect } from 'react'

/**
 * useBurnIn hook
 * Returns a style object that shifts the screen by 1-2px every few minutes.
 * Also handles "breathing" idle state.
 */
export function useBurnIn() {
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isIdle, setIsIdle] = useState(false)

    // 1. Pixel Shift Loop (Every 2 minutes)
    useEffect(() => {
        const interval = setInterval(() => {
            // Shift randomly between -1px, 0px, 1px
            const x = Math.floor(Math.random() * 3) - 1
            const y = Math.floor(Math.random() * 3) - 1
            setOffset({ x, y })
            console.log('Burn-in shift:', { x, y })
        }, 2 * 60 * 1000) // 2 minutes

        return () => clearInterval(interval)
    }, [])

    // 2. Idle Detection (5 minutes)
    useEffect(() => {
        let idleTimer
        const resetIdle = () => {
            setIsIdle(false)
            clearTimeout(idleTimer)
            idleTimer = setTimeout(() => setIsIdle(true), 5 * 60 * 1000)
        }

        // Listen for interactions
        window.addEventListener('mousemove', resetIdle)
        window.addEventListener('touchstart', resetIdle)
        window.addEventListener('keydown', resetIdle)

        // Init
        resetIdle()

        return () => {
            window.removeEventListener('mousemove', resetIdle)
            window.removeEventListener('touchstart', resetIdle)
            window.removeEventListener('keydown', resetIdle)
            clearTimeout(idleTimer)
        }
    }, [])

    const burnInStyle = {
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 1s ease-in-out, filter 1s ease, opacity 1s ease',
        filter: isIdle ? 'grayscale(0.8) contrast(1.2) brightness(0.7)' : 'none',
        opacity: isIdle ? 0.8 : 1
    }

    return { burnInStyle, isIdle }
}
