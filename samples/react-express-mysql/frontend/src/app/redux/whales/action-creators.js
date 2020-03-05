import { createAction } from 'redux-actions';
import * as ActionTypes from "./action-types";

export const fetchWhales = createAction(ActionTypes.FETCH_WHALES);
