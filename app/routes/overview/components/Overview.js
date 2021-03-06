// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Container, Flex } from 'app/components/Layout';
import LatestReadme from './LatestReadme';
import Feed from './Feed';
import CompactEvents from './CompactEvents';
import { EVENT_TYPE_TO_STRING, colorForEvent } from 'app/routes/events/utils';
import Button from 'app/components/Button';
import type { Event, Article } from 'app/models';

const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 140;
const IMAGE_HEIGHT = 192;

const itemUrl = item => `/${item.eventType ? 'events' : 'articles'}/${item.id}`;

function PrimaryItem({ item }: { item?: Event | Article }) {
  if (!item) {
    return (
      <Flex column className={styles.primaryItem}>
        <h2 className="u-ui-heading">Festet oppslag</h2>
        <Flex column className={styles.innerPrimaryItem}>
          <Image
            style={{ height: IMAGE_HEIGHT, display: 'block' }}
            className={styles.image}
            src={'https://i.redd.it/dz8mwvl4dgdy.jpg'}
          />
          <div className={styles.pinnedHeading}>
            <h2 className={styles.itemTitle}>Ingen oppslag</h2>
          </div>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex column className={styles.primaryItem}>
      <h2 className="u-ui-heading">Festet oppslag</h2>
      <Flex column className={styles.innerPrimaryItem}>
        <Link
          to={itemUrl(item)}
          style={{ height: IMAGE_HEIGHT, display: 'block' }}
        >
          <Image className={styles.image} src={item.cover} />
        </Link>
        <div className={styles.pinnedHeading}>
          <h2 className={styles.itemTitle}>
            <Link to={itemUrl(item)}>{item.title}</Link>
          </h2>

          <span className={styles.itemInfo}>
            {item.startTime && (
              <Time time={item.startTime} format="DD.MM HH:mm" />
            )}
            {item.location !== '-' && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{item.location}</span>
              </span>
            )}
            {item.eventType && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{EVENT_TYPE_TO_STRING(item.eventType)}</span>
              </span>
            )}
          </span>
        </div>
      </Flex>
    </Flex>
  );
}

const OverviewItem = ({ item }: { item: Event | Article }) => {
  return (
    <Flex column className={styles.item}>
      <Flex className={styles.inner}>
        {item.cover && (
          <Flex column>
            <Link to={itemUrl(item)} className={styles.imageContainer}>
              <Image className={styles.image} src={item.cover} />
            </Link>
          </Flex>
        )}
        <Flex column className={styles.innerRight}>
          <div className={styles.heading}>
            <h2 className={styles.itemTitle}>
              <Link to={itemUrl(item)}>
                {truncateString(item.title, TITLE_MAX_LENGTH)}
              </Link>
            </h2>

            <span className={styles.itemInfo}>
              {item.startTime && (
                <Time time={item.startTime} format="DD.MM HH:mm" />
              )}
              {item.location !== '-' && (
                <span>
                  <span className={styles.dot}> · </span>
                  <span>{item.location}</span>
                </span>
              )}
              {item.eventType && (
                <span>
                  <span className={styles.dot}> · </span>
                  <span>{EVENT_TYPE_TO_STRING(item.eventType)}</span>
                </span>
              )}
            </span>
          </div>

          <p
            className={styles.itemDescription}
            style={{
              borderTop: `3px solid ${colorForEvent(item.eventType)}`
            }}
          >
            {truncateString(item.description, DESCRIPTION_MAX_LENGTH)}
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};

type Props = {
  frontpage: Array<Object>,
  feed: Object,
  feedItems: Array<Object>
};

type State = {
  eventsToShow: number
};

export default class Overview extends Component<Props, State> {
  state = {
    eventsToShow: 4
  };

  increaseEventsToShow = () => {
    this.setState({ eventsToShow: this.state.eventsToShow * 2 });
  };

  render() {
    const isEvent = o => typeof o['startTime'] !== 'undefined';
    const { frontpage, feed, feedItems } = this.props;

    return (
      <Container>
        <Helmet title="Hjem" />
        <Flex wrap style={{ justifyContent: 'space-between' }}>
          <Flex column style={{ flex: 2 }}>
            <CompactEvents events={frontpage.filter(isEvent)} />
            <PrimaryItem item={frontpage[0]} />
          </Flex>
          <Feed style={{ flex: 2 }} feed={feed} feedItems={feedItems} />
        </Flex>
        <Flex />
        <Flex padding={10}>
          <LatestReadme expanded={frontpage.length === 0} />
        </Flex>
        <Flex wrap>
          {frontpage
            .slice(1, this.state.eventsToShow)
            .map(event => (
              <OverviewItem
                key={event.id}
                item={event}
                increaseEventsToShow={this.increaseEventsToShow}
              />
            ))}
          {frontpage.length > 0 && (
            <Button
              style={{ width: '100%', margin: '10px' }}
              onClick={this.increaseEventsToShow}
            >
              Vis flere
            </Button>
          )}
        </Flex>
      </Container>
    );
  }
}
