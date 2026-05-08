import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import {User} from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
           firstName,
           lastName,
           email,
           phone,
           nic,
           dob,
           gender,
           appointment_date,
           department,
           doctor_firstName,
           doctor_lastName,
           hasVisited,
           address
         } = req.body;

    if(!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address) {
        return next(new ErrorHandler("Please fill all the required fields!", 400));
    }
    const isConflict = await User.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department,
    });
    if(isConflict.length === 0) {
        return next(new ErrorHandler("No doctor found with the provided details!", 404));
    }
    if(isConflict.length > 1){
        return next(new ErrorHandler("Multiple doctors found with the provided details! Please contact the admin.", 409));
    }
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;

    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId
    });

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully!",
        appointment,
    });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments,
    })
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const { status } = req.body;

    let appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return next(
        new ErrorHandler(
          "Appointment not found!",
          404
        )
      );
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment status updated successfully!",
      appointment,
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
const {id} = req.params;
let appointment = await Appointment.findById(id);
if(!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
}
await appointment.deleteOne();
res.status(200).json({
    success: true,
    message: "Appointment deleted successfully!",
});
});