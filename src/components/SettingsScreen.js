import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

let comingSoonImage = require('Images/coming_soon.png');

let styles = theme => ({
    comingSoon: {
        maxHeight:250
    }
});

class SettingsScreen extends Component {

    render() {

        let classes = this.props.classes;

        return (
            <Grid container justify="center">
                <img src={comingSoonImage} className={classes.comingSoon}/>
            </Grid>
        );
    }
}

export default withStyles(styles)(SettingsScreen);