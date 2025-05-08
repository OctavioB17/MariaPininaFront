export interface IUser {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string
    role: UserRoles;
    refreshToken: string
    createdAt: string;
    updatedAt: string;
}

export type UserRoles = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR';


export type IUserNoPassword = Omit<IUser, 'password'>
  
export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  name: string;
  surname: string;
  email: string;
  password: string;
}