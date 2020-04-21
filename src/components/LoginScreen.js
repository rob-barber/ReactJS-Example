import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import { login } from 'Actions/index';

// MaterialUI components
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';


// Colors
import { blueGrey, red } from 'material-ui/colors';

// Images
let logo = require('Images/mogabi_login_logo.png');

const styles = theme => ({
    root: {
        position:'relative',
        top:'10%'
    },
    inputContainer: {
      position:'relative',
      top:10
    },
    inputField: {
        padding:5
    },
    logo: {
        display:'block',
        maxHeight:136,
        maxWidth:200,
        height:'auto',
        width:'auto'
    },
    forgotButton: {
        fontSize: '0.8rem'
    },
    submit: {
        backgroundColor:blueGrey['500'],
        fontWeight:300,
        marginTop:35
    },
    errorMessage: {
        marginTop:20,
        color:red['900']
    }
});

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password:''
        }
    }

    render() {

        let classes = this.props.classes;

        return(
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <img src={logo} className={classes.logo}/>
                    </Grid>
                    {this.props.gui.error.exists &&
                    <Grid container justify="center">
                        <Typography type="body1" className={classes.errorMessage}>
                            {this.props.gui.error.message}
                        </Typography>
                    </Grid>
                    }

                    <Grid container justify="center" className={classes.inputContainer}>
                        <Grid item xs={6} >
                            <div className={classes.inputField}>
                                <TextField
                                    id="username"
                                    label="Username"
                                    value={this.state.username}
                                    onChange={this.handleUsernameChange.bind(this)}
                                    fullWidth={true}
                                />
                            </div>
                            <div className={classes.inputField}>
                                <TextField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange.bind(this)}
                                    fullWidth={true}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button className={classes.forgotButton}>
                            Forgot Password?
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button
                            raised
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSubmit.bind(this)}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    handleUsernameChange(event) {
        let newText = event.target.value;
        let newState = Object.assign({}, this.state, {username:newText});
        this.setState(newState);
    }

    handlePasswordChange(event) {
        let newText = event.target.value;
        let newState = Object.assign({}, this.state, {password:newText});
        this.setState(newState);
    }

    handleSubmit(event) {
        let payload = {
            companyId:  this.props.companyId,
            username:   this.state.username,
            password:   this.state.password
        };

        this.props.dispatch(login(payload)).then(()=>{
            this.props.history.push('/')
        });
    }

}

LoginScreen.PropTypes = {
    dispatch:   PropTypes.func.isRequired,
    history:    PropTypes.object.isRequired,
    companyId:  PropTypes.string.isRequired,
    gui:        PropTypes.object.isRequired
};

let stylesLogin = withStyles(styles)(LoginScreen);
export default connect()(stylesLogin);