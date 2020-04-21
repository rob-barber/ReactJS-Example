import {
    NETWORK_ACTION_STARTED,
    NETWORK_ACTION_ENDED,
    NETWORK_ERROR,
    SET_UNSAVED_DATA_NOTICE
} from "Actions";
import { Map } from 'immutable';

const initialState = Map({
    isFetching: false,   // Used to notify app of network activity,
    pageTitle:'',
    unsavedData:false,
    error:{
        exists:false,
        statusCode:null,
        message:''
    }
});

export default function gui(state = initialState, action) {
    switch (action.type) {
        case NETWORK_ACTION_STARTED:
            return state.set('isFetching', true);
        case NETWORK_ACTION_ENDED:
            return state.set('isFetching', false);
        case NETWORK_ERROR:
            let payload = action.payload;

            return state.withMutations(map => {
                map.set('unsavedData', payload.unsavedData ? payload.unsavedData : false);
                map.set('error', {
                    exists:payload.exists,
                    statusCode:payload.statusCode,
                    message:payload.message
                });
            });

        case SET_UNSAVED_DATA_NOTICE: {
            return state.set('unsavedData', action.payload);
        }

        default:
            return state;
    }
}