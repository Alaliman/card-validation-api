export class LuhnService {
  public validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.split('').map(Number);
    let sum = 0;
    let isSecond = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = digits[i];
      if (isSecond) {
        d *= 2;
        if (d > 9) {
          d -= 9;
        }
      }
      sum += d;
      isSecond = !isSecond;
    }
    
    return sum % 10 === 0;
  }
}

export const luhnService = new LuhnService();
