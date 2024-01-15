const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedFakeReviews() {
  let reviews = [];
  const docIdSet = new Set();
  for (let i = 0; i < 100; i++) {
    // generate random data for each field
    let doctorId = Math.floor(Math.random() * 100) + 1;
    while (docIdSet.has(doctorId)) {
      doctorId = Math.floor(Math.random() * 100) + 1;
    }
    const patientId = Math.floor(Math.random() * 100) + 1;
    const review = faker.lorem.paragraph();
    const rating = Number((Math.random() * 5).toFixed(1));

    const resultReview = {
      doctorId,
      patientId,
      review,
      rating,
    };
    // push the doctor object to the doctors array
    reviews.push(resultReview);
  }
  const res = await prisma.patientReview.createMany({ data: reviews });
  console.log(`Inserted ${res.count} fake reviews in database`);
}

module.exports = { seedFakeReviews };
