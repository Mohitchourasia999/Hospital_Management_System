import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// ================= PATIENT REGISTER =================

export const patientRegister = catchAsyncErrors(
  async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      role,
    } = req.body;

    // VALIDATION
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !dob ||
      !nic ||
      !role
    ) {
      return next(
        new ErrorHandler("Please fill all the fields", 400)
      );
    }

    // CHECK USER EXISTS
    let user = await User.findOne({ email });

    if (user) {
      return next(
        new ErrorHandler("User already exists", 400)
      );
    }

    // CREATE USER
    user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      role,
    });

    generateToken(
      user,
      "User registered successfully",
      200,
      res
    );
  }
);

// ================= LOGIN =================

export const login = catchAsyncErrors(
  async (req, res, next) => {
    const { email, password, role } = req.body;

    // VALIDATION
    if (!email || !password || !role) {
      return next(
        new ErrorHandler("Please fill all the fields", 400)
      );
    }

    // FIND USER
    const user = await User.findOne({ email }).select(
      "+password"
    );

    if (!user) {
      return next(
        new ErrorHandler("User does not exist", 400)
      );
    }

    // CHECK PASSWORD
    const isPasswordMatch = await user.comparePassword(
      password
    );

    if (!isPasswordMatch) {
      return next(
        new ErrorHandler(
          "Invalid email or password",
          400
        )
      );
    }

    // CHECK ROLE
    if (role !== user.role) {
      return next(new ErrorHandler("Invalid role", 400));
    }

    generateToken(
      user,
      "User logged in successfully",
      200,
      res
    );
  }
);

// ================= ADD ADMIN =================

export const addNewAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
    } = req.body;

    // VALIDATION
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !dob ||
      !nic
    ) {
      return next(
        new ErrorHandler("Please fill all the fields", 400)
      );
    }

    // CHECK USER EXISTS
    const isRegistered = await User.findOne({ email });

    if (isRegistered) {
      return next(
        new ErrorHandler("User already exists", 400)
      );
    }

    // CREATE ADMIN
    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      role: "Admin",
    });

    generateToken(
      admin,
      "Admin registered successfully",
      200,
      res
    );
  }
);

// ================= GET ALL DOCTORS =================

export const getAllDoctors = catchAsyncErrors(
  async (req, res, next) => {
    const doctors = await User.find({
      role: "Doctor",
    });

    res.status(200).json({
      success: true,
      doctors,
    });
  }
);

// ================= GET USER DETAILS =================

export const getUserDetails = catchAsyncErrors(
  async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// ================= LOGOUT ADMIN =================

export const logoutAdmin = catchAsyncErrors(
  async (req, res, next) => {
    res
      .status(200)
      .cookie("adminToken", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Admin logged out successfully",
      });
  }
);

// ================= LOGOUT PATIENT =================

export const logoutPatient = catchAsyncErrors(
  async (req, res, next) => {
    res
      .status(200)
      .cookie("patientToken", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Patient logged out successfully",
      });
  }
);

// ================= ADD NEW DOCTOR =================

export const addNewDoctor = catchAsyncErrors(
  async (req, res, next) => {
    // CHECK IMAGE EXISTS
    if (!req.files || !req.files.docAvatar) {
      return next(
        new ErrorHandler(
          "Please upload a profile picture",
          400
        )
      );
    }

    const { docAvatar } = req.files;

    // ALLOWED IMAGE TYPES
    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(
        new ErrorHandler("File format not allowed", 400)
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      doctorDepartment,
    } = req.body;

    // VALIDATION
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !dob ||
      !nic ||
      !doctorDepartment
    ) {
      return next(
        new ErrorHandler("Please fill all the fields", 400)
      );
    }

    // CHECK USER EXISTS
    const isRegistered = await User.findOne({
      email,
    });

    if (isRegistered) {
      return next(
        new ErrorHandler("User already exists", 400)
      );
    }

    // CLOUDINARY UPLOAD
    let cloudinaryResponse;

    try {
      cloudinaryResponse =
        await cloudinary.uploader.upload(
          docAvatar.tempFilePath
        );
    } catch (error) {
      return next(
        new ErrorHandler(
          "Cloudinary upload failed",
          500
        )
      );
    }

    // CREATE DOCTOR
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      doctorDepartment,
      role: "Doctor",

      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });
  }
);
// ================= DELETE DOCTOR =================

export const deleteDoctor =
  catchAsyncErrors(
    async (req, res, next) => {
      const doctor =
        await User.findById(
          req.params.id
        );

      if (!doctor) {
        return next(
          new ErrorHandler(
            "Doctor not found",
            404
          )
        );
      }

      await doctor.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Doctor deleted successfully",
      });
    }
  );

// ================= UPDATE DOCTOR =================

export const updateDoctor =
  catchAsyncErrors(
    async (req, res, next) => {
      const doctor =
        await User.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Doctor updated successfully",
        doctor,
      });
    }
  );
  // ================= GET ALL PATIENTS =================

export const getAllPatients =
  catchAsyncErrors(
    async (req, res, next) => {
      const patients =
        await User.find({
          role: "Patient",
        });

      res.status(200).json({
        success: true,
        patients,
      });
    }
  );

// ================= DELETE PATIENT =================

export const deletePatient =
  catchAsyncErrors(
    async (req, res, next) => {
      const patient =
        await User.findById(
          req.params.id
        );

      if (!patient) {
        return next(
          new ErrorHandler(
            "Patient not found",
            404
          )
        );
      }

      await patient.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Patient deleted successfully",
      });
    }
  );