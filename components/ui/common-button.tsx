import { Button } from "./button"
import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes } from "react"

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link' | 'secondary'

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  variant?: ButtonVariant
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children?: React.ReactNode
  className?: string
}

export const CommonButton = forwardRef<HTMLButtonElement, CommonButtonProps>(({
  children,
  className = '',
  icon,
  variant = 'default',
  size = 'default',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-blue-500',
    ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-blue-500',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500',
    link: 'text-blue-600 hover:underline focus-visible:ring-blue-500',
  }

  return (
    <Button
      ref={ref}
      variant={variant === 'secondary' ? 'ghost' : variant}
      size={size}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        baseStyles,
        variants[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </Button>
  )
})

CommonButton.displayName = 'CommonButton'
