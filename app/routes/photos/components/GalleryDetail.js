// @flow

import React, { Component, cloneElement, type Node } from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import EmptyState from 'app/components/EmptyState';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { Content } from 'app/components/Layout';
import Gallery from 'app/components/Gallery';
import type { DropFile } from 'app/components/Upload';
import type { Photo, ID } from 'app/models';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

type Props = {
  gallery: Object,
  loggedIn: boolean,
  currentUser: boolean,
  pictures: Array<Photo>,
  hasMore: boolean,
  fetching: boolean,
  children: Node<*>,
  fetch: () => Promise<*>,
  push: string => Promise<*>,
  uploadAndCreateGalleryPicture: (ID, File | Array<DropFile>) => Promise<*>
};

type State = {
  upload: boolean
};

export default class GalleryDetail extends Component<Props, State> {
  props: Props;

  state: State = {
    upload: false
  };

  toggleUpload = (response?: File | Array<DropFile>) => {
    if (response) {
      this.props.uploadAndCreateGalleryPicture(this.props.gallery.id, response);
    }

    this.setState({ upload: !this.state.upload });
  };

  handleClick = (picture: Object) => {
    this.props.push(`/photos/${this.props.gallery.id}/picture/${picture.id}`);
  };

  render() {
    const {
      gallery,
      pictures,
      children,
      push,
      loggedIn,
      currentUser,
      hasMore,
      fetch,
      fetching
    } = this.props;

    return (
      <Content>
        <NavigationTab
          back={{
            label: 'Tilbake til gallerier',
            path: '/photos'
          }}
          title={gallery.title}
          details={<GalleryDetailsRow gallery={gallery} showDescription />}
        >
          <NavigationLink onClick={() => this.toggleUpload()}>
            Last opp bilder
          </NavigationLink>
          <NavigationLink to={`/photos/${gallery.id}/edit`}>
            Rediger
          </NavigationLink>
        </NavigationTab>
        <Gallery
          photos={pictures}
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() => fetch(gallery.id, { next: true })}
          onClick={this.handleClick}
          srcKey="file"
          renderEmpty={() => (
            <EmptyState icon="photos-outline">
              <h1>Ingen bilder</h1>
              <h4>
                Trykk <a onClick={() => this.toggleUpload()}>her</a> for å legge
                inn bilder
              </h4>
            </EmptyState>
          )}
        />

        {this.state.upload && (
          <ImageUpload
            inModal
            multiple
            crop={false}
            onClose={this.toggleUpload}
            onSubmit={this.toggleUpload}
          />
        )}

        {children &&
          cloneElement(children, { gallery, push, loggedIn, currentUser })}
      </Content>
    );
  }
}
