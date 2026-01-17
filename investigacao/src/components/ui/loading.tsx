import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
}

/**
 * Componente de loading genérico
 */
export function Loading({ className, size = "md", text, fullScreen = false }: LoadingProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-green-400", sizeClasses[size])} />
      {text && <p className="text-sm text-white/60">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

/**
 * Loading para overlay
 */
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm rounded-lg">
      <Loading size="lg" text={text} />
    </div>
  )
}

/**
 * Loading para botões
 */
export function ButtonLoading({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin w-4 h-4", className)} />
}

/**
 * Loading para página inteira
 */
export function PageLoading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center">
      <Loading size="xl" text={text} />
    </div>
  )
}

/**
 * Loading para seções
 */
export function SectionLoading({ text, minHeight = "200px" }: { text?: string; minHeight?: string }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight }}>
      <Loading size="lg" text={text} />
    </div>
  )
}

/**
 * Loading inline (para uso em textos)
 */
export function InlineLoading() {
  return <Loader2 className="inline w-4 h-4 animate-spin text-green-400" />
}

/**
 * Dots loading animation
 */
export function DotsLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
    </div>
  )
}

/**
 * Pulse loading (para avatares, imagens)
 */
export function PulseLoading({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-navy-800 rounded", className)} />
  )
}

/**
 * Spinner loading (alternativa ao Loader2)
 */
export function SpinnerLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        "border-green-400",
        className
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  )
}

