import { Moderator, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export namespace ModeratorService {
  export const create = async (user: Omit<Moderator, "id">) => {
    try {
      // check if user already exists
      const userExists = !!(await prisma.moderator.findFirst({
        where: {
          email: user.email,
        },
      }));
      if (userExists) {
        throw new Error("A user with this email already exists");
      }
      const hasedPassword = await hash(user.password, 10);
      const newUser = await prisma.moderator.create({
        data: { ...user, password: hasedPassword },
      });
      const token = jwt.sign(user, process.env.JWT_SECRET as jwt.Secret);
      return { token, username: newUser.username };
    } catch (error: any) {
      throw new Error(error);
    }
  };

  type ModeratorLogin = Pick<Moderator, "username" | "password">;
  export const login = async (userData: ModeratorLogin) => {
    try {
      const user = await prisma.moderator.findFirst({
        where: {
          username: userData.username,
        },
      });
      if (!user) throw new Error("Either username or password are wrong.");
      //compare password
      const isCorrectPassword = await compare(userData.password, user.password);

      if (!isCorrectPassword)
        throw new Error("Either username or password are wrong.");

      const token = jwt.sign(user, process.env.JWT_SECRET as jwt.Secret);
      return token;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  export const deleteById = async (id: string) => {
    try {
      await prisma.moderator.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new Error("UserId is not valid");
    }
  };
  export const updateById = async (id: string, data: Partial<Moderator>) => {
    try {
      const updatedUser = await prisma.moderator.update({
        where: {
          id: Number(id),
        },
        data,
      });
      return updatedUser;
    } catch (error: any) {
      throw new Error("UserId is not valid");
    }
  };
}
