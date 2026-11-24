import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config.js";
// import { AppError } from "../../utils/AppError.js";
import { Ilogin, RegisterUser } from "./auth.types.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { welcomeEmailTemplate } from "../../utils/email/emailTemplates.js";
import { uploadImage } from "../../utils/imgeUpload.js";
import { AppError } from "../../utils/ApiError.js";
const login = (payload: Ilogin) => {
  const { email, password } = payload;
  //logic
  // user data
  const user = {
    name: "refat",
    email: "refat@gmail.com",
    password: "1234",
  };

  if (user.email !== email) throw new AppError(404, "User not found");

  if (user.password !== password) throw new AppError(401, "Wrong Pass");

  return user;
};

//regster
const registerUser = async (payload: RegisterUser, avatarBuffer?: Buffer) => {
  let avatarKey: string | null = null;
  let avatarUrl: string | null = null;

  if (avatarBuffer) {
    const uploaded = await uploadImage(avatarBuffer, { folder: "avatar" });
    avatarKey = uploaded.key;
    avatarUrl = uploaded.url;
  }

  //check in db use asy ki na
  const isExistUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  //if exist block here
  if (isExistUser) {
    throw new AppError(StatusCodes.CONFLICT, "User already exist");
  }

  //pass hash
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  //update to  db
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      avatarKey,
      avatarUrl,
    },
    omit: {
      password: true,
    },
  });
  console.log("User Register successfuly");
  //send welcome email
  try {
    await sendEmail({
      to: newUser.email,
      subject: "Welcome to Rise Together",
      html: welcomeEmailTemplate(newUser.name),
    });
    console.log("email send successfuly....");
  } catch (error) {
    console.log("email send error:", error);
  }

  return newUser;
};

export const authSevice = {
  login,
  registerUser,
  // otp,
  // pass_reset
};
