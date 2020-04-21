import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { APP_ROUTES } from "Constants";

import { Link } from 'react-router-dom';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

import DashboardIcon from 'material-ui-icons/Explore';
import SettingsIcon from 'material-ui-icons/Settings';

let offerIcon = require('Images/offers_icon.png');
let notificationIcon = require('Images/notification_icon.png');
let accountIcon = require('Images/account_icon.png');
let supportIcon = require('Images/support_icon.png');

const iconColor = '#455A64';

const styles = theme => ({
    root:{
        paddingTop:0
    },
    links:{
        textDecoration:'none'
    },
    iconAvatar: {
        backgroundColor:iconColor
    }
});

class DrawerList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn:true
        };
    }



    render() {

        let classes = this.props.classes;

        let authorizedButtons = () => {

            if (this.props.loggedIn) {
                return (
                    <div>
                        <Link to={APP_ROUTES.dashboard} className={classes.links}>
                            <ListItem button >
                                <Avatar className={classes.iconAvatar}>
                                    <DashboardIcon/>
                                </Avatar>
                                <ListItemText primary="Dashboard"/>
                            </ListItem>
                        </Link>

                        <Divider/>

                        <Link to={APP_ROUTES.offers} className={classes.links}>
                            <ListItem button>
                                <Avatar src={offerIcon}/>
                                <ListItemText primary="Offers"/>
                            </ListItem>
                        </Link>

                        <Divider/>

                        <Link to={APP_ROUTES.notifications} className={classes.links}>
                            <ListItem button>
                                <Avatar src={notificationIcon}/>
                                <ListItemText primary="Push Notifications"/>
                            </ListItem>
                        </Link>

                        <Divider/>

                        <Link to={APP_ROUTES.account} className={classes.links}>
                            <ListItem button>
                                <Avatar src={accountIcon}/>
                                <ListItemText primary="Account"/>
                            </ListItem>
                        </Link>

                        <Divider/>

                        <Link to={APP_ROUTES.settings} className={classes.links}>
                            <ListItem button >
                                <Avatar className={classes.iconAvatar}>
                                    <SettingsIcon/>
                                </Avatar>
                                <ListItemText primary="Dashboard"/>
                            </ListItem>
                        </Link>

                        <Divider/>
                    </div>
                );
            }
        };

        return (
            <List className={classes.root}>
                <Divider/>

                {authorizedButtons()}

                <ListItem button onClick={this.handleSupportClick.bind(this)}>
                    <Avatar src={supportIcon}/>
                    <ListItemText primary="Mogabi Support"/>
                </ListItem>
            </List>
        );
    }

    handleSupportClick(event) {
        event.preventDefault();
        window.location.href = 'mailto:support@mogabi.co';
    }

}

DrawerList.propTypes = {
    loggedIn: PropTypes.bool.isRequired
};

export default withStyles(styles)(DrawerList);