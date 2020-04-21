import { API_URLS, FIREBASE_URL } from 'Constants';
import { handleError, clearError } from "Helpers/networkResponseHelper";
import $ from 'jquery';
import { getToken, saveToken } from 'Auth';
import {
    createNewOffer,
    convertOfferForClient,
    convertOfferForServer
} from "Helpers/offerHelper";

// Action Constants
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const FINISH_LOGOUT = 'FINISH_LOGOUT';

export const SET_OFFERS = 'SET_OFFERS';
export const SET_OFFER_SAVED_INDICATOR = 'SET_OFFER_SAVED_INDICATOR';
export const INVALIDATE_OFFERS = 'INVALIDATE_OFFERS';
export const CREATE_OFFER = 'CREATE_OFFER';
export const UPDATE_OFFER = 'UPDATE_OFFER';
export const DELETE_OFFER = 'DELETE_OFFER';

export const SET_COMPANY_DATA = 'SET_COMPANY_DATA';

export const NETWORK_ACTION_STARTED = 'NETWORK_ACTION_STARTED';
export const NETWORK_ACTION_ENDED = 'NETWORK_ACTION_ENDED';
export const NETWORK_ERROR = 'NETWORK_ERROR';

export const SET_UNSAVED_DATA_NOTICE = 'SET_UNSAVED_DATA_NOTICE';

export const SEND_PUSH_NOTIFICATION = 'SEND_PUSH_NOTIFICATION';


//region Auth Action creators
export function login(payload) {

    return (dispatch) => {
        dispatch(networkActionStarted());

        return new Promise((resolve, reject) => {
            $.post({
                url: API_URLS.adminLogin,
                data:payload

            }).done((data)=>{
                resolve(data);

            }).fail((error)=>{
                reject(error);
            });
        }).then(
            data => {
                saveToken(data.token);
                dispatch(setCompanyData(data.company));
                dispatch(networkError({
                    exists:false,
                    statusCode:data.status,
                    message:''
                }))
            },
            error => {
                let errorText = 'There was an error while logging in. Contact Mogabi support if problem persists.';
                if (error.status === 400) {
                    errorText = 'Username or password incorrect.'
                }

                dispatch(networkError({
                    exists:true,
                    statusCode:error.status,
                    message:errorText

            }))
            }
        ).then(()=> {
                dispatch(networkActionEnded());
                dispatch(finishLogin());
            }
        );
    }
}

function finishLogin() {
    return {
        type: LOGIN
    }
}

/**
 * Logs the user out. This also returns a promise so that we can fix an issue, see below.
 *
 * NOTE: When the user refreshes the page and then tries to logout the logout functionality doesn't work. This is
 *       most likely occurring due to a url history wipe with react-router. We can get around this by returning a
 *       promise using redux-thunk and allowing the logout button to manually re-route us to the login page after
 *       logout.
 *
 * @returns {Promise}
 */
export function logout() {

    return (dispatch) => {

        dispatch(submitLogout());

        return new Promise((resolve, reject)=>{
            resolve(); // Tell the calling code that we have logged out.
        }).then(()=> {
            dispatch(finishLogout());
        });

    };

}

function submitLogout() {
    return {
        type: LOGOUT
    }
}

function finishLogout() {
    return {
        type:FINISH_LOGOUT
    }
}
//endregion

//region Main Offer Actions "Async"
/**NOTE: These actions will first try to contact the live database to save the information. Once the database has
 *       been successfully updated then the local state-data will then be updated through normal synchronous
 *       dispatch methods.
 *
 *       In the event of a network error the local state-data dispatch actions will not be called since this might
 *       confuse the user who may try to leave the portal before changes have been fully saved.
 * */
