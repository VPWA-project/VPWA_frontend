export enum UserStatus {
  Online = 'ONLINE',
  Dnd = 'DND',
  Offline = 'OFFLINE',
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
  email: string;
  status: UserStatus;
}

export interface UserStateInterface {
  loggedInUser?: User;
  users: Array<User>;
}

const state = (): UserStateInterface => {
  return {
    loggedInUser: {
      id: 1,
      firstname: 'Jozko',
      lastname: 'Mrkvicka',
      nickname: 'jozino',
      email: 'jozino@gmail.com',
      status: UserStatus.Online,
    },
    users: [],
  };
};

export default state;
