export enum StatusType {
  Online = 'green',
  Dnd = 'red',
  Offline = 'black',
}

export interface UserStateInterface {
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  status?: StatusType;
  id?: number;
}

const state = (): UserStateInterface => {
  return {
    firstname: 'Jozko',
    lastname: 'Mrkvicka',
    nickname: 'jozino',
    email: 'hhh',
    status: StatusType.Online,
  };
};

export default state;
