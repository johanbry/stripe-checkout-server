import express, { Request, Response } from "express";

export const registerUser = (req: Request, res: Response) => {
  res.status(200).json("Registerroute");
};

export const loginUser = (req: Request, res: Response) => {
  res.status(200).json("Loginroute");
};

export const logoutUser = (req: Request, res: Response) => {
  res.status(200).json("Logoutroute");
};

export const authorizeUser = (req: Request, res: Response) => {
  res.status(200).json("Authorizeroute");
};
