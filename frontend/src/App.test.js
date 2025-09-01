import { render } from '@testing-library/react';
import React from 'react';

// Simple component test
const TestComponent = () => <div>Finance Tracker Test</div>;

test('renders test component', () => {
  const { getByText } = render(<TestComponent />);
  expect(getByText('Finance Tracker Test')).toBeInTheDocument();
});
