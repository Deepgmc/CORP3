export interface IUser {
  userId    : number,
  username  : string,
  birth     : number, //timestamp of a birth
  email     : string,
  companyId : number | null,
  isDirector: boolean,
  gender: boolean,
  bio: string;
  firstName: string,
  lastName: string,
  phone: string,
}

export interface ILoginUser extends Pick<IUser, 'username'> {
  password: string,
}

export interface TRegisterForm extends Pick<IUser, 'username' | 'email' | 'birth' | 'companyId' | 'isDirector'> {
    passwordConfirm: string,
    password: string,
}

export type TUserId = IUser['userId'];

export type IUsersCreateDTO = Omit<IUser, 'userId'>
export type IUsersUpdateDTO = Partial<IUser>
export type TUserWithoutPassword = Omit<IUser, 'password'>
