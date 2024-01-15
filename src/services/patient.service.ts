import { Patient, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export namespace PatientService {
  export const create = async (
    user: Omit<Patient, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // check if user already exists
      const userExists = !!(await prisma.patient.findFirst({
        where: {
          email: user.email,
        },
      }));
      if (userExists) {
        throw new Error("A user with this email already exists");
      }
      const hashedPassword = await hash(user.password, 10);
      const newUser = await prisma.patient.create({
        data: { ...user, password: hashedPassword },
      });
      const token = jwt.sign(
        newUser,
        process.env.JWT_SECRET?.toString() as jwt.Secret
      );
      return { token, username: newUser.username };
    } catch (error: any) {
      throw new Error(error);
    }
  };

  type PatientLoginData = Pick<Patient, "username" | "password">;
  export const login = async (userData: PatientLoginData) => {
    // TODO: Use separate login for instructor
    try {
      const user = await prisma.patient.findFirst({
        where: {
          username: userData.username,
        },
      });
      console.log(user);
      if (!user) throw new Error("Either username or password are wrong.");
      //compare password
      const isCorrectPassword = await compare(userData.password, user.password);

      if (!isCorrectPassword)
        throw new Error("Either username or password are wrong.");

      const token = jwt.sign(
        user,
        process.env.JWT_SECRET?.toString() as jwt.Secret
      );
      return token;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  export const findProfile = async (id: number): Promise<publicData | null> => {
    try {
      const patientProfile = await prisma.patient.findFirst({ where: { id } });
      return patientProfile;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  type publicData = Pick<
    Patient,
    "name" | "gender" | "dateOfBirth" | "phoneNumber"
  >;
  export const findById = async (id: number): Promise<publicData | null> => {
    try {
      const patient = await prisma.patient.findFirst({ where: { id } });
      if (patient) {
        const { name, gender, dateOfBirth, phoneNumber } = patient;
        return { name, gender, dateOfBirth, phoneNumber };
      }
      return null;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  export const deleteById = async (id: string) => {
    try {
      await prisma.patient.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new Error("UserId is not valid");
    }
  };
  export const updateById = async (id: string, data: Partial<Patient>) => {
    try {
      const updatedUser = await prisma.patient.update({
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
