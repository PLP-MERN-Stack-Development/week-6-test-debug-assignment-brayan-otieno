import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import BugForm from '../../components/BugForm';

jest.mock('axios');

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    axios.post.mockClear();
  });

  test('renders form with all fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByText(/submit bug/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText(/submit bug/i));
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const mockBug = {
      title: 'Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    };

    axios.post.mockResolvedValueOnce({ data: { ...mockBug, _id: '1' } });

    render(<BugForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: mockBug.title }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: mockBug.description }
    });
    fireEvent.click(screen.getByText(/submit bug/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: '1',
          title: mockBug.title,
          description: mockBug.description
        })
      );
    });
  });

  test('handles API error gracefully', async () => {
    const error = new Error('API Error');
    axios.post.mockRejectedValueOnce(error);

    render(<BugForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText(/submit bug/i));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error submitting bug:', error);
    });
  });
});
