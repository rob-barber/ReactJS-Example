import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { grey, blueGrey } from 'material-ui/colors';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

const styles = theme => ({
    root: {
        position:'relative',
        top:'40%',
        transform:'translateY(-60%)'
    },
    limitText: {
        marginRight:10,
        fontSize:'0.9rem',
        color:grey['500']
    },
   submit: {
        marginTop:30,
        backgroundColor:blueGrey['500'],
        fontWeight:300,
   }
});

const titleCharacterLimit = 30;
const characterLimit = 300; // The limit as to how many characters can go into each message.

class NotificationScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messageText:'',
            titleText:'',
            dialog: {
                open:false,
                title:'',
                message:''
            }
        }
    }

    render() {

        let classes = this.props.classes;

        return (
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            <TextField
                                id="title"
                                multiline
                                margin='none'
                                fullWidth={true}
                                label="Title"
                                value={this.state.titleText}
                                onChange={this.handleTitleState.bind(this)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            <Grid container justify="flex-end">
                                <Typography className={classes.limitText}>
                                    {`${this.state.titleText.length}/${titleCharacterLimit}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            <TextField
                                id="notification"
                                multiline
                                margin='none'
                                fullWidth={true}
                                label="Message"
                                value={this.state.messageText}
                                onChange={this.handleMessageState.bind(this)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item xs={6}>
                            <Grid container justify="flex-end">
                                <Typography className={classes.limitText}>
                                    {`${this.state.messageText.length}/${characterLimit}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button
                            className={classes.submit}
                            id="submit"
                            label="Submit"
                            raised
                            color="primary"
                            onClick={this.handleSubmit.bind(this)}
                        >
                            Submit
                        </Button>
                    </Grid>
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

    handleMessageState(event) {

        let text = event.target.value;

        if (text.length <= characterLimit) {
            this.setState({
                messageText:event.target.value
            });
        }
    }

    handleTitleState(event) {

        let text = event.target.value;

        if (text.length <= titleCharacterLimit) {
            this.setState({
                titleText:event.target.value
            });
        }
    }

    handleSubmit(event) {

        let payload = {
            firebaseServerKey: this.props.firebaseServerKey,
            title: this.state.titleText,
            message: this.state.messageText
        };

        this.props.sendNotification(payload).then(
                (response)=>{this.openDialog('Success', 'Your message has been sent.')},
                (error)=>{this.openDialog('Error','There was an error sending the message. Please check internet ' +
                    'connection and try again. If the problem persists please contact Mogabi Support.')}

            ).then(()=>{
                this.setState({
                    titleText:'',
                    messageText:''
                })
        });
    }

    openDialog(title, message) {
        let newState = Object.assign({}, this.state, {
            dialog: {
                open:true,
                title:title,
                message:message
            }
        });

        this.setState(newState);
    }

    closeDialog() {
        let newState = Object.assign({}, this.state, {
            dialog: {
                open:false
            }
        });
        this.setState(newState);
    }

}

let styleComponent = withStyles(styles)(NotificationScreen);
export default connect()(styleComponent);