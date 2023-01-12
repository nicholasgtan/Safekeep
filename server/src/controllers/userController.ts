import prisma from "../utils/prismaConnection";
import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  clientId: string;
};

// Services
const listUsers = async (): Promise<User[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      clientId: true,
    },
  });
};
