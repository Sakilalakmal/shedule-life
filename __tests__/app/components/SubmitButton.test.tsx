import { render, screen } from '@testing-library/react'
import { SubmitButton, GoogleAuthSubmitButton, GithubAuthSubmitButton } from '@/app/components/SubmitButton'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Loader: ({ className }: { className?: string }) => (
    <div className={className} data-testid="loader-icon" />
  ),
}))

// Mock react-dom useFormStatus hook
const mockUseFormStatus = jest.fn()
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: () => mockUseFormStatus(),
}))

describe('SubmitButton Component', () => {
  beforeEach(() => {
    mockUseFormStatus.mockReturnValue({ pending: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with text when not pending', () => {
    render(<SubmitButton text="Save Changes" />)
    
    const button = screen.getByRole('button', { name: /save changes/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).not.toBeDisabled()
  })

  it('renders loading state when pending', () => {
    mockUseFormStatus.mockReturnValue({ pending: true })
    
    render(<SubmitButton text="Save Changes" />)
    
    const button = screen.getByRole('button', { name: /wait/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    expect(screen.getByText('Wait a bit ...')).toBeInTheDocument()
  })

  it('applies different variants', () => {
    const { rerender } = render(<SubmitButton text="Submit" variant="destructive" />)
    let button = screen.getByRole('button', { name: /submit/i })
    expect(button).toHaveClass('bg-destructive')

    rerender(<SubmitButton text="Submit" variant="outline" />)
    button = screen.getByRole('button', { name: /submit/i })
    expect(button).toHaveClass('border', 'bg-background')
  })

  it('applies custom className', () => {
    render(<SubmitButton text="Submit" className="custom-class" />)
    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toHaveClass('custom-class', 'w-full')
  })

  it('uses outline variant when pending', () => {
    mockUseFormStatus.mockReturnValue({ pending: true })
    
    render(<SubmitButton text="Submit" variant="destructive" />)
    const button = screen.getByRole('button', { name: /wait/i })
    expect(button).toHaveClass('border', 'bg-background') // outline variant classes
  })

  it('has w-full class by default', () => {
    render(<SubmitButton text="Submit" />)
    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toHaveClass('w-full')
  })
})

describe('GoogleAuthSubmitButton Component', () => {
  beforeEach(() => {
    mockUseFormStatus.mockReturnValue({ pending: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders Google auth button when not pending', () => {
    render(<GoogleAuthSubmitButton />)
    
    const button = screen.getByRole('button', { name: /continue with google/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('border', 'bg-background') // outline variant
    expect(button).not.toBeDisabled()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('renders loading state when pending', () => {
    mockUseFormStatus.mockReturnValue({ pending: true })
    
    render(<GoogleAuthSubmitButton />)
    
    const button = screen.getByRole('button', { name: /continue/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    expect(screen.getByText('continue ...')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<GoogleAuthSubmitButton />)
    const button = screen.getByRole('button', { name: /continue with google/i })
    expect(button).toHaveClass('w-full', 'border', 'bg-background')
  })

  it('uses outline variant in both states', () => {
    const { rerender } = render(<GoogleAuthSubmitButton />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background')

    mockUseFormStatus.mockReturnValue({ pending: true })
    rerender(<GoogleAuthSubmitButton />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background')
  })
})

describe('GithubAuthSubmitButton Component', () => {
  beforeEach(() => {
    mockUseFormStatus.mockReturnValue({ pending: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders GitHub auth button when not pending', () => {
    render(<GithubAuthSubmitButton />)
    
    const button = screen.getByRole('button', { name: /continue with github/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary') // default variant
    expect(button).not.toBeDisabled()
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
  })

  it('renders loading state when pending', () => {
    mockUseFormStatus.mockReturnValue({ pending: true })
    
    render(<GithubAuthSubmitButton />)
    
    const button = screen.getByRole('button', { name: /continue/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    expect(screen.getByText('continue ...')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<GithubAuthSubmitButton />)
    const button = screen.getByRole('button', { name: /continue with github/i })
    expect(button).toHaveClass('w-full', 'bg-primary')
  })

  it('uses default variant when not pending and disabled when pending', () => {
    const { rerender } = render(<GithubAuthSubmitButton />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
    expect(button).not.toBeDisabled()

    mockUseFormStatus.mockReturnValue({ pending: true })
    rerender(<GithubAuthSubmitButton />)
    button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})

describe('SVG Components Integration', () => {
  beforeEach(() => {
    mockUseFormStatus.mockReturnValue({ pending: false })
  })

  it('renders Google and GitHub components without errors', () => {
    render(
      <div>
        <GoogleAuthSubmitButton />
        <GithubAuthSubmitButton />
      </div>
    )
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
  })
})
