import { Request, Response } from 'express';

export const indexPage = (req: Request, res: Response) => {
  console.log('load index page: ');
  res.render('index', {
    title: req.app.locals.title,
    content: req.app.locals.content,
    path: '/',
  });
};
