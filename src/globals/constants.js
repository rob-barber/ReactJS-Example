export const APP_ROUTES = {
    dashboard:'/',
    offers:'/offers',
    notifications:'/notifications',
    account:'/account',
    settings:'/settings'
};

const serverBaseUrl = 'http://127.0.0.1:8000/';

export const API_URLS = {
    getOffers: serverBaseUrl + 'offers/get_company_offers/',
    adminLogin: serverBaseUrl + 'admin_login/',
    updateOffer: serverBaseUrl + 'offers/',
    createOffer: serverBaseUrl + 'offers/',
    deleteOffer: serverBaseUrl + 'offers/'
};

export const FIREBASE_URL = 'https://fcm.googleapis.com/fcm/send';