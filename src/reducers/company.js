import { SET_COMPANY_DATA, LOGOUT } from "Actions/index";
import { Map } from 'immutable';


const initialState = getInitialState();

/**
 * Reducer function that returns a the next state based off of input parameters
 * @param state
 * @param action Contains the type of action along with a payload. NOTE: The payload MUST contain
 *               ALL properties listed within the initial state or else error can occur
 */
export default function company(state = initialState, action) {
    switch(action.type) {
        case SET_COMPANY_DATA:
            let payload = action.payload;

            // Get the new state from the payload.
            let newState = state.withMutations(map => {

                if (payload.id !== undefined) {
                    map.set('id', payload.id);
                }

                if (payload['user_email'] !== undefined) {
                    map.set('userId', payload['user_email']);
                }

                if (payload.name !== undefined) {
                    map.set('name', payload.name);
                }

                if (payload.contactNumber !== undefined) {
                    map.set('contactNumber', payload.contactNumber);
                }

                if (payload['user_email'] !== undefined) {
                    map.set('userEmail', payload['user_email']);
                }

                if (payload['firebase_server_key'] !== undefined) {
                    map.set('firebaseServerKey', payload['firebase_server_key']);
                }
            });

            saveCompany(newState.toJS());

            return newState;
        case LOGOUT:
            return Map({
                id:'',
                userId:'',
                name:'',
                contactNumber:'',
                userEmail:'',
                firebaseServerKey:''
            });
        default:
            return state;

    }
}

function getInitialState() {
    if (savedCompanyExists()) {
        return Map(getSavedCompany());
    } else {
        return Map({
            id:'',
            userId:'',
            name:'',
            contactNumber:'',
            userEmail:'',
            firebaseServerKey:''
        })
    }
}

function saveCompany(company) {

    let saveFormat = {
        id:company.id,
        userId:company.userEmail,
        name:company.name,
        contactNumber:company.contactNumber,
        userEmail:company.userEmail,
        firebaseServerKey: company.firebaseServerKey
    };

    localStorage.company = JSON.stringify(saveFormat);
}

function getSavedCompany() {
    if (savedCompanyExists()) {
        return JSON.parse(localStorage.company)
    }
}

function savedCompanyExists() {

    let isValid = false;

    try {
        let parsed = JSON.parse(localStorage.company);
        isValid = parsed !== null && isValid !== '';
    } catch(error) {

    }

    return localStorage.company !== undefined
        && localStorage.company !== null
        && isValid;
}