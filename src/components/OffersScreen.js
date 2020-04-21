import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import ReactTooltip from 'react-tooltip';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText, ListItemSecondaryAction, ListItemAvatar } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import AddIcon from 'material-ui-icons/PlaylistAdd';
import EditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import HelpIcon from 'material-ui-icons/HelpOutline';
import WarningIcon from 'material-ui-icons/ErrorOutline';

import { withStyles } from 'material-ui/styles';
import { blue, green, yellow } from 'material-ui/colors';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const styles = theme => ({
    root: {
        height: 500
    },
    listGrid:{
        height:'100%',
        paddingBottom:0
    },
    detailGrid:{
        height: '100%',
        overflow:'hidden'
    },
    paper: {
        height:'100%'
    },
    listContainer: {
        height:424,
        overflowX:'hidden',
        overflowY:'scroll',
        marginTop:8,
        borderBottomLeftRadius:2,
        borderBottomRightRadius:2
    },
    addIcon: {
        margin:'10px 16px 10px 10px'
    },
    list: {
        backgroundColor:blue['50']
    },
    listItem: {
        borderBottom:'1px solid lightgrey'
    },
    listItemText: {
        color:'white'
    },
    listItemWarning:{
        color:yellow['900'],
        marginRight:10
    },
    dateRewardDurationWrapper:{
        marginTop:15
    },
    datePicker:{
        zIndex:2,
        border:'none',
        borderBottom:'1px solid rgba(0,0,0,0.54)',
        fontFamily:'Roboto, Helvetica',
        fontSize:'0.8rem',
        color:'rgba(0, 0, 0, 0.54)'
    },
    expirationTextGrid:{
        paddingBottom:'0px !important',
        paddingTop:'5px !important'
    },
    expirationText: {
        color:'rgba(0, 0, 0, 0.54)',
        fontSize:'0.75rem'
    },
    datePickerGrid: {
        paddingTop:'6px !important'
    },
    bottomLevel:{
        zIndex:0
    },
    bar:{
    },
    switches: {
        color:green['500'],
        '& + $bar': {
            backgroundColor: green[500],
        },
    },
    submitWrapper: {
        marginTop:50
    },
    tooltip:{
        position:'relative',
        height:15,
        width:15,
        color:'rgba(0, 0, 0, 0.54)'
    },
    reactTooltip: {
        fontFamily:'Roboto, Helvetica'
    }

});

const blankState = {
        id: '',
        titleText: '',
        description: '',
        offerCode: '',
        scoreNeeded:'',
        isActive: true,
        isSignupReward: false,
        expirationDate: moment(),
        rewardActiveDuration: 30
};

const defaultErrorMessage = 'Check internet connection, ' +
            'refresh the page and try again. If the problem persists contact Mogabi Support.';

class OffersScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {

