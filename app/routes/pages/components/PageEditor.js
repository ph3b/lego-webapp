// @flow

import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './PageEditor.css';
import { EditorField, TextInput, Form } from 'app/components/Form';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { Field } from 'redux-form';
import { Content } from 'app/components/Content';
import { get } from 'lodash';

type Page = {
  title: string,
  content: string,
  picture?: string
};

export type Props = {
  page: Page,
  pageSlug: string,
  isNew: boolean,
  loggedIn: boolean,
  currentUser: any,
  uploadFile: ({ file: string, isPublic: boolean }) => Promise<*>,
  handleSubmit: Function => Promise<*>,
  updatePage: (string, Page) => Promise<*>,
  createPage: Page => Promise<*>,
  deletePage: (slug: string) => Promise<*>,
  push: string => void
};

type State = {
  page: {
    picture: string,
    content: string
  },
  images: { [key: string]: string }
};

export default class PageEditor extends Component<Props, State> {
  state = {
    page: {
      picture: get(this.props, ['page', 'picture']),
      content: get(this.props, ['page', 'content'])
    },
    images: {}
  };

  setPicture = (image: any) => {
    this.props.uploadFile({ file: image, isPublic: true }).then(action => {
      const file = action.meta.fileToken;
      this.setState({
        images: {
          ...this.state.images,
          [file]: window.URL.createObjectURL(image)
        },
        page: { ...this.state.page, picture: file }
      });
    });
  };

  onDelete = () => {
    const { push, pageSlug, deletePage } = this.props;
    deletePage(pageSlug).then(() => push('/pages/info/om-oss'));
  };

  onSubmit = (data: Page) => {
    const body = {
      title: data.title,
      content: data.content,
      picture: undefined
    };

    const { push, pageSlug } = this.props;

    if (this.state.images[this.state.page.picture]) {
      body.picture = this.state.page.picture;
    } else {
      delete body.picture;
    }

    if (this.props.isNew) {
      return this.props.createPage(body).then(result => {
        push(`/pages/info/${result.payload.result}`);
      });
    }

    this.props
      .updatePage(this.props.pageSlug, body)
      .then(() => push(`/pages/info/${pageSlug}`));
  };

  render() {
    const { isNew, uploadFile, handleSubmit, page } = this.props;
    const { images } = this.state;
    if (!isNew && !page) {
      return <LoadingIndicator loading />;
    }

    return (
      <Content>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <div className={styles.coverImage}>
            <ImageUpload
              aspectRatio={20 / 6}
              onSubmit={this.setPicture}
              img={
                images[this.state.page.picture]
                  ? images[this.state.page.picture]
                  : page.picture
              }
            />
          </div>

          <FlexRow alignItems="baseline" justifyContent="space-between">
            <Field
              placeholder="Title"
              name="title"
              component={TextInput.Field}
              id="page-title"
            />

            {!isNew && (
              /* $FlowFixMe */
              <ConfirmModalWithParent
                title="Slett side"
                message="Er du sikker på at du vil slette denne infosiden?"
                onConfirm={this.onDelete}
              >
                <Button>Slett</Button>
              </ConfirmModalWithParent>
            )}
            <Button className={styles.submitButton} type="submit">
              {isNew ? 'Create' : 'Save'}
            </Button>
          </FlexRow>

          <Field
            placeholder="Write page content here..."
            name="content"
            component={EditorField}
            uploadFile={uploadFile}
          />
        </Form>
      </Content>
    );
  }
}
