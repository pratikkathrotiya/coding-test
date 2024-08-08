import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios post request
jest.mock('axios');

test('renders Powerball Ticket header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Powerball Ticket/i);
    expect(headerElement).toBeInTheDocument();
});

test('fetches and displays numbers when Autofill button is clicked', async () => {
    const drawResults = {
        PrimaryNumbers: [1, 2, 3, 4, 5, 6, 7],
        SecondaryNumbers: [8]
    };
    axios.post.mockResolvedValueOnce({
        data: {
            DrawResults: [drawResults]
        }
    });

    render(<App />);
    // Simulate autofill to populate numbers
    const autofillButton = screen.getByRole('button', { name: /autofill/i });

    fireEvent.click(autofillButton);

    const primaryNumberElements = await screen.findAllByText((content, element) => {
        return element.className.includes('primaryNumber') && content;
    });
    expect(primaryNumberElements).toHaveLength(7); // Example: 7 primary numbers
    expect(primaryNumberElements[0].textContent).toBe('1');
    expect(primaryNumberElements[1].textContent).toBe('2');
    expect(primaryNumberElements[2].textContent).toBe('3');
    expect(primaryNumberElements[3].textContent).toBe('4');
    expect(primaryNumberElements[4].textContent).toBe('5');
    expect(primaryNumberElements[5].textContent).toBe('6');
    expect(primaryNumberElements[6].textContent).toBe('7');

    const secondaryNumberElements = await screen.findAllByText((content, element) => {
      return element.className.includes('primaryNumber') && content;
  });

  expect(secondaryNumberElements).toHaveLength(7);
  expect(secondaryNumberElements[0].textContent).toBe('1');

});

test('clears numbers when Clear button is clicked', () => {
    render(<App />);
    const clearButton = screen.getByRole('button', { name: /clearfill/i });
    
    // Simulate autofill to populate numbers
    fireEvent.click(screen.getByRole('button', { name: /autofill/i }));
    
    // Clear the numbers
    fireEvent.click(clearButton);

    const numberElements = screen.queryAllByText((content, element) => {
        return element.className.includes('circle') && content;
    });
    expect(numberElements).toHaveLength(1); // Only PB button should remain with text
    expect(numberElements[0].textContent).toBe('PB');
});
