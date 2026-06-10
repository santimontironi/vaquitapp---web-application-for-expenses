import type { MotionProps } from "motion/react"

const easeOutSoft: [number, number, number, number] = [0.21, 0.61, 0.35, 1]

// Entrada con desplazamiento vertical (hero, cards, secciones)
export const fadeUp = (delay = 0): MotionProps => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: easeOutSoft, delay },
})

// Entrada solo con opacidad (textos secundarios, cambios de pestaña)
export const fadeIn = (delay = 0): MotionProps => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: "easeOut", delay },
})

// Backdrop de modales (con animación de salida vía AnimatePresence)
export const modalBackdrop: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" },
}

// Panel de modales (con animación de salida vía AnimatePresence)
export const modalPanel: MotionProps = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { duration: 0.25, ease: easeOutSoft },
}
