import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/JoblistingActions';
import JoblistingPage from './components/JoblistingPage';
import { compose } from 'redux';
import moment from 'moment-timezone';

function filterJoblistings(joblistings, classes, jobTypes, workplaces) {
  return joblistings.filter(joblisting => {
    let classBoolean = false;
    let jobTypesBoolean = false;
    let workplacesBoolean = false;
    if (classes.length === 0) {
      classBoolean = true;
    } else {
      classBoolean = classes.find(
        c => joblisting.fromYear <= Number(c) && joblisting.toYear >= Number(c)
      );
    }
    if (jobTypes.length === 0) {
      jobTypesBoolean = true;
    } else {
      jobTypesBoolean = jobTypes.find(j => j === joblisting.jobType);
    }
    if (workplaces.length === 0) {
      workplacesBoolean = true;
    } else {
      workplacesBoolean =
        joblisting.workplaces.some(w => workplaces.includes(w.town)) ||
        (workplaces.includes('Annet') &&
          joblisting.workplaces.some(
            w => !['Oslo', 'Trondheim', 'Bergen', 'Tromsø'].includes(w.town)
          ));
    }
    return classBoolean && jobTypesBoolean && workplacesBoolean;
  });
}

const dateSort = (a, b) => {
  const date1 = moment(a.deadline);
  const date2 = moment(b.deadline);
  return date1.isAfter(date2);
};

const companySort = (a, b) => a.company.name.localeCompare(b.company.name);

const sortJoblistings = (joblistings, sortType) => {
  return joblistings.sort(sortType === 'company' ? companySort : dateSort);
};

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const joblistings = state.joblistings.items.map(
    id => state.joblistings.byId[id]
  );
  const sortType = query.order === 'company' ? 'company' : 'deadline';
  const filterClass = query.classNumber ? query.classNumber.split(',') : [];
  const filterJobType = query.jobTypes ? query.jobTypes.split(',') : [];
  const filterWorkplaces = query.workplaces ? query.workplaces.split(',') : [];

  const filteredJoblistings = filterJoblistings(
    joblistings,
    filterClass,
    filterJobType,
    filterWorkplaces
  );
  const sortedJoblistings = sortJoblistings(filteredJoblistings, sortType);
  const actionGrant = state.joblistings.actionGrant || [];

  return {
    joblistings: sortedJoblistings,
    query,
    actionGrant
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingPage);
