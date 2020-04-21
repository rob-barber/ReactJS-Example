import React, { Component } from 'react';
import { connect } from 'react-redux';
import MiniDrawer from 'Components/MiniDrawer';
import { Map } from 'immutable';


const mapStateToProps = (state, ownProps) => {

    let returnObject = {
        gui: state.gui.toJS(),
        ...ownProps
    };

    return returnObject;
};



// This will pass the dispatch function to the props of the drawer
export default connect(mapStateToProps)(MiniDrawer);