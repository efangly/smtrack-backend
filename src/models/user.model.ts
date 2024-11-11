import { z } from "zod";

export const ZUserParam = z.object({ userId: z.string() });
export const ZLogin = z.object({
  username: z.string(),
  password: z.string()
});
export const ZResetPass = z.object({
  password: z.string(),
  oldPassword: z.string().optional()
});
export const ZRegisUser = z.object({
  userId: z.string().optional(),
  wardId: z.string(),
  userName: z.string(),
  userPassword: z.string(),
  userStatus: z.string().optional(),
  userLevel: z.string().optional(),
  displayName: z.string().optional(),
  userPic: z.string().optional(),
  comment: z.string().optional(),
  createBy: z.string().optional(),
  createAt: z.date().optional(),
  updateAt: z.date().optional()
});

export const ZUserBody = z.object({
  wardId: z.string().optional(),
  userName: z.string().optional(),
  userPassword: z.string().optional(),
  userStatus: z.string().optional(),
  userLevel: z.string().optional(),
  displayName: z.string().optional(),
  userPic: z.string().optional(),
  comment: z.string().optional(),
  createBy: z.string().optional(),
});

export type TLogin = z.infer<typeof ZLogin>;
export type TRegisUser = z.infer<typeof ZRegisUser>;
export type TResetPass = z.infer<typeof ZResetPass>;
export type ResLogin = {
  token: string, 
  userId: string, 
  hosId: string,
  wardId: string,  
  userLevel: string, 
  hosPic: string | null, 
  hosName: string, 
  userStatus: boolean, 
  userName: string, 
  displayName: string | null, 
  userPic: string | null
}
export type ResToken = {
  userId: string, 
  userLevel: string, 
  hosId: string, 
  wardId: string,
  iat: number
}