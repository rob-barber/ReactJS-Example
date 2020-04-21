import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginScreen from 'Components/LoginScreen';


const mapStateToProps = (state) => {
    return {
        gui: state.gui.toJS(),
        companyId: state.company.get('id')
    }
};

// We are just passing the dispatch function down for now.
export default withRouter(connect(mapStateToProps)(LoginScreen));