const { seedFakeDoctors } = require("./doctor");
const { seedFakeLocations } = require("./location");
const { seedFakeReviews } = require("./review");
const { seedFakePatients } = require("./patient");

async function main() {
  await seedFakeLocations(); // WARNING!! ONLY RUN THIS ONCE! COMMENT IT OUT IF YOU RUN THIS MORE THAN ONCE
  await seedFakePatients();
  await seedFakeDoctors();
  await seedFakeReviews();
}
main();
