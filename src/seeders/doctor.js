const { faker } = require("@faker-js/faker");
const { randomInt } = require("crypto");

const { PrismaClient } = require("@prisma/client");
// create an array for the doctors
async function seedFakeDoctors() {
  const doctors = [];
  const medicalSpecializations = [
    "Gynecology",
    "Otorhinolaryngology",
    "Ophthalmology",
    "Pulmonology",
    "Internal Medicine",
    "Hematology",
    "Cardiology",
    "Psychiatry",
    "Dermatology",
    "Gastroenterology",
    "Oncology",
    "Orthopedics",
    "Radiology",
    "Nephrology",
    "Urology",
    "Endocrinology",
    "Neurology",
  ];
  for (let i = 0; i < 100; i++) {
    // generate random data for each field
    const name =
      i % 2 === 0
        ? faker.name.fullName({ sex: "female" }).trim()
        : faker.name.fullName({ sex: "male" }).trim()
    const gender = i % 2 === 0 ? "female" : "male";
    const password = faker.internet.password(10);
    const username = name.replace(/\W/g, "").toLowerCase().trim();
    const email = faker.internet.email().trim().toLowerCase();
    const phoneNumber = String(faker.phone.number("+20-10-####-####")).replace(
      /-/g,
      ""
    );
    const specialization = medicalSpecializations[
      Math.floor(Math.random() * medicalSpecializations.length)
    ]
      .trim()
    const visitFee = faker.datatype.number({ min: 100, max: 500 });
    const workingHoursStart = randomInt(24).toString()+':'+"00" // added
    const workingHoursEnd = randomInt(24).toString()+':'+"00" // addedd
    const locationId = faker.datatype.number({ min: 1, max: 40 });

    // create an object for the doctor
    const doctor = {
      name,
      password,
      username,
      gender,
      workingHoursStart,
      workingHoursEnd,
      email,
      phoneNumber,
      specialization,
      visitFee,
      locationId,
    };

    // push the doctor object to the doctors array
    doctors.push(doctor);
  }

  // insert into the database
  const prisma = new PrismaClient();
  try {
    const res = await prisma.doctor.createMany({ data: doctors });
    console.log(`Inserted ${res.count} doctor in Database`);
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}
module.exports = { seedFakeDoctors };
