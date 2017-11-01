// @flow

import React from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { Image } from 'app/components/Image';
import styles from './surveys.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  survey: SurveyEntity,
  fetching: boolean
};

const SurveyDetail = (props: Props) => {
  const { survey, fetching } = props;

  if (fetching) return <LoadingIndicator />;
  return (
    <div className={styles.surveyItem}>
      <div>
        <Link to={`/surveys/${String(survey.id)}`}>
          <h3 className={styles.surveyItemTitle}>{survey.title}</h3>
        </Link>

        <div className={styles.surveyTime}>
          Aktiv fra
          <Time time={survey.activeFrom} format="ll HH:mm" />
        </div>
      </div>

      <div className={styles.companyLogo}>
        <Image src={survey.event.thumbnail} />
      </div>
    </div>
  );
};

export default SurveyDetail;
