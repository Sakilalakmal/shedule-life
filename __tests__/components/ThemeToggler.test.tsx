import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeToggle } from '@/components/ThemeToggler'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sun: ({ className }: { className?: string }) => (
    <div className={className} data-testid="sun-icon" />
  ),
  Moon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="moon-icon" />
  ),
}))

// Mock next-themes with controllable setTheme
const mockSetTheme = jest.fn()
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
    themes: ['light', 'dark', 'system'],
  }),
}))

describe('ModeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders toggle button with sun and moon icons', () => {
    render(<ModeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('has correct button styling', () => {
    render(<ModeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background') // outline variant
    expect(button).toHaveClass('size-9') // icon size
  })

  it('has accessible screen reader text', () => {
    render(<ModeToggle />)
    
    const screenReaderText = screen.getByText('Toggle theme')
    expect(screenReaderText).toBeInTheDocument()
    expect(screenReaderText).toHaveClass('sr-only')
  })

  it('renders sun and moon icons with correct classes', () => {
    render(<ModeToggle />)
    
    const sunIcon = screen.getByTestId('sun-icon')
    const moonIcon = screen.getByTestId('moon-icon')
    
    // Sun icon classes (visible in light mode)
    expect(sunIcon).toHaveClass(
      'h-[1.2rem]', 'w-[1.2rem]', 'scale-100', 'rotate-0', 'transition-all',
      'dark:scale-0', 'dark:-rotate-90'
    )
    
    // Moon icon classes (visible in dark mode)
    expect(moonIcon).toHaveClass(
      'absolute', 'h-[1.2rem]', 'w-[1.2rem]', 'scale-0', 'rotate-90', 'transition-all',
      'dark:scale-100', 'dark:rotate-0'
    )
  })

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    // Menu should be open and contain theme options
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /light/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /dark/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /system/i })).toBeInTheDocument()
  })

  it('calls setTheme when light option is selected', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)
    
    // Open dropdown
    await user.click(screen.getByRole('button'))
    
    // Click light option
    await user.click(screen.getByRole('menuitem', { name: /light/i }))
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('calls setTheme when dark option is selected', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)
    
    // Open dropdown
    await user.click(screen.getByRole('button'))
    
    // Click dark option
    await user.click(screen.getByRole('menuitem', { name: /dark/i }))
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('calls setTheme when system option is selected', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)
    
    // Open dropdown
    await user.click(screen.getByRole('button'))
    
    // Click system option
    await user.click(screen.getByRole('menuitem', { name: /system/i }))
    
    expect(mockSetTheme).toHaveBeenCalledWith('system')
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it('has correct dropdown menu positioning', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)
    
    await user.click(screen.getByRole('button'))
    
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    
    // Check that menu content has correct alignment class
    const menuContent = menu.closest('[data-side]')
    expect(menuContent).toBeInTheDocument()
  })

  it('keyboard navigation works correctly', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)
    
    const button = screen.getByRole('button')
    
    // Focus and open with Enter
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(screen.getByRole('menu')).toBeInTheDocument()
    
    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    
    expect(mockSetTheme).toHaveBeenCalled()
  })
})