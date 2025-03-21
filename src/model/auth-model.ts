export type UserType = {
  id?: string;
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
  token?: string;
  verified?: boolean;
};
export type RegisterRequest = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  token?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type UserResponse = {
  code: number;
  status: string;
  message: string;
  data?: {
    id?: string;
    fullname?: string;
    username?: string;
    email?: string;
    accessToken: string;
  };
};

export type TokenPayload = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  exp?: number;
};
