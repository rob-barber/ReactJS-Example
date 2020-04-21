import { LOGOUT } from 'Actions/index';
import { combineReducers } from 'redux';
import auth from 'Reducers/auth';
import gui from 'Reducers/gui';
import offers from 'Reducers/offers';
import company from 'Reducers/company';

// For an easier way of logging out we will temporarily intercept the state and check if the action is for logging out.
const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        localStorage.clear();
        state = undefined; // This will reset the entire state to the initial values
    }

    return portalData(state, action);
};

const portalData = combineReducers({
    auth,
    gui,
    offers,
    company
});

export default rootReducer;

