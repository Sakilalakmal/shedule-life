import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('combines classes correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles undefined and null values', () => {
    const result = cn('class1', undefined, 'class2', null, 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles empty strings', () => {
    const result = cn('class1', '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )
    
    expect(result).toBe('base-class active-class')
  })

  it('merges tailwind classes correctly', () => {
    // Testing tailwind-merge functionality
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4') // px-4 should override px-2
  })

  it('handles clsx object syntax', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    })
    expect(result).toBe('class1 class3')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles complex combinations', () => {
    const variant: 'primary' | 'secondary' = 'primary'
    const size: 'sm' | 'lg' = 'lg'
    const disabled = false
    
    const result = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
      },
      [
        size === 'lg' && 'btn-lg',
        size === 'sm' && 'btn-sm'
      ],
      disabled && 'btn-disabled'
    )
    
    expect(result).toBe('btn btn-primary btn-lg')
  })

  it('returns empty string for no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles whitespace correctly', () => {
    const result = cn('  class1  ', '  class2  ')
    expect(result).toBe('class1 class2')
  })
})