// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import prepare from 'app/utils/prepare';
import { fetchList } from 'app/actions/EventActions';
import EventList from './components/EventList';
import { selectSortedEvents } from 'app/reducers/events';
import moment from 'moment-timezone';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPagination } from '../../reducers/selectors';
import createQueryString from 'app/utils/createQueryString';

const mapStateToProps = (state, ownProps) => {
  const dateAfter = moment().format('YYYY-MM-DD');
  const query = { date_after: dateAfter };
  const queryString = createQueryString(query);
  const showFetchMore = selectPagination('events', { queryString });

  const user = ownProps.currentUser;
  const icalToken = user ? user.icalToken : null;
  const actionGrant = state => state.events.actionGrant;
  return {
    ...createStructuredSelector({
      showFetchMore,
      events: selectSortedEvents,
      actionGrant
    })(state, ownProps),
    icalToken
  };
};

const fetchData = (
  { refresh, loadNextPage }: { refresh?: boolean, loadNextPage?: boolean } = {}
) =>
  fetchList({
    refresh,
    loadNextPage,
    dateAfter: moment().format('YYYY-MM-DD')
  });

const mapDispatchToProps = {
  fetchMore: () => fetchData({ refresh: false, loadNextPage: true }),
  reload: () => fetchData({ refresh: true })
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchData())),
  connect(mapStateToProps, mapDispatchToProps)
)(EventList);
