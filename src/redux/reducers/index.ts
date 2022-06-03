import { combineReducers } from "redux";

import CellsReducer from "./cells.reducer";

const reducer = combineReducers({
  cells: CellsReducer,
});

export default reducer;

export type RootState = ReturnType<typeof reducer>