import { REFRESHCOUNT, TABLEDATA } from "./Constant";

const initialState = {
  refreshcount: "false",
  data: []
};

function rootReducer(state = initialState, action) {
  console.log("ooooooooooooooooo");
  if (action.type == REFRESHCOUNT) {
    return Object.assign({}, state, {
      refreshcount: action.payload
    });
  }
  if (action.type == TABLEDATA) {
    console.log("adding data");
    return Object.assign({}, state, {
      data: action.payload.res
    });
  }

  return state;
}

export default rootReducer;
