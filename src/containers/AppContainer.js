import { connect } from 'react-redux';
import App from 'Components/App';



const mapStateToProps = state => {
    return {
        isLoggedIn: state.auth.get('isLoggedIn'),
        pageTitle: state.gui.get('pageTitle')

    }
};

export default connect(mapStateToProps)(App);