export function fetchOffers(companyId) {

    let token = getToken();
    let authToken = token !== null ? token.accessToken : ''; // This will force a logout if there is no token

    return (dispatch) => {

        // Start things like spinners and progress indicators
        dispatch(networkActionStarted());

        return new Promise((resolve, reject) => {
            $.post({

                url: API_URLS.getOffers,
                data: {
                    company: companyId
                },
                headers: {'Authorization': 'Bearer ' + authToken}
            }).done((data) => {
                clearError(dispatch);
                resolve(data);

            }).fail((error) => {
                handleError(dispatch, error);
                reject(error);
            })
        }).then(
            data => {
                dispatch(finishFetchOffers(data));
                dispatch(networkActionEnded())
            },
            error => {
                dispatch(networkActionEnded());
                console.error('There was an error fetching offers', error);
                throw new Error(error);
            }
        )
    }

}

export function createOffer(offer) {

    return (dispatch) => {

        dispatch(networkActionStarted());

        let token = getToken();
        let authToken = token !== null ? token.accessToken : ''; // This will force a logout if there is no token
        let data = convertOfferForServer(offer);

        return new Promise((resolve, reject)=>{

            $.ajax({
                method:'POST',
                url: API_URLS.createOffer,
                data: data,
                headers: {'Authorization': `Bearer ${authToken}`}

            }).done((data) => {
                clearError(dispatch);
                resolve(data);

            }).fail((error) => {
                handleError(dispatch, error, true);
                reject(error);

            })

        }).then((data) => {

                dispatch(networkActionEnded());

                let clientOffer = convertOfferForClient(data);

                // Yes, we are still calling finishUpdateOffer since that functionality is identical to what we need.
                dispatch(finishUpdateOffer(clientOffer));

            },
            (error) => {
                dispatch(networkActionEnded());

                console.log('There was an error with the request', error);

                throw new Error(error);
            }
        );

    }
}

/**
 * Updates an existing offer and sends the information to the online database.
 *
 * NOTE: In the event that the "createOffer" function failed and the user is trying to save an offer that is not
 *       on the database then this function will try to create the offer with the current values upon a 404 not found
 *       error response.
 * @param offer
 * @returns {function(*=)}
 */
export function updateOffer(offer) {

    return (dispatch) => {

        dispatch(networkActionStarted());

        let token = getToken();
        let authToken = token !== null ? token.accessToken : ''; // This will force a logout if there is no token
        let data = convertOfferForServer(offer);

        return new Promise((resolve, reject) => {

            $.ajax({
                method:'PUT',
                url: API_URLS.updateOffer + `${offer.id}/`,
                data: data,
                headers: {'Authorization': `Bearer ${authToken}`}

            }).done((date) => {
                clearError(dispatch);
                resolve(date);

            }).fail((error) => {
                handleError(dispatch, error, true);
                reject(error);

            })
        }).then((data) => {
                dispatch(networkActionEnded());

                let clientOffer = convertOfferForClient(data);

                dispatch(finishUpdateOffer(clientOffer));

            },
            (error) => {
                dispatch(networkActionEnded());
                console.log('There was an error with the request', error);

                throw new Error(error);
            }
        );
    };

}

/**
 * Updates the offer record on the database. This doesn't actually delete the offer since that is not what we want.
 * This will actually set the offer's "isDeleted" flag to true and then update that record in the database. Then
 * this will then send a fetch request for all offers again so that the data is fresh.
 *
 * @param offer
 * @returns {function(*)}
 */
export function deleteOffer(offer) {

    return (dispatch) => {

        dispatch(networkActionStarted());

        let token = getToken();
        let authToken = token !== null ? token.accessToken : ''; // This will force a logout if there is no token

        offer.isDeleted = true; // Make sure this is set.
        let data = convertOfferForServer(offer);

        return new Promise((resolve, reject) => {

            $.ajax({
                method:'PUT',
                url: API_URLS.updateOffer + `${offer.id}/`,
                data: data,
                headers: {'Authorization':`Bearer ${authToken}`}

            }).done((data)=> {
                clearError(dispatch);
                resolve(data);

            }).fail((error)=> {
                handleError(dispatch, error, true);
                reject(data);
            });

        }).then(
            (data)=>{
                dispatch(networkActionEnded());
                dispatch(finishDeleteOffer(offer));
                dispatch(invalidateOffers(true));
            },
            (error)=> {
                dispatch(networkActionEnded());

                console.log('Error deleting offer:', error)

                throw new Error('Error deleting offer');
            }
        );
    };

}
//endregion

