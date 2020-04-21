import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppContainer from 'Containers/AppContainer';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from 'Reducers/index';
import 'Styles/index.scss';


let store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(ReduxThunk))
);

class Root extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Router>
                {/* We need the pathless route so the auth functionality within the "App" component
                 recognizes url path changes. This will force an update when/if redirecting to the login
                 screen. You can test this by removing the Route component and just use an "AppContainer"
                 while you aren't logged in. Then enter the base url in the browser. The url will successfully
                 redirect to "/login" but no components will be rendered in the content area.

                 Read more about this issue here:
                 https://reacttraining.com/react-router/core/guides/dealing-with-update-blocking*/}
                <Route component={AppContainer}/>
            </Router>
        );
    }

}


ReactDOM.render(
    <Provider store={store}>
        <Root/>
    </Provider>,
    document.getElementById('root')
);