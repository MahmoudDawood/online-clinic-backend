import { PrismaClient, Location } from "@prisma/client";

const prisma = new PrismaClient();

export namespace LocationService {
  export const create = async (location: Omit<Location, "id">) => {
    try {
      const newLocation = await prisma.location.create({
        data: location,
      });
      return newLocation;
    } catch (error) {
      throw error;
    }
  };
  export const getAll = async () => {
    try {
      const locations = await prisma.location.findMany();
      return locations;
    } catch (error) {
      throw error;
    }
  };
  export const getById = async (id: string) => {
    try {
      const location = await prisma.location.findFirst({
        where: { id: Number(id) },
      });
      return location;
    } catch (error) {
      throw error;
    }
  };
  export const updateById = async (
    id: string,
    updateData: Partial<Location>
  ) => {
    try {
      const location = await prisma.location.update({
        where: { id: Number(id) },
        data: { ...updateData },
      });
      return location;
    } catch (error) {
      throw error;
    }
  };
  export const deleteById = async (id: string) => {
    try {
      const location = await prisma.location.delete({
        where: { id: Number(id) },
      });
      return location;
    } catch (error) {
      throw error;
    }
  };
}