//region Offer Actions "Local"
/* NOTE: Most (but not all) of these functions should be called after their "Async" counterparts above.
* */

export function invalidateOffers(shouldInvalidate) {
    return {
        type:INVALIDATE_OFFERS,
        payload:shouldInvalidate
    }

}

export function createLocalOffer(companyId) {
    return {
        type: CREATE_OFFER,
        payload: companyId
    }
}

/**
 * Sets the offer's saved parameter so we can tell whether or not the offer still needs to be saved to the database.
 * This is useful for showing the user which offers still need to be saved.
 */
export function setOfferSavedIndicator(payload) {
    return {
        type:SET_OFFER_SAVED_INDICATOR,
        payload: payload
    }
}

function finishFetchOffers(offers) {
    return {
        type:SET_OFFERS,
        payload:offers
    }
}

function finishUpdateOffer(updatedOffer) {
    return {
        type: UPDATE_OFFER,
        payload: updatedOffer
    }
}

function finishDeleteOffer(offerId) {
    return {
        type: DELETE_OFFER,
        payload: offerId
    }
}
//endregion

//region Company Action creators
export function setCompanyData(payload) {
    return {
        type: SET_COMPANY_DATA,
        payload: payload
    }
}
//endregion

//region Network Action creators
/**
 * Notifies the portal components that a network request has started and that any spinners or progress
 * indicators should start.
 * */
export function networkActionStarted() {
    return {
        type: NETWORK_ACTION_STARTED,
        payload: {
            isFetching:true
        }
    }
}

export function networkActionEnded() {
    return {
        type: NETWORK_ACTION_ENDED,
        payload: {
            isFetching: false
        }
    }
}

export function networkError(payload) {
    return {
        type: NETWORK_ERROR,
        payload:payload
    }
}
//endregion

//region Visual Action creators
export function setUnsavedDataNotice(hasUnsavedData) {
    return {
        type:SET_UNSAVED_DATA_NOTICE,
        payload: hasUnsavedData
    }
}
//endregion

//region Push Notifications
export function sendNotification(payload) {

    return (dispatch) => {

        dispatch(networkActionStarted());

        return new Promise((resolve, reject)=>{

            let firebaseKey = payload.firebaseServerKey;
            let title = payload.title;
            let message = payload.message;

            let androidData = {
                to: "/topics/android",
                priority: "high",
                data: {
                    title: title,
                    message: message
                }
            };

            let iOSData = {
              to: "/topics/ios",
              priority:"high",
              notification: {
                  title: title,
                  body: message
              }
            };

            // Send multiple requests and get a master response.
            // NOTE: When ANY of the requests fail the entire chain will fail.
            $.when(

                $.ajax({
                    method:'POST',
                    url: 'https://fcm.googleapis.com/fcm/send',
                    data: JSON.stringify(androidData),
                    headers: {
                        'Authorization': `key=${firebaseKey}`,
                        'Content-Type': 'application/json'
                    }
                }),
                $.ajax({
                    method:'POST',
                    url: 'https://fcm.googleapis.com/fcm/send',
                    data: JSON.stringify(iOSData),
                    headers: {
                        'Authorization': `key=${firebaseKey}`,
                        'Content-Type': 'application/json'
                    }
                }),

            ).done((response)=>{
                dispatch(networkActionEnded());
                resolve(response);

            }).fail((error)=>{
                dispatch(networkActionEnded());
                reject(error);

            });
        });

    }
}
//endregion

