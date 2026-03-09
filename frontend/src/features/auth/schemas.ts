import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "./constants";

export const emailSchema = z.email();
export const registerPasswordSchema = z.string().min(MIN_PASSWORD_LENGTH);
export const loginPasswordSchema = z.string().min(1);
