import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/app/components/EmptyState'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Ban: ({ className }: { className?: string }) => (
    <div className={className} data-testid="ban-icon" />
  ),
  Edit: ({ className }: { className?: string }) => (
    <div className={className} data-testid="edit-icon" />
  ),
}))

describe('EmptyState Component', () => {
  const defaultProps = {
    title: 'No items found',
    description: 'There are no items to display at the moment.',
    buttonText: 'Add New Item',
    href: '/add-item',
  }

  it('renders all props correctly', () => {
    render(<EmptyState {...defaultProps} />)

    expect(screen.getByText('No items found')).toBeInTheDocument()
    expect(screen.getByText('There are no items to display at the moment.')).toBeInTheDocument()
    expect(screen.getByText('Add New Item')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /add new item/i })
    expect(link).toHaveAttribute('href', '/add-item')
  })

  it('renders Ban icon', () => {
    render(<EmptyState {...defaultProps} />)
    const banIcon = screen.getByTestId('ban-icon')
    expect(banIcon).toBeInTheDocument()
    expect(banIcon).toHaveClass('size-10', 'text-white')
  })

  it('renders Edit icon in button', () => {
    render(<EmptyState {...defaultProps} />)
    const editIcon = screen.getByTestId('edit-icon')
    expect(editIcon).toBeInTheDocument()
    expect(editIcon).toHaveClass('size-4')
  })

  it('has correct structure and styling', () => {
    render(<EmptyState {...defaultProps} />)

    // Check main container
    const container = screen.getByText('No items found').closest('div')
    expect(container).toHaveClass('flex', 'flex-col', 'flex-1', 'h-full', 'items-center', 'justify-center')

    // Check icon container
    const iconContainer = screen.getByTestId('ban-icon').parentElement
    expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center', 'size-20', 'rounded-full', 'bg-primary/10')

    // Check title styling
    const title = screen.getByText('No items found')
    expect(title).toHaveClass('mt-8', 'text-xl', 'font-semibold')

    // Check description styling
    const description = screen.getByText('There are no items to display at the moment.')
    expect(description).toHaveClass('mb-8', 'mt-4', 'text-sm', 'text-muted-foreground', 'max-w-xs', 'mx-auto')
  })

  it('renders button as Link with correct styling', () => {
    render(<EmptyState {...defaultProps} />)
    
    const button = screen.getByRole('link', { name: /add new item/i })
    expect(button).toHaveAttribute('href', '/add-item')
    
    // Check that it's wrapped in Button component (has button classes)
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('handles different prop values', () => {
    const customProps = {
      title: 'No Events Scheduled',
      description: 'You haven\'t scheduled any events yet. Create your first event to get started.',
      buttonText: 'Create Event',
      href: '/dashboard/new',
    }

    render(<EmptyState {...customProps} />)

    expect(screen.getByText('No Events Scheduled')).toBeInTheDocument()
    expect(screen.getByText('You haven\'t scheduled any events yet. Create your first event to get started.')).toBeInTheDocument()
    
    const link = screen.getByRole('link', { name: /create event/i })
    expect(link).toHaveAttribute('href', '/dashboard/new')
  })

  it('has animation classes', () => {
    render(<EmptyState {...defaultProps} />)
    
    const container = screen.getByText('No items found').closest('div')
    expect(container).toHaveClass('animate-in', 'fade-in-50')
  })

  it('renders with semantic HTML structure', () => {
    render(<EmptyState {...defaultProps} />)
    
    // Title should be h2
    const title = screen.getByRole('heading', { level: 2 })
    expect(title).toHaveTextContent('No items found')
    
    // Description should be paragraph
    const description = screen.getByText('There are no items to display at the moment.')
    expect(description.tagName).toBe('P')
    
    // Button should be a link
    const button = screen.getByRole('link')
    expect(button).toBeInTheDocument()
  })
})