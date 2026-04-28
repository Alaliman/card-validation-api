import { Request, Response } from 'express';
import { luhnService } from '../services/card-validation.service';

export const validateCard = (req: Request, res: Response): void => {
  const { cardNumber } = req.body;
  
  const isValid = luhnService.validateCardNumber(cardNumber);
  
  if (isValid) {
    res.status(200).json({
      valid: true,
      message: 'The card number is valid'
    });
  } else {
    res.status(200).json({
      valid: false,
      message: 'The card number did not pass validation'
    });
  }
};