            currentOffer: Object.assign({}, blankState),
            cachedOfferData: {

            }, // used to store recent changes to the offers
            dialog:{
                open: false,
                title:'',
                message:''
            }
        };
    }

    componentDidMount() {
        if (this.props.shouldFetchOffers) {
            this.props.fetchOffers(this.props.companyId)
                .then(
                    ()=>{}, // Do nothing upon success since we need no confirmation that offers were loaded.
                    (error)=>{
                        // Show error dialog
                        this.openDialog('Error', 'There was an error loading the offers. ' + defaultErrorMessage)
                    }
                );
        }
    }

    render() {

        let classes = this.props.classes;
        let currentOffer = this.state.currentOffer;

        let offerList = (classes) => {

            let offerObject = this.props.offers;
            let offers = Object.values(offerObject);


            let newList = offers.map((offer, index) => {

                let showWarning = !offer.saved;

                return (
                    <ListItem
                        key={index}
                        id={offer.id}
                        button
                        className={classes.listItem}
                        onClick={this.handleListItemClick(offer.id).bind(this)}
                    >
                        <ListItemText primary={offer.title} className="hardFontColor"/>

                        <ListItemSecondaryAction>

                            { showWarning &&
                                <IconButton>
                                    <WarningIcon
                                        className={classes.listItemWarning}
                                        data-tip
                                        data-for="warning"
                                    />
                                    <ReactTooltip id="warning" effect="solid">
                                        <p>
                                            WARNING: this offer has not been saved yet. Changes may not persist.
                                        </p>
                                    </ReactTooltip>
                                </IconButton>

                            }

                            <IconButton onClick={this.handleDeleteOffer(offer.id).bind(this)}>
                                <Avatar>
                                    <DeleteIcon data-tip="Delete Offer"/>
                                </Avatar>
                            </IconButton>

                            <ReactTooltip className={classes.reactTooltip} effect="solid"/>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            });

            return (
                <List className={classes.list} disablePadding={true}>
                    {newList}
                </List>
            );
        };

        return (
            <Grid container justify="center" className={classes.root}>
                <Grid item xs={5}>
                    <Paper className={classes.paper}>
                        <Grid container justify="flex-end" align="center">
                            <Typography type="subheading">Add Offer</Typography>
                            <Avatar className={classes.addIcon}>
                                <IconButton onClick={this.handleCreateOffer.bind(this)}>
                                    <AddIcon/>
                                </IconButton>
                            </Avatar>
                        </Grid>
                        <div className={classes.listContainer}>
                            <Grid container className={classes.listGrid}>
                                <Grid item xs={12}>
                                    {offerList(classes)}
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={7} className={classes.detailGrid} >
                    <Paper className={classes.paper}>
                        <Grid container justify="center" >
                            <Grid item xs={9}>
                                <TextField
                                    id="title"
                                    label="Title * "
                                    multiline
                                    fullWidth={true}
                                    value={this.state.currentOffer.titleText}
                                    onChange={this.handleTitleTextChange.bind(this)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <HelpIcon
                                    data-tip="This will be what is first seen in the app."
                                    className={classes.tooltip}
                                    style={{right:20, top:10}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={9}>
                                <TextField
                                    id="description"
                                    label="Description *"
                                    multiline
                                    fullWidth={true}
                                    value={this.state.currentOffer.description}
                                    onChange={this.handleDescriptionTextChange.bind(this)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <HelpIcon
                                    data-tip="A short description of the offer. Can include short terms of use."
                                    className={classes.tooltip}
                                    style={{right:20, top:10}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={10}>
                                <Grid container justify="center">
                                    <Grid item xs={5}>
                                        <TextField
                                            id="code"
                                            label="Offer Code"
                                            fullWidth={true}
                                            value={this.state.currentOffer.offerCode}
                                            onChange={this.handleOfferCodeTextChange.bind(this)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <HelpIcon
                                            data-tip="Code cashiers will use to apply offer to transaction."
                                            className={classes.tooltip}
                                            style={{right:20, top:10}}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            id="score"
                                            label="Score Needed *"
                                            fullWidth={true}
                                            value={this.state.currentOffer.scoreNeeded}
                                            onChange={this.handleScoreNeededChange.bind(this)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <HelpIcon
                                            data-tip="The score users need to obtain to win this offer."
                                            className={classes.tooltip}
                                            style={{right:20, top:10}}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify="center" className={classes.dateRewardDurationWrapper}>
                            <Grid item xs={5}>
                                <Grid container justify="flex-start" >
                                    <Grid item xs={12} className={classes.expirationTextGrid}>
                                        <Typography type="body1" className={classes.expirationText}>
                                            Expiration Date
                                            <HelpIcon
                                                style={{left:3}}
                                                data-tip="The date when users will stop seeing the offer in the app."
                                                className={classes.tooltip}
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} className={classes.datePickerGrid}>
                                        {/* NOTE: There are hard override css styles for this element */}
                                        <DatePicker
                                            className={classes.datePicker}
                                            showMonthDropdown
                                            showYearDropdown
                                            openToDate={moment()}
                                            selected={this.state.currentOffer.expirationDate}
                                            onChange={this.handleExpirationDateChange.bind(this)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify="center">
                                    <Grid item xs={10}>
                                        <TextField

                                            id="rewardActiveDuration"
                                            label="Reward Duration *"
                                            type="number"
                                            fullWidth={true}
                                            value={this.state.currentOffer.rewardActiveDuration}
                                            onChange={this.handleRewardActiveDuration.bind(this)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <HelpIcon
                                            data-tip="How many days users have to use this offer after winning it."
                                            className={classes.tooltip}
                                            style={{right:40}}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} style={{marginTop:20}}>
                                <Grid container justify="center">
                                    <Grid item xs={6}>
                                        <Grid container justify="center">

                                            <FormControlLabel
                                                className={classes.bottomLevel}
                                                control={
                                                    <Switch
                                                        classes={{
                                                            checked: classes.switches,
                                                            bar:classes.bar
                                                        }}
                                                        checked={this.state.currentOffer.isActive}
                                                        onChange={this.handleIsActiveToggle.bind(this)}
                                                    />
                                                }
                                                label="Offer is active"
                                            />
                                            <HelpIcon
                                                data-tip="Allows users to see and win this offer."
                                                style={{right:10}}
                                                className={classes.tooltip}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container justify="center">
                                          <FormControlLabel
                                                className={classes.bottomLevel}
                                                control={
                                                    <Switch
                                                        classes={{
                                                            checked: classes.switches,
                                                            bar:classes.bar
                                                        }}
                                                        checked={this.state.currentOffer.isSignupReward}
                                                        onChange={this.handleIsSignupRewardToggle.bind(this)}
                                                    />
                                                }
                                                label="Signup Reward"
                                            />
                                            <HelpIcon
                                                data-tip
                                                data-for="signup"
                                                style={{right:10}}
                                                className={classes.tooltip}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify="center" className={classes.submitWrapper}>
                            <Button
                                color="primary"
                                raised={true}
                                onClick={this.handleSave(currentOffer.id).bind(this)}
                            >
                                Save
                            </Button>
                        </Grid>

                        {/* Needed for tooltips to work check out github's react-tooltip repo */}
                        <ReactTooltip className={classes.reactTooltip} effect="solid"/>
                        <ReactTooltip className={classes.reactTooltip} id="signup" effect="solid">
                            <p>
                                When new users sign up for your app they will be given this
                                offer automatically as a reward.
                            </p>
                            <p>
                                NOTE: This offer will not be seen by
                                users who are already signed up with the app.
                            </p>
                        </ReactTooltip>
                    </Paper>
                </Grid>

                <Dialog open={this.state.dialog.open} onRequestClose={this.closeDialog.bind(this)}>
                    <DialogTitle>{this.state.dialog.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.dialog.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog.bind(this)} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }

    //region List Data Handlers
    handleListItemClick(offerId) {
        // We need to return a function so we can bind to it in the "onClick" declaration as well as pass
        // in a parameter.
        return () => {
            let offer = this.props.offers[offerId];

            let newComponentState = Object.assign({}, this.state, {
                currentOffer: {
                    id: offer.id,
                    titleText: offer.title,
                    description: offer.description,
                    offerCode: offer.offerCode,
                    scoreNeeded: offer.scoreNeeded,
                    isActive: offer.isActive,
                    isSignupReward: offer.isSignupReward,
                    expirationDate: offer.expirationDate,
                    rewardActiveDuration: offer.activeDuration
                }
            });

            this.setState(newComponentState);
        };
    }

    handleCreateOffer() {
        this.props.createLocalOffer(this.props.companyId);
    }

    handleDeleteOffer(offerId) {

        return () => {
            let offers = this.props.offers;

            // Make sure that the offer actually exists.
            if (offerId in offers) {

                this.props.deleteOffer(offers[offerId])
                    .then(
                        ()=> {
                            // If the deleted offer is being viewed then we will clear the detail section of the page.
                            if (offerId === this.state.currentOffer.id) {
                                let newState = Object.assign({}, this.state, {
                                    currentOffer: blankState
                                });

                                this.setState(newState);
                            }
                        },

                        (error) => {

                            this.openDialog('Error', 'There was an error deleting the offer. ' + defaultErrorMessage)

                        }
                    );
            }
        };

    }
    //endregion

    //region Detail Data Handlers
    handleTitleTextChange(event) {
        let newState = this.state;
        newState.currentOffer.titleText = event.target.value;

        this.setState(newState);

        this.setOfferSavedProperty(this.state.currentOffer.id, false);



    }

    handleDescriptionTextChange(event) {
        let newState = this.state;
        newState.currentOffer.description = event.target.value;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    handleOfferCodeTextChange(event) {
        let newState = this.state;
        newState.currentOffer.offerCode = event.target.value;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    handleScoreNeededChange(event) {
        let newState = this.state;
        newState.currentOffer.scoreNeeded = event.target.value;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    handleExpirationDateChange(date) {
        let newState = this.state;
        newState.currentOffer.expirationDate = date;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    handleRewardActiveDuration(event) {
        let newState = this.state;
        newState.currentOffer.rewardActiveDuration = event.target.value;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    handleIsActiveToggle(event) {
        let newState = this.state;
        newState.currentOffer.isActive = !newState.currentOffer.isActive;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    handleIsSignupRewardToggle(event) {

        let newState = this.state;
        newState.currentOffer.isSignupReward = !newState.currentOffer.isSignupReward;

        this.setState(newState);
        this.setOfferSavedProperty(this.state.currentOffer.id, false);
    }

    /**
     * Takes the local component state and merges it with the Redux offer matching the ID
     * passed in. It will then send a network request to update the offer on the database.
     *
     * NOTE: No Redux state is updated until a success response from the server. This does not
     * mutate the Redux state; that is handled automatically by the Redux-Thunk Actions.
     * @param offerId
     * @returns {function()} A function that the onClick assignment can bind to.
     */
    handleSave(offerId) {

        return () => {
            if (offerId !== '') {
                let localState = this.state.currentOffer;
                let offer = this.props.offers[offerId];

                let updatedOffer = Object.assign({}, offer, {
                    title: localState.titleText,
                    description: localState.description,
                    offerCode: localState.offerCode,
                    scoreNeeded: localState.scoreNeeded,
                    isActive: localState.isActive,
                    isSignupReward: localState.isSignupReward,
                    expirationDate: localState.expirationDate,
                    activeDuration: localState.rewardActiveDuration
                });

                if (offer.isNew) {
                    // This is a new offer that we will be sending to the server to be created.
                    this.props.createOffer(updatedOffer).then(
                        ()=>{
                            this.setOfferSavedProperty(offerId, true);
                            this.openDialog('Success', 'Offer has been saved.');
                        },
                        (error) => {
                            this.openDialog('Error', 'There was an error saving the offer. ' + defaultErrorMessage);
                        }
                    );
                } else {
                    // This is an existing offer that needs to be updated.
                    this.props.updateOffer(updatedOffer).then(
                        ()=>{
                            this.setOfferSavedProperty(offerId, true);
                            this.openDialog('Success', 'Offer has been saved.');
                        },
                        (error) => {
                            this.openDialog('Error', 'There was an error saving the offer. ' + defaultErrorMessage);
                        }
                    );
                }


            }
        };
    }
    //endregion

    //region Dialog Handlers
    openDialog(title, message) {
        let newState = Object.assign({}, this.state, {
            dialog:{
                open:true,
                title:title,
                message:message
            }
        });

        this.setState(newState);
    }

    closeDialog() {
        let newState = Object.assign({}, this.state, {
            dialog:{
                open:false,
                title:'',
                message:''
            }
        });

        this.setState(newState);

    }
    //endregion

    setOfferSavedProperty(offerId, isSaved) {

        let offer = this.props.offers[offerId];

        if (offer.saved !== isSaved) {
            let payload = {
                offerId: offerId,
                isSaved: isSaved
            };

            this.props.setOfferSavedIndicator(payload);
            this.props.setUnsavedDataParam(!isSaved); // is there data that is unsaved? True if we have not saved data.
        }
    }

}

OffersScreen.propTypes = {
    gui:    PropTypes.shape({
        pageTitle:  PropTypes.string,
        isFetching: PropTypes.bool,
        unsavedData: PropTypes.bool,
        error:      PropTypes.shape({
            exists:     PropTypes.bool,
            statusCode: PropTypes.number,
            message:    PropTypes.string
        })
    }),
    offers: PropTypes.object.isRequired,
    shouldFetchOffers: PropTypes.bool.isRequired,
    companyId: PropTypes.string.isRequired
};

export default withStyles(styles)(OffersScreen);
