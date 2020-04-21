import { sendNotification } from "Actions/index";
import { connect } from 'react-redux';
import NotificationScreen from 'Components/NotificationScreen';

const mapStateToProps = (state) => {
    return {
        firebaseServerKey: state.company.get('firebaseServerKey')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendNotification:(payload)=>dispatch(sendNotification(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);