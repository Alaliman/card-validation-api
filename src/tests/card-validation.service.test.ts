import { describe, it, expect } from '@jest/globals';
import { luhnService} from '../services/card-validation.service';

describe('LuhnService', () => {
  it('Valid Visa number 4532015112830366 → returns true', () => {
    expect(luhnService.validateCardNumber('4532015112830366')).toBe(true);
  });

  it('Valid Mastercard number 5425233430109903 → returns true', () => {
    expect(luhnService.validateCardNumber('5425233430109903')).toBe(true);
  });

  it('Invalid number 1234567890123456 → returns false', () => {
    expect(luhnService.validateCardNumber('1234567890123456')).toBe(false);
  });

  it('All same digits 1111111111111111 → returns false', () => {
    expect(luhnService.validateCardNumber('1111111111111111')).toBe(false);
  });

  it('Valid number with last digit flipped 4532015112830367 → returns false', () => {
    expect(luhnService.validateCardNumber('4532015112830367')).toBe(false);
  });
});
