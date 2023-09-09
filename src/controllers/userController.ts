import express, { Request, Response } from "express";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import path from "path";

import initStripe from "../stripe/stripe";

const usersFile = "data/users.json";
interface IUser {
  stripeId: string;
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  let newUser: IUser | null = null;
  let users: IUser[] = [];

  // Read json-file and save current users to array. Handle error when no data file exists.
  try {
    const fileBuffer = await fs.readFile(usersFile);
    if (fileBuffer.length > 1) users = JSON.parse(fileBuffer.toString());
  } catch (error) {
    console.log("Error open/read file.", error);
  }

  // Check if user already is registered based on email.
  if (users.some((user: IUser) => user.email === email)) {
    return res.status(409).json("User already registered!");
  }

  try {
    // Create customer on Stripe
    const stripe = initStripe();
    const stripeCustomer = await stripe?.customers.create({
      name: `${firstName} ${lastName}`,
      email,
    });

    // Check if Stripe customer creation failed
    if (!stripeCustomer || !stripeCustomer.id)
      return res.status(500).json("Error registering Stripe.");

    // Create new user with id set by Stripe, update the users array and write it to file.
    newUser = {
      stripeId: stripeCustomer.id,
      name: `${firstName} ${lastName}`,
      email,
      password: await bcrypt.hash(password, 10),
    };

    users.push(newUser);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    res.status(500).json("Registering user failed.");
  }

  // Return the new user with the response, but without the password.
  const confirmedUser = { ...newUser };
  delete confirmedUser.password;

  res.status(201).json(confirmedUser);
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
