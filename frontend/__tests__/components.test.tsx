import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { EmptyState } from '@/components/atoms/EmptyState';
import { Loading } from '@/components/atoms/Loading';

// Mock React Icons
jest.mock('react-icons/fa', () => ({
  FaPlus: () => <div data-testid="fa-plus" />,
  FaArrowLeft: () => <div data-testid="fa-arrow-left" />,
}));

describe('Component Tests', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('should render button with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByText('Primary')).toBeInTheDocument();

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByText('Secondary')).toBeInTheDocument();

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByText('Outline')).toBeInTheDocument();

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByText('Ghost')).toBeInTheDocument();
    });

    it('should render button with different sizes', () => {
      const { rerender } = render(<Button size="small">Small</Button>);
      expect(screen.getByText('Small')).toBeInTheDocument();

      rerender(<Button size="medium">Medium</Button>);
      expect(screen.getByText('Medium')).toBeInTheDocument();

      rerender(<Button size="large">Large</Button>);
      expect(screen.getByText('Large')).toBeInTheDocument();
    });

    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      expect(screen.getByText('Disabled Button')).toBeDisabled();
    });

    it('should render with left icon', () => {
      render(<Button leftIcon={<div data-testid="icon" />}>With Icon</Button>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    it('should render input with label', () => {
      render(<Input label="Test Label" />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should render input with placeholder', () => {
      render(<Input placeholder="Test Placeholder" />);
      expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('should render input with error message', () => {
      render(<Input error="Test Error" />);
      expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('should render input with helper text', () => {
      render(<Input helperText="Test Helper" />);
      expect(screen.getByText('Test Helper')).toBeInTheDocument();
    });

    it('should render as textarea when as prop is textarea', () => {
      render(<Input as="textarea" rows={5} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should handle input changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should render with left and right icons', () => {
      render(
        <Input 
          leftIcon={<div data-testid="left-icon" />}
          rightIcon={<div data-testid="right-icon" />}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('EmptyState Component', () => {
    it('should render empty state with icon and title', () => {
      render(
        <EmptyState 
          icon="📝" 
          title="No items found" 
          description="Try adding some items"
        />
      );
      
      expect(screen.getByText('📝')).toBeInTheDocument();
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adding some items')).toBeInTheDocument();
    });

    it('should render empty state with action button', () => {
      const handleAction = jest.fn();
      render(
        <EmptyState 
          icon="📝" 
          title="No items found" 
          description="Try adding some items"
          action={{
            label: 'Add Item',
            onClick: handleAction
          }}
        />
      );
      
      const actionButton = screen.getByText('Add Item');
      expect(actionButton).toBeInTheDocument();
      
      fireEvent.click(actionButton);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('should render different sizes', () => {
      const { rerender } = render(
        <EmptyState 
          icon="📝" 
          title="Small" 
          size="small"
        />
      );
      expect(screen.getByText('Small')).toBeInTheDocument();

      rerender(
        <EmptyState 
          icon="📝" 
          title="Medium" 
          size="medium"
        />
      );
      expect(screen.getByText('Medium')).toBeInTheDocument();

      rerender(
        <EmptyState 
          icon="📝" 
          title="Large" 
          size="large"
        />
      );
      expect(screen.getByText('Large')).toBeInTheDocument());
    });
  });

  describe('Loading Component', () => {
    it('should render loading spinner', () => {
      render(<Loading />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render loading with text', () => {
      render(<Loading text="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render full screen loading', () => {
      render(<Loading fullScreen />);
      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toBeInTheDocument();
    });

    it('should render different sizes', () => {
      const { rerender } = render(<Loading size="small" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<Loading size="medium" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<Loading size="large" />);
      expect(screen.getByRole('status')).toBeInTheDocument());
    });
  });
});
