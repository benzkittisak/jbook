import { combineReducers } from "redux";

import CellsReducer from "./cells.reducer";
import bundleReducer from "./bundles.reducer";

const reducer = combineReducers({
  cells: CellsReducer,
  bundles: bundleReducer
});

export default reducer;

export type RootState = ReturnType<typeof reducer>