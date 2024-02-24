import { reverse } from '../utils/for_testing.js';

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test('reverse of a', () => {
  const result = reverse('a');
  // expect wraps the resulting value into an object that offers a collection of matcher functions, 
  // that can be used for verifying the correctness of the result.
  // @ts-expect-error TS(2304): Cannot find name 'expect'.
  expect(result).toBe('a');
});

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test('reverse of abcde', () => {
  const result = reverse('abcde');

  // @ts-expect-error TS(2304): Cannot find name 'expect'.
  expect(result).toBe('edcba');
});

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test('reverse of releveler', () => {
  const result = reverse('releveler');

  // @ts-expect-error TS(2304): Cannot find name 'expect'.
  expect(result).toBe('releveler');
});