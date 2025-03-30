import { env } from "../config/env";
// @ts-expect-error
import { UserDetail } from "otpless-node-js-auth-sdk";
const generateOrderId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `OTPID-${timestamp}-${randomNum}`;
};

const sendOTP = async ({
  phoneNumber,
  email = "",
  channel = "",
  hash = "",
  orderId,
  expiry = 120,
  otpLength = 6,
}: {
  phoneNumber: string;
  email?: string;
  channel?: string;
  hash?: string;
  orderId: string;
  expiry?: number;
  otpLength?: number;
}) => {
  try {
    const response = await UserDetail.sendOTP(
      `91${phoneNumber}`,
      email,
      channel,
      hash,
      orderId,
      expiry,
      otpLength,
      env.OTPLESS_CLIENT_ID,
      env.OTPLESS_CLIENT_SECRET
    );
    console.log("🚀 ~ response:", response);
    return response;
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return { success: false, message: error.errorMessage };
  }
};

const resendOTP = async ({ orderId }: { orderId: string }) => {
  try {
    const response = await UserDetail.resendOTP(
      orderId,
      env.OTPLESS_CLIENT_ID,
      env.OTPLESS_CLIENT_SECRET
    );
    console.log("🚀 ~ resendOTP ~ response:", response);

    return response;
  } catch (error: any) {
    console.error("Error resending OTP:", error);
    return { success: false, message: error.errorMessage };
  }
};

const verifyOTP = async ({
  phoneNumber,
  orderId,
  otp,
  email = "",
}: {
  phoneNumber: string;
  orderId: string;
  otp: string;
  email?: string;
}) => {
  try {
    const response = await UserDetail.verifyOTP(
      email,
      `91${phoneNumber}`,
      orderId,
      otp,
      env.OTPLESS_CLIENT_ID,
      env.OTPLESS_CLIENT_SECRET
    );
    console.log("🚀 ~ response:", response);

    return response;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: error.errorMessage };
  }
};

export { sendOTP, resendOTP, verifyOTP, generateOrderId };
