// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/InterestGroupActions';
import InterestGroupPage from './components/InterestGroupPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectInterestGroups } from 'app/reducers/interestGroups';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  const interestGroups = selectInterestGroups(state);
  return {
    interestGroups
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(InterestGroupPage);
