export interface UserStateInterface {
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  status?: Enumerator;
  id?: number;
}

const state = (): UserStateInterface => {
  return {
    firstname: 'Jozko',
    lastname: 'Mrkvicka',
    nickname: '@jozino',
    email: 'hhh',
  };
};

export default state;
