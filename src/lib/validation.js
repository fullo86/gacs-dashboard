import { z } from "zod";

export const userRegisterSchema = z.object({
    username: z.string().min(8, { message: 'Username required is 8 character' }),
    first_name: z.string().min(5, { message: 'First name min 5 character' }),
    last_name: z.string(),
    phone: z.string().max(13, { message: 'Invalid Mobile Phone Number' }),
    email: z.string().email({ message: 'Invalid Email' }),
    password: z.string().min(8, { message: 'Password min 8 character' }),
    cfm_password: z.string().min(8, { message: 'Password min 8 character' }),
});
