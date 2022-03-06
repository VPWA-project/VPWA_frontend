export interface UserStateInterface {
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  status?: Enumerator;
  id?: number;
}

const state = (): UserStateInterface => {
  return {};
};

export default state;
