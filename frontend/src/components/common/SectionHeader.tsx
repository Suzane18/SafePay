import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  action?: string
  onAction?: () => void
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {action && <button className="text-button" onClick={onAction}>{action}<ArrowRight size={15} /></button>}
    </div>
  )
}
