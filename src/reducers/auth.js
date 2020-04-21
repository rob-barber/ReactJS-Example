import { LOGIN, FINISH_LOGOUT } from 'Actions/index';
import { Map } from 'immutable'
import { isAuthenticated, getToken } from 'Auth';


const initialState = getInitialState();

export default function auth(state = initialState, action)  {
    switch (action.type) {
        case LOGIN:
            if (isAuthenticated()) {
                return state.withMutations(map => {
                    map.set('isLoggedIn', true)
                        .set('token', getToken())
                });
            } else {
                return state;
            }

        case FINISH_LOGOUT:
            return Map({
                isLoggedIn:false,
                token:null
            });

        default:
            return state;
    }
}

function getInitialState() {
    if (isAuthenticated()) {
        return Map({
            isLoggedIn:isAuthenticated(),
            token:getToken()
        });
    } else {
        return Map({
            isLoggedIn:false,
            token:null
        });
    }
}
