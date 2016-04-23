import { Notifications } from './ActionTypes';

export function removeNotification({ id }) {
  return {
    type: Notifications.NOTIFICATION_REMOVED,
    payload: {
      id
    }
  };
}

export function addNotification({
  message = 'Notification',
  action = 'Close',
  dismissAfter = 3000,
  ...rest
}) {
  return {
    type: Notifications.NOTIFICATION_ADDED,
    payload: {
      // Unsure how to best generate a new id here? Should it be a large random
      // number, or just an increment of the current max id?
      id: Date.now() + Math.round(Math.random() * 1000),
      message,
      action,
      dismissAfter,
      ...rest
    }
  };
}

// Helper function to reduce copy-paste
export function catchErrorAsNotification(dispatch, actionString = 'Action') {
  if (!dispatch) {
    throw new Error('Cannot call catchErrorAsNotification without dispatch');
  }
  return (action) => {
    dispatch(addNotification({
      message: `${actionString} failed: ${action.error}`
    }));
    console.error(`${actionString} failed`, action);
  };
}
