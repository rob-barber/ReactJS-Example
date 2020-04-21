import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import DashboardScreen from 'Components/DashboardScreen';
import AccountScreen from 'Components/AccountScreen';
import SettingsScreen from 'Components/SettingsScreen';

import DrawerContainer from 'Containers/DrawerContainer';
import LoginScreenContainer from 'Containers/LoginScreenContainer';
import NotificationContainer from 'Containers/NotificationContainer';
import OffersContainer from 'Containers/OffersContainer';

import { withStyles } from 'material-ui/styles';
import { blue, grey } from 'material-ui/colors';

const styles = {
    routeContainerDiv: {
        position:'relative',
        height:'100%'
    }

};

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let classes = this.props.classes;

        /**
         * This will take the pathname and use that for the title. Make sure to name
         * your routes something we can use in the title.
         */
        let getPageTitle = () => {

            let pathname = this.props.location.pathname;

            if (pathname === '/') {
                return 'Dashboard'
            }

            // convert path to using upper case for the first character
            let sub = pathname.substring(1);
            let firstChar = sub.charAt(0).toUpperCase();
            return firstChar + sub.substring(1);

        };

        let isOnLoginScreen = () => {
            let path = this.props.location.pathname;
            return path === '/login'
        };

        // Returns routes based on logged in state. It will re-direct to the login screen if not logged in.
        let authRoutes = () => {
            let loggedIn = this.props.isLoggedIn;

            if (loggedIn && !isOnLoginScreen()) {
                return (
                    <div className={classes.routeContainerDiv}>
                        <Route exact path="/" component={DashboardScreen}/>
                        <Route path="/offers" component={OffersContainer}/>
                        <Route path="/notifications" component={NotificationContainer}/>
                        <Route path="/account" component={AccountScreen}/>
                        <Route path="/settings" component={SettingsScreen}/>
                    </div>
                );

            } else if (loggedIn && isOnLoginScreen()) {
                return (
                    // We should not be able to navigate to login screen if we're already logged in.
                    <Redirect to={{pathname:'/'}}/>
                );

            } else if (!loggedIn && !isOnLoginScreen()) {
                return (
                    <Redirect to={{pathname:'/login'}} />
                );
            }
        };

        return (
            <div>
                <DrawerContainer
                    pageTitle={getPageTitle()}
                    isLoggedIn={this.props.isLoggedIn}
                >
                    {/* Dashboard route goes here: */}

                    {authRoutes()}

                    {/* Only */}
                    {!this.props.isLoggedIn && <Route path="/login" component={LoginScreenContainer}/>}
                </DrawerContainer>
            </div>
        );
    }

}

App.PropTypes = {
    pageTitle: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired
};

export default withStyles(styles)(App);

