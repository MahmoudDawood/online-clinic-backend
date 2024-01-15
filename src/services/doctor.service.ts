import { Doctor, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

type DoctorLogin = Pick<Doctor, "username" | "password">;
export namespace DoctorService {
  export const create = async (
    doctor: Omit<Doctor, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // check if user already exists
      const userExists = !!(await prisma.doctor.findFirst({
        where: {
          email: doctor.email,
        },
      }));
      if (userExists) {
        throw new Error("A user with this email already exists");
      }
      const hashedPassword = await hash(doctor.password, 10);
      const newDoctor = await prisma.doctor.create({
        data: { ...doctor, password: hashedPassword },
      });
      const token = jwt.sign(newDoctor, process.env.JWT_SECRET as jwt.Secret);
      return { token, username: newDoctor.username };
    } catch (error: any) {
      throw new Error(error);
    }
  };

  export const login = async (doctorData: DoctorLogin) => {
    try {
      const doctor = await prisma.doctor.findFirst({
        where: {
          username: doctorData.username,
        },
      });
      if (!doctor) throw new Error("Either username or password are wrong.");
      //compare password
      const isCorrectPassword = await compare(
        doctorData.password,
        doctor.password
      );

      if (!isCorrectPassword)
        throw new Error("Either username or password are wrong.");

      const token = jwt.sign(doctor, process.env.JWT_SECRET as jwt.Secret);
      return token;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  export const deleteById = async (id: string) => {
    try {
      await prisma.doctor.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new Error("UserId is not valid");
    }
  };
  export const updateById = async (id: string, data: Partial<Doctor>) => {
    try {
      const updatedDoctor = await prisma.doctor.update({
        where: {
          id: Number(id),
        },
        data,
      });
      return updatedDoctor;
    } catch (error: any) {
      throw new Error("UserId is not valid");
    }
  };
  export const findBySpecialization = async (spec: string) => {
    try {
      const doctors = await prisma.doctor.findMany({
        where: { specialization: spec },
      });
      return doctors;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  export const findByLocationId = async (locationId: number) => {
    try {
      const doctors = await prisma.doctor.findMany({
        where: { locationId },
      });
      return doctors;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  export const searchByName = async (name: string) => {
    try {
      const doctors = await prisma.doctor.findMany({
        where: {
          name: { contains: name },
        },
      });
      return doctors;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  export const findAll = async () => {
    try {
      const doctors = await prisma.doctor.findMany();
      return doctors;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  export const findByName = async (name: string) => {
    try {
      const doctor = await prisma.doctor.findFirst({ where: { name } });
      return doctor;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  export const findById = async (id: number) => {
    try {
      const doctor = await prisma.doctor.findFirst({ where: { id } });
      return doctor;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  interface GetCardInfoOptions {
    page: number;
    pageSize: number;
    governorate: string | null;
    spec: string | null;
    search: string | null;
  }
  interface queryFilter {
    location?: { governorate: { contains: string } };
    specialization?: { contains: string };
    name?: { contains: string };
  }
  export const getCardInfo = async ({
    page,
    pageSize = 10,
    governorate,
    spec,
    search,
  }: GetCardInfoOptions) => {
    try {
      const filter: queryFilter = {};
      if (governorate) {
        filter.location = { governorate: { contains: governorate } };
      }
      if (spec) {
        filter.specialization = { contains: spec };
      }
      if (search) {
        filter.name = { contains: search };
      }
      const fetchedDoctors = await prisma.doctor.findMany({
        take: pageSize,
        where: filter,
        skip: (page - 1) * pageSize,
        select: {
          id: true,
          name: true,
          location: true,
          specialization: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      const totalCount = await prisma.doctor.count();
      const doctors = fetchedDoctors.map((doc) => {
        const ratingSum = doc.reviews.reduce((acc, currVal) => {
          return (acc += currVal.rating);
        }, 0);
        const avgRating =
          doc.reviews.length > 0
            ? (ratingSum / doc.reviews.length).toFixed(2)
            : 0;
        return { ...doc, avgRating: Number(avgRating) };
      });
      return {
        numberOfPages: Math.ceil(totalCount / pageSize),
        data: doctors,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  };
}
