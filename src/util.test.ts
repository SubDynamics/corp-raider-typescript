import { describe, it, expect } from 'vitest';
import { getFitScale } from './util';

describe('getFitScale', () => {
  it('fits to width when the proportionate height fits', () => {
    expect(getFitScale(500, 1000, 1000, 1000)).toBe(0.5);
  });

  it('fits to height when the proportionate height is too tall', () => {
    expect(getFitScale(1000, 500, 1000, 1000)).toBe(0.5);
  });
});
