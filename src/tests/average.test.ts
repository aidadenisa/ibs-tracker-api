import { average } from '../utils/for_testing.js';

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('average', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('of one value is the value itself', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(average([1])).toBe(1);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('of many is calculated right', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(average([1,2,3,4,5,6])).toBe(3.5);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('of an empty array to be 0', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(average([])).toBe(0);
  })
})