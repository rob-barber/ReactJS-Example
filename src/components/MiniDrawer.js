import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from 'Actions/index';
import classNames from 'classnames';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import { CircularProgress } from 'material-ui/Progress';

import DrawerList from 'Components/DrawerList';

import { withStyles } from 'material-ui/styles';

import { indigo, blue } from 'material-ui/colors';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        width: '100%',
        height: '100vh',
        // marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        backgroundColor: indigo['900'],
        zIndex: theme.zIndex.navDrawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        height: '100vh',
        overflow:'hidden',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        width: 70,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerInner: {
        // Make the items inside not wrap when transitioning:
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        height: 56,
        [theme.breakpoints.up('sm')]: {
            height: 64,
        },
    },
    content: {
        position:'relative',
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 24,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
    logoutButton: {
        position:'absolute',
        right:16
    },
    progressIndicator: {
        color: blue['200'],
        marginLeft: 20
    }

});

/* NOTE: Most of this class was taken from the "Mini Variant Drawer" example on the Material UI
*        guide site https://material-ui-1dab0.firebaseapp.com/demos/drawers/
* */
class MiniDrawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {

        let classes = this.props.classes;

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
                        <Toolbar disableGutters={!this.state.open}>
                            <IconButton
                                color="contrast"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, this.state.open && classes.hide)}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography type="title" color="inherit" noWrap style={{fontWeight:400}}>
                                {this.props.pageTitle}
                            </Typography>

                            {/* Show a spinner in the title bar if there is network activity */}
                            {this.props.gui.isFetching
                            && <CircularProgress className={classes.progressIndicator}/>}

                            {this.props.isLoggedIn
                            &&
                            <Button
                                color="contrast"
                                className={classes.logoutButton}
                                onClick={this.handleLogout.bind(this)}
                            >
                                Logout
                            </Button>
                            }
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        type="permanent"
                        classes={{
                            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                        }}
                        open={this.state.open}
                    >
                        <div className={classes.drawerInner}>
                            <div className={classes.drawerHeader}>
                                <IconButton onClick={this.handleDrawerClose}>
                                    <ChevronLeftIcon />
                                </IconButton>
                            </div>

                            {/* Drawer List goes here */}
                            <DrawerList loggedIn={this.props.isLoggedIn}/>

                        </div>
                    </Drawer>
                    <main className={classes.content}>

                        {/* Main Portal content here */}

                        {this.props.children}
                    </main>
                </div>
            </div>
        );

    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    handleLogout = () => {
        this.props.dispatch(logout());
    };

}

MiniDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
    isLoggedIn:PropTypes.bool.isRequired,
};

export default withRouter(withStyles(styles)(MiniDrawer));