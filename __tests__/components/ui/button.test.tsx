import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    let button = screen.getByRole('button', { name: /delete/i })
    expect(button).toHaveClass('bg-destructive', 'text-white')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button', { name: /outline/i })
    expect(button).toHaveClass('border', 'bg-background')

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button', { name: /ghost/i })
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button', { name: /small/i })
    expect(button).toHaveClass('h-8', 'px-3')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button', { name: /large/i })
    expect(button).toHaveClass('h-10', 'px-6')

    rerender(<Button size="icon">Icon</Button>)
    button = screen.getByRole('button', { name: /icon/i })
    expect(button).toHaveClass('size-9')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button).toHaveClass('custom-class')
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('inline-flex', 'items-center')
  })

  it('forwards additional props', () => {
    render(<Button data-testid="test-button" aria-label="Test button">Test</Button>)
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('aria-label', 'Test button')
  })

  it('has correct data-slot attribute', () => {
    render(<Button>Slot Test</Button>)
    const button = screen.getByRole('button', { name: /slot test/i })
    expect(button).toHaveAttribute('data-slot', 'button')
  })
})

describe('buttonVariants', () => {
  it('generates correct default classes', () => {
    const classes = buttonVariants()
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
    expect(classes).toContain('h-9')
    expect(classes).toContain('px-4')
  })

  it('generates correct variant classes', () => {
    const destructiveClasses = buttonVariants({ variant: 'destructive' })
    expect(destructiveClasses).toContain('bg-destructive')
    expect(destructiveClasses).toContain('text-white')

    const outlineClasses = buttonVariants({ variant: 'outline' })
    expect(outlineClasses).toContain('border')
    expect(outlineClasses).toContain('bg-background')
  })

  it('generates correct size classes', () => {
    const smallClasses = buttonVariants({ size: 'sm' })
    expect(smallClasses).toContain('h-8')
    expect(smallClasses).toContain('px-3')

    const iconClasses = buttonVariants({ size: 'icon' })
    expect(iconClasses).toContain('size-9')
  })

  it('combines variant and size classes', () => {
    const classes = buttonVariants({ variant: 'destructive', size: 'lg' })
    expect(classes).toContain('bg-destructive')
    expect(classes).toContain('h-10')
    expect(classes).toContain('px-6')
  })
})