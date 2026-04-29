import { Request, Response, NextFunction } from 'express';

export const validateCardInput = (req: Request, res: Response, next: NextFunction): void => {
  // Check if the request body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: 'EMPTY_BODY', message: 'Request body is empty' });
    return;
  }

  const { cardNumber } = req.body;

  // Check if cardNumber is missing
  if (cardNumber === undefined || cardNumber === null) {
    res.status(400).json({ error: 'MISSING_FIELD', message: 'card number is required' });
    return;
  }

  // Check if cardNumber is an empty string
  if (cardNumber === '') {
    res.status(400).json({ error: 'INVALID_INPUT', message: 'card number cannot be empty' });
    return;
  }

  // Check if cardNumber is of type string
  if (typeof cardNumber !== 'string') {
    res.status(400).json({ error: 'INVALID_TYPE', message: 'card number must be a string' });
    return;
  }

  // Remove spaces and dashes from the card number
  const cleanedValue = cardNumber.replace(/[\s-]/g, '');

  // Check if the cleaned card number contains only digits
  if (!/^\d+$/.test(cleanedValue)) {
    res.status(400).json({ error: 'INVALID_FORMAT', message: 'card number must contain digits only' });
    return;
  }

  // Check if the cleaned card number length is between 13 and 19 digits
  if (cleanedValue.length < 13 || cleanedValue.length > 19) {
    res.status(400).json({ error: 'INVALID_LENGTH', message: 'card number must be between 13 and 19 digits' });
    return;
  }

  // Update the request body with the cleaned card number
  req.body.cardNumber = cleanedValue;
  next();
};
