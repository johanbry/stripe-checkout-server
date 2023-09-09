import express, { Request, Response } from "express";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import path from "path";

import initStripe from "../stripe/stripe";

const usersFile = "data/users.json";

interface IClientUser {
  stripeId: string;
  name: string;
  email: string;
}
interface IServerUser extends IClientUser {
  password: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  let newUser: IServerUser | null = null;
  let users: IServerUser[] = [];

  // Read json-file and save current users to array. Handle error when no data file exists.
  try {
    const fileBuffer = await fs.readFile(usersFile);
    if (fileBuffer.length > 1) users = JSON.parse(fileBuffer.toString());
  } catch (error) {
    console.log("Error open/read file.", error);
  }

  // Check if user already is registered based on email.
  if (users.some((user: IServerUser) => user.email === email)) {
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
    else {
      // Create new user with id set by Stripe, update the users array and write it to file.
      newUser = {
        stripeId: stripeCustomer.id,
        name: `${firstName} ${lastName}`,
        email,
        password: await bcrypt.hash(password, 10),
      };

      users.push(newUser);
      await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

      // Return the new user with the response, but without the password.
      const clientUser: IClientUser = {
        stripeId: newUser.stripeId,
        name: newUser.name,
        email: newUser.email,
      };

      res.status(201).json(clientUser);
    }
  } catch (error) {
    res.status(500).json("Registering user failed.");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let users: IServerUser[] = [];

  // Read json-file and save current users to array. Handle error when no data file exists.
  try {
    const fileBuffer = await fs.readFile(usersFile);
    if (fileBuffer.length > 1) users = JSON.parse(fileBuffer.toString());
  } catch (error) {
    return res.status(500).json("Error logging in, please try again. " + error);
  }

  // Look for the user based on email.
  const existingUser = users.find((user) => user.email === email);

  // If no such user or if the passwords don't match, don't login
  if (!existingUser || !(await bcrypt.compare(password, existingUser.password)))
    return res.status(401).json("Wrong username or password");

  // Create user object to return in the response and set in the cookie.
  const clientUser: IClientUser = {
    stripeId: existingUser.stripeId,
    name: existingUser.name,
    email: existingUser.email,
  };

  req.session = clientUser;
  res.status(200).json(clientUser);
};

export const logoutUser = (req: Request, res: Response) => {
  // Check if user not logged in.
  if (!req.session?.stripeId) return res.status(400).json("Not logged in.");
  // Delete cookie to kill the logged in session.
  req.session = null;
  res.status(200).end();
};

export const authorizeUser = (req: Request, res: Response) => {
  // Check if client has a cookie with id to know if logged in or not
  if (!req.session?.stripeId) res.status(401).json("Not logged in.");
  // Return the user object in the cookie as response data.
  else res.status(200).json(req.session);
};
