import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (!error) return next();

    res.status(400).json(error?.message);
  };
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.id) return next();

  res.status(401).json("Not logged in.");
};
