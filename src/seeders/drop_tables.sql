CREATE OR REPLACE PROCEDURE drop_tables() AS $$
BEGIN
  DROP TABLE IF EXISTS "PatientReview" CASCADE;
  DROP TABLE IF EXISTS "Patient" CASCADE;
  DROP TABLE IF EXISTS "Doctor" CASCADE;
  DROP TABLE IF EXISTS "Location" CASCADE;
END;
$$ LANGUAGE plpgsql;
