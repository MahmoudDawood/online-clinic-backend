const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedFakePatients() {
  let patients = [];
  for (let i = 0; i < 100; i++) {
    // generate random data for each field
    const name =
      i % 2 === 0
        ? faker.name.fullName({ sex: "female" }).trim()
        : faker.name.fullName({ sex: "male" }).trim()
    const password = faker.internet.password(10);
    const gender = i % 2 === 0 ? "female" : "male";
    const dateOfBirth = faker.date.between('1958-01-01T00:00:00.000Z', '1992-01-01T00:00:00.000Z')
    const username = name.replace(/\W/g, "").toLowerCase().trim();
    const email = faker.internet.email().trim().toLowerCase();
    const phoneNumber = String(faker.phone.number("+20-10-####-####"))
      .replace(/-/g, "")
      .trim();
    // create an object for the patient
    const patient = {
      name,
      password,
      username,
      email,
      gender,
      dateOfBirth,
      phoneNumber,
    };

    // push the patient object to the patients array
    patients.push(patient);
  }
  try {
    const res = await prisma.patient.createMany({ data: patients });
    console.log(`Inserted ${res.count} patient records in the Database`);
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}
module.exports = { seedFakePatients };
