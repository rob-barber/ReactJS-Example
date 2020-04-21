import { networkError, logout } from 'Actions/index';

/**
 * Handles processing a network error. This will not only dispatch the networkError action with correct data but
 * also log the user out in the event that the token is no longer valid.
 * @param dispatch
 * @param error
 * @param unsavedData Boolean to tell the system whether there was unsaved data or not upon the error
 */
export function handleError(dispatch, error, unsavedData = false) {
    // Set the state to include the error information
    dispatch(networkError({
        exists: true,
        statusCode: error.status,
        message: 'There was an error retrieving offers.'
    }));

    // 401 = unauthorized, meaning the token is bad.
    if (error.status === 401){
        dispatch(logout())
    }
}

/**
 * This will clear any error data that is in the Redux state. We should always call this on a successful network
 * request
 * @param dispatch
 */
export function clearError(dispatch) {
    dispatch(networkError({
        exists: false,
        statusCode: null,
        message: '',
        unsavedData:false
    }));
}