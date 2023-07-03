import { DoctorService, PatientService } from "../services";
import { locations } from "./locations";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export const bookingSMS = async (
  doctorId: number,
  patientId: number,
  at: Date
) => {
  try {
    const doctor = await DoctorService.findById(doctorId);
    const patient = await PatientService.findById(patientId);
    if (!doctor) {
      throw new Error("Couldn't find doctor info to send SMS");
    }
    if (!patient) {
      throw new Error("Couldn't find patient info to send SMS");
    }
    const location = locations[doctor.locationId];
    const [date, time] = at.toJSON().split("T");
    const parsedTime = time.substring(0, time.lastIndexOf(":"));
    const patientMessage = await client.messages.create({
      body: `You booked an appointment with Dr. ${doctor.name} in ${date} at ${parsedTime}.
Clinic location: ${location.street}, ${location.city}.
Online Clinic.`,
      from: "+14345426551",
      to: `${patient.phoneNumber}`,
    });
    const doctorMessage = await client.messages.create({
      body: `The patient ${patient.name} booked an appointment with you in ${date} at ${parsedTime}.
Clinic location: ${location.street}, ${location.city}.
Online Clinic.`,
      from: "+14345426551",
      to: `${doctor.phoneNumber}`,
    });
    console.log("SMS sent successfully");
  } catch (error: any) {
    throw error;
  }
};
export const cancelationSMS = async (
  doctorId: number,
  patientId: number,
  at: Date
) => {
  try {
    const doctor = await DoctorService.findById(doctorId);
    const patient = await PatientService.findById(patientId);
    if (!doctor) {
      throw new Error("Couldn't find doctor info to send SMS");
    }
    if (!patient) {
      throw new Error("Couldn't find patient info to send SMS");
    }

    const [date, time] = at.toJSON().split("T");
    const parsedTime = time.substring(0, time.lastIndexOf(":"));

    const patientMessage = await client.messages.create({
      body: `Your booked appointment with Dr. ${doctor.name} in ${date} at ${parsedTime} was cancelled.
We will notify you with any updates.
Online clinic.`,
      from: "+14345426551",
      to: `${patient.phoneNumber}`,
    });
    const doctorMessage = await client.messages.create({
      body: `Your appointment with ${patient.name} in ${date} at ${parsedTime} was cancelled.
We Will notify you with any updates.
Online clinic.`,
      from: "+14345426551",
      to: `${doctor.phoneNumber}`,
    });
    console.log("SMS sent successfully");
  } catch (error: any) {
    throw error;
  }
};
