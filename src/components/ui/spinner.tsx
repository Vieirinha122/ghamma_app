// Spinner padrão do projeto: anel girando nas cores do Ghamma
// (trilho roxo suave + ponta ciano). Use com wrapper centralizado.
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn(
        'inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-accent',
        className,
      )}
    />
  )
}
