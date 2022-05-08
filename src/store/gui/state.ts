export interface GuiStateInterface {
  rightDrawerOpen: boolean;
}

function state(): GuiStateInterface {
  return {
    rightDrawerOpen: false,
  };
}

export default state;
