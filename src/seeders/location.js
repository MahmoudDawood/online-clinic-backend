const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs/promises");
const prisma = new PrismaClient();

async function seedFakeLocations() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "locations.json"),
      "utf8"
    );
    let parsedData = JSON.parse(data);
    parsedData = parsedData.map((location) => {
      return {
        ...location,
        city: location.city.trim(),
        governorate: location.governorate.trim(),
      };
    });
    const res = await prisma.location.createMany({ data: parsedData });
    console.log(`Inserted ${res.count} fake locations in databse`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { seedFakeLocations };
