import { DoctorService, PatientService } from "../services";
import { locations } from "./locations";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export const sendSMS = async (doctorId: number, at: Date) => {
  try {
    const doctor = await DoctorService.findById(doctorId);
    if (!doctor) {
      throw new Error("Couldn't find doctor info to send SMS");
    }
    const location = locations[doctor.locationId];
    const [date, time] = at.toString().split("T");
    const parsedTime = time.substring(0, time.lastIndexOf(":"));
    const doctorMessage = await client.messages.create({
      body: `You booked an appointment with Dr. ${doctor.name} in ${date}, at ${parsedTime}.
Clinic location: ${location.street}, ${location.city}.
Online Clinic.`,
      from: "+14345426551",
      to: "+201128593701",
    });
    console.log("SMS Sent SucceSfully");
  } catch (error) {
    console.error(error);
  }
};
