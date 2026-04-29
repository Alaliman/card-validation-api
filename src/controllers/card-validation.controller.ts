import { Request, Response } from 'express';
import { luhnService } from '../services/card-validation.service';

export const validateCard = (req: Request, res: Response): void => {
  const { cardNumber } = req.body;
  
  // Validate the card number using the Luhn algorithm
  const isValid = luhnService.validateCardNumber(cardNumber);
  

  // Checking the result of the validation and sending the appropriate response
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
