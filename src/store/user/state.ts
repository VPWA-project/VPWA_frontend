export interface UserStateInterface {
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
}

const state = (): UserStateInterface => {
  return {
    firstname: 'Jozko',
    lastname: 'Mrkvicka',
    nickname: '@jozino',
    email: 'hhh'
  };
}

export default state;
