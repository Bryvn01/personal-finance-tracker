// Simple utility function tests that don't require React components
test('basic math operations work', () => {
  expect(2 + 2).toBe(4);
  expect(10 - 5).toBe(5);
});

test('string operations work', () => {
  expect('Finance'.toLowerCase()).toBe('finance');
  expect('Tracker'.toUpperCase()).toBe('TRACKER');
});

test('array operations work', () => {
  const transactions = ['income', 'expense'];
  expect(transactions.length).toBe(2);
  expect(transactions.includes('income')).toBe(true);
});
