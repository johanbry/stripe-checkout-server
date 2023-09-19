import Joi from "joi";
import { IRegisterValidationUser } from "../interfaces/interfaces";

export const registerSchema = Joi.object<IRegisterValidationUser>().keys({
  firstName: Joi.string().alphanum().min(1).max(30).required(),
  lastName: Joi.string().alphanum().min(1).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(30).required(),
});
