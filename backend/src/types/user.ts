import { ISODateString } from "next-auth";

export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  image: string;
  name: string;
}
