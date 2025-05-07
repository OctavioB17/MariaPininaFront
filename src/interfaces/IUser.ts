export interface IUser {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUserNoPassword extends Omit<IUser, 'password'> {}
  
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