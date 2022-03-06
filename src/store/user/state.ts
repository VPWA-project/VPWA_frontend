export enum UserStatus {
  Online = 'ONLINE',
  DND = 'DND',
  Ofline = 'OFFLINE'
}
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
  email: string;
  status: UserStatus
}

export interface UserStateInterface {
  loggedInUser?: User;
  users: Array<User>;
}

const state = (): UserStateInterface => {
  return {
    users: []
  };
};

export default state;
