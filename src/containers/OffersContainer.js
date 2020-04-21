import {
    fetchOffers, createOffer, createLocalOffer,
    updateOffer, deleteOffer,
    setOfferSavedIndicator, setUnsavedDataNotice
} from 'Actions/index';
import { connect } from 'react-redux';
import OffersScreen from 'Components/OffersScreen';
import { Map } from 'immutable';

const mapStateToProps = (state) => {

    return {
        offers: state.offers.get('items').toJS(),
        shouldFetchOffers:state.offers.get('invalidated'),
        companyId:state.company.get('id'),
        gui: state.gui.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        createLocalOffer:(companyId)=>dispatch(createLocalOffer(companyId)),
        createOffer:(offer) => dispatch(createOffer(offer)),
        updateOffer:(offer) => dispatch(updateOffer(offer)),
        deleteOffer:(offer) => dispatch(deleteOffer(offer)),
        fetchOffers:(payload) => dispatch(fetchOffers(payload)),
        setOfferSavedIndicator: (payload)=>dispatch(setOfferSavedIndicator(payload)),
        setUnsavedDataParam: (hasUnsavedData)=>dispatch(setUnsavedDataNotice(hasUnsavedData))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OffersScreen)
