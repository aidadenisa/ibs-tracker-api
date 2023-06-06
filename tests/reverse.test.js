import { reverse } from '../utils/for_testing.js';

test('reverse of a', () => {
  const result = reverse('a');
  // expect wraps the resulting value into an object that offers a collection of matcher functions, 
  // that can be used for verifying the correctness of the result.
  expect(result).toBe('a');
});

test('reverse of abcde', () => {
  const result = reverse('abcde');

  expect(result).toBe('edcba');
});

test('reverse of releveler', () => {
  const result = reverse('releveler');

  expect(result).toBe('releveler');
});