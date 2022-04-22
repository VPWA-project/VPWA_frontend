export interface SearchChannelsStateInterface {
  prop: boolean;
}

function state(): SearchChannelsStateInterface {
  return {
    prop: false,
  };
}

export default state;
