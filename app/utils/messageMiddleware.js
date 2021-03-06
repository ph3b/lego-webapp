import { get } from 'lodash';
import Raven from 'raven-js';

const reportToSentry = action =>
  __CLIENT__ && Raven.captureException(action.payload);

export default function createMessageMiddleware(actionToDispatch) {
  return store => next => action => {
    const success = action.success && get(action, ['meta', 'successMessage']);
    const error = action.error && get(action, ['meta', 'errorMessage']);
    if (!(success || error)) {
      return next(action);
    }
    let message;

    if (error) {
      message = typeof error === 'function' ? error(action.error) : error;
      reportToSentry(action);
    } else {
      message = success;
    }
    store.dispatch(actionToDispatch(message));
    return next(action);
  };
}
