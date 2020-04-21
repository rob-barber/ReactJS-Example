import {
    INVALIDATE_OFFERS,
    SET_OFFER_SAVED_INDICATOR,
    SET_OFFERS,
    CREATE_OFFER,
    UPDATE_OFFER,
    DELETE_OFFER
} from "Actions";
import { createNewOffer } from 'Helpers/offerHelper';
import { Map } from 'immutable';
import moment from 'moment';

const initialState = Map({
    invalidated:true,
    items:Map({})
});

/**
 * These actions refer to the local actions to perform after
 * @param state
 * @param action Contains both the type of action along with any payload to help process the action.
 * @returns {*}
 */
export default function offers(state = initialState, action) {

    switch (action.type) {

        case INVALIDATE_OFFERS:
            return state.set('invalidated', action.payload);

        case SET_OFFER_SAVED_INDICATOR: {
            let offerId = action.payload.offerId;
            let saved = action.payload.isSaved;

            let items = state.get('items');

            let offer = items.get(`${offerId}`);

            offer.saved = saved;

            let newItems = items.set(`${offer.id}`, offer);

            return state.set('items', newItems);

        }

        case SET_OFFERS: {

            let newItemsArray = action.payload;
            let newItems = {};

            // Convert the array of offers into the needed format
            for (let i = 0; i < newItemsArray.length; i++) {
                newItems[newItemsArray[i].id] = {
                    id: newItemsArray[i].id,
                    company: newItemsArray[i].company,
                    title: newItemsArray[i].title,
                    description: newItemsArray[i].description,
                    scoreNeeded: newItemsArray[i]['score_needed'],
                    activeDuration: newItemsArray[i]['active_duration'],
                    offerCode: newItemsArray[i]['offer_code'],
                    isSignupReward: newItemsArray[i]['is_signup_reward'],
                    isActive: newItemsArray[i]['is_active'],
                    dateCreated: moment(newItemsArray[i]['date_created']),
                    lastUpdated: moment(newItemsArray[i]['last_updated']),
                    expirationDate: moment(newItemsArray[i]['expiration_date']),
                    isDeleted: newItemsArray[i]['is_deleted'],
                    saved: true // All of the data is most current at this point.
                };
            }

            let newState = state.withMutations(map => {
                map.set('invalidated', false)
                    .set('items', Map(newItems))
            });

            return newState;
        }

        case CREATE_OFFER: {
            let companyId = action.payload;

            let newOffer = createNewOffer(companyId);

            let items = state.get('items');

            let newItems = items.set(`${newOffer.id}`, newOffer);

            return state.set('items', newItems);
        }

        case UPDATE_OFFER: {
            /* NOTE: This action should only be called AFTER a successful network request to the database to update
            *        the backend. After the network update request returns success then we can say that this item
            *        has been successfully saved.
            *
            *  NOTE2: This will also be called after a successful submission of a new offer to the database since
            *         the functionality is the same.
            * */

            let payloadOffer = action.payload;
            let items = state.get('items');

            let stateOffer = items.get(`${payloadOffer.id}`);

            if (stateOffer === undefined || stateOffer === null) {
                console.error(`offers reducer: required offer doesn't exist`, payloadOffer.id);
                return state;
            }

            let newItems = items.set(`${payloadOffer.id}`, payloadOffer);

            return state.set('items', newItems);
        }

        case DELETE_OFFER: {
            let id = action.payload.id;
            let items = state.get('items');

            if (id in items.toJS()) {

                let newItems = items.delete(`${id}`);

                return state.set('items', newItems);
            } else {
                console.error(
                    `offers reducer: cannot delete offer:${id}. No offer with that id exists`, state);
                return state;
            }
        }

        default:
            return state;

    }
}


