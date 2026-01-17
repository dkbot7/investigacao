import { LucideIcon, FileQuestion, Search, AlertCircle, Inbox, Database } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * Componente genérico de Empty State
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 rounded-full bg-navy-800/50 p-4">
        <Icon className="h-8 w-8 text-white/40" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-white/60">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="bg-green-500 hover:bg-green-600 text-white">
          {action.label}
        </Button>
      )}
    </div>
  )
}

/**
 * Empty State para resultados de busca
 */
export function SearchEmptyState({ searchTerm, onClear }: { searchTerm?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="Nenhum resultado encontrado"
      description={
        searchTerm
          ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`
          : "Nenhum resultado encontrado. Tente ajustar seus filtros."
      }
      action={
        onClear
          ? {
              label: "Limpar busca",
              onClick: onClear,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty State para listas vazias
 */
export function ListEmptyState({
  title = "Nenhum item encontrado",
  description,
  actionLabel,
  onAction,
}: {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <EmptyState
      icon={Database}
      title={title}
      description={description}
      action={
        actionLabel && onAction
          ? {
              label: actionLabel,
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty State para erros
 */
export function ErrorEmptyState({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: "Tentar novamente",
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty State para recursos não encontrados (404)
 */
export function NotFoundEmptyState({
  resourceName = "recurso",
  onGoBack,
}: {
  resourceName?: string
  onGoBack?: () => void
}) {
  return (
    <EmptyState
      icon={FileQuestion}
      title={`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} não encontrado`}
      description={`O ${resourceName} que você está procurando não existe ou foi removido.`}
      action={
        onGoBack
          ? {
              label: "Voltar",
              onClick: onGoBack,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty State para permissões negadas
 */
export function PermissionDeniedEmptyState() {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Acesso negado"
      description="Você não tem permissão para acessar este recurso. Entre em contato com o administrador."
    />
  )
}

/**
 * Empty State minimalista (para uso em cards)
 */
export function MinimalEmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-8 text-sm text-white/40">
      <Inbox className="mr-2 h-4 w-4" />
      {text}
    </div>
  )
}

