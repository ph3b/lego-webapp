// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { formatHeader } from './utils';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity } from '../types';

/**
 * Normal grouping by target and date
 */
export function activityHeader(aggregatedActivity: AggregatedActivity) {
  const events = aggregatedActivity.activities.reduce((acc, activity) => {
    const context = lookupContext(aggregatedActivity, activity.actor);
    return context ? acc.concat(context) : acc;
  }, []);

  if (events.length === 0) {
    return null;
  }

  return (
    <b>
      {'Du har rykket opp fra ventelisten på '}
      {formatHeader(
        events.map(event => contextRender[event.contentType](event))
      )}
    </b>
  );
}

export function activityContent() {
  return null;
}

export function icon() {
  return <Icon name="calendar" />;
}
