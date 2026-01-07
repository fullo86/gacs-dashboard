import { z } from "zod";

export const userRegisterSchema = z.object({
    username: z.string().min(4, { message: 'Username required is 8 character' }),
    first_name: z.string().min(3, { message: 'First name min 5 character' }),
    last_name: z.string(),
    phone: z.string().max(13, { message: 'Invalid Mobile Phone Number' }),
    email: z.string().email({ message: 'Invalid Email' }),
    password: z.string().min(8, { message: 'Password min 8 character' }),
    cfm_password: z.string().min(8, { message: 'Password min 8 character' }),
});


export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token empty"),
  newPassword: z.string().min(6, "Password less than 6"),
});

export const WifiSchema = z.object({
  device_id: z.string().min(1),
  wifi_ssid: z.string().min(1).max(32),
  security_mode: z.string().optional().default('WPA2PSK'),
  wifi_password: z.string().optional(),
  wlan_index: z.number().optional().default(1)
});

export const ChangePasswordSchema = z.object({
  old_password: z.string().min(8, "Password must be at least 6 characters long"),
  new_password: z.string().min(8, "Password must be at least 6 characters long"),
  confirm_password: z.string().min(8, "Password must be at least 6 characters long"),
});
