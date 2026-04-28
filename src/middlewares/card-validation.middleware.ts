import { Request, Response, NextFunction } from 'express';

export const validateCardInput = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: 'EMPTY_BODY', message: 'Request body is empty' });
    return;
  }

  const { cardNumber } = req.body;

  if (cardNumber === undefined || cardNumber === null) {
    res.status(400).json({ error: 'MISSING_FIELD', message: 'card number is required' });
    return;
  }

  if (cardNumber === '') {
    res.status(400).json({ error: 'INVALID_INPUT', message: 'card number cannot be empty' });
    return;
  }

  if (typeof cardNumber !== 'string') {
    res.status(400).json({ error: 'INVALID_TYPE', message: 'card number must be a string' });
    return;
  }

  const cleanedValue = cardNumber.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(cleanedValue)) {
    res.status(400).json({ error: 'INVALID_FORMAT', message: 'card number must contain digits only' });
    return;
  }

  if (cleanedValue.length < 13 || cleanedValue.length > 19) {
    res.status(400).json({ error: 'INVALID_LENGTH', message: 'card number must be between 13 and 19 digits' });
    return;
  }

  req.body.cardNumber = cleanedValue;
  next();
};
