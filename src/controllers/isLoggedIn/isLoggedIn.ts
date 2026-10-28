import { Request, Response } from 'express';

export const isLoggedIn = async (req: Request, res: Response): Promise<void> => {
  if (req.session) {
    if (!req.session.userId) {
      res.status(401).json({
        isLoggedIn: false,
        message: 'User is not logged in',
      });
      return;
    }
  }

  res.status(200).json({
    isLoggedIn: true,
    userId: req.session ? req.session.userId : null,
  });
};
