'use client'

import { useEffect, useRef, useState } from 'react'

// Tracks an element's rendered width so SVG charts can draw at 1:1 pixel size instead of scaling text
export function useElementWidth(fallback) {
    const ref = useRef(null)
    const [width, setWidth] = useState(fallback)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return [ref, width]
}
