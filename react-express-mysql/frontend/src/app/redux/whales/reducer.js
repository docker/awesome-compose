import * as ActionTypes from "./action-types";
import { handleActions } from "redux-actions";

const defaultState = {
    list: [],
};

const handleFetchWhales = (state, {payload}) => {
    return state;
};

const reducer = handleActions({
    [ActionTypes.FETCH_WHALES] : handleFetchWhales
}, defaultState);

export default reducer;
