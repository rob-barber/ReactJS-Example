import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { Map } from 'immutable';

export function createNewOffer(companyId) {

    return {
        id: uuidv4(),
        company: companyId,
        title: 'New Offer',
        description:'Description',
        scoreNeeded: '30',
        activeDuration: 30,
        offerCode: '',
        isSignupReward: false,
        isActive: false,
        dateCreated: moment(),
        lastUpdated: moment(),
        expirationDate: moment().add(30, 'days'),
        isDeleted: false,
        saved: false,
        isNew: true
    };
}

export function convertOfferForServer(clientOffer){
    return {
        'id': clientOffer.id,
        'company': clientOffer.company,
        'title': clientOffer.title,
        'description': clientOffer.description,
        'score_needed': clientOffer.scoreNeeded,
        'active_duration': clientOffer.activeDuration,
        'offer_code': clientOffer.offerCode,
        'is_signup_reward': clientOffer.isSignupReward,
        'is_active': clientOffer.isActive,
        'is_deleted': clientOffer.isDeleted,
        'date_created': clientOffer.dateCreated.utc().format(),
        'last_updated': clientOffer.lastUpdated.utc().format(),
        'expiration_date': clientOffer.expirationDate.utc().format(),
    }
}

export function convertOfferForClient(serverOffer) {

    return {
        id: serverOffer['id'],
        company: serverOffer['company'],
        title: serverOffer['title'],
        description: serverOffer['description'],
        scoreNeeded: serverOffer['score_needed'],
        activeDuration: serverOffer['active_duration'],
        offerCode: serverOffer['offer_code'],
        isSignupReward: serverOffer['is_signup_reward'],
        isActive: serverOffer['is_active'],
        isDeleted: serverOffer['is_deleted'],
        dateCreated: moment(serverOffer['date_created']),
        lastUpdated: moment(serverOffer['last_updated']),
        expirationDate: moment(serverOffer['expiration_date']),
        saved: true, // only for client side validation, this does not come from server
        isNew: false // this is coming from the server so it is already saved in the database.
    }



}