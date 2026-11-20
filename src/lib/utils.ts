// Utilitário cn: mescla classes com suporte a condicionais e deduplicação
// de conflitos Tailwind (padrão do shadcn/ui).
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...entradas: ClassValue[]) {
  return twMerge(clsx(entradas))
}
