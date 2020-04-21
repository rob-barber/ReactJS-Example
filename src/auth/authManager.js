import moment from 'moment';

const fiveMinutes = 300; // In Seconds

export function isAuthenticated() {
    return tokenExists() && !isTokenExpired()
}

export function getToken() {
    if (tokenExists()) {
        let parsed = JSON.parse(localStorage.token);
        parsed.expires = moment(parsed.expires); // Convert the expired date back into a moment.js object
        return parsed;
    } else {
        return null;
    }
}

export function saveToken(token) {
    localStorage.token = JSON.stringify({
        accessToken:token['access_token'],

        // We will expire the token 5 minutes early to prevent gaps in authentication
        expires:moment().add(token['expires_in'], 'seconds').subtract(fiveMinutes, 'seconds'),
        scope:token['scope'],
        tokenType:token['token_type']
    });
}

export function deleteToken() {
    localStorage.token = null;
}

function isTokenExpired() {
    if (tokenExists()) {
        let expirationMoment = getToken().expires;
        return moment().isAfter(expirationMoment);
    } else {
        return true;
    }
}

function tokenExists() {
    let token = localStorage['token'];
    let canParse = false;

    try {
        let parsed = JSON.parse(token);
        canParse = parsed !== null;
    } catch (error){
        //token does not exist
    }

    return token !== undefined
        && token !== null
        && canParse;
}