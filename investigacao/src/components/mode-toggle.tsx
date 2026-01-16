"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Cycle through themes: system -> light -> dark -> system
  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="text-slate-900 dark:text-white/80 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10">
        <Sun className="w-4 h-4" />
        <span className="ml-2 hidden sm:inline text-sm">Tema</span>
      </Button>
    )
  }

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-4 h-4" />
    }
    if (resolvedTheme === "dark") {
      return <Moon className="w-4 h-4" />
    }
    return <Sun className="w-4 h-4" />
  }

  const getLabel = () => {
    if (theme === "system") return "Auto"
    if (theme === "light") return "Claro"
    return "Escuro"
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="text-slate-900 dark:text-white/80 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
      title={`Tema atual: ${getLabel()}. Clique para alternar.`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
      <span className="ml-2 hidden sm:inline text-sm">{getLabel()}</span>
    </Button>
  )
}
