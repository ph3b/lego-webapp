// @flow

import React from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import { Form, TextArea, SelectInput, CheckBox } from 'app/components/Form';
import ProgressiveImage from 'app/components/ProgressiveImage';
import Button from 'app/components/Button';
import { Field, reduxForm } from 'redux-form';
import { Flex, Content } from 'app/components/Layout';
import { Link } from 'react-router';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';

type Props = {
  picture: Object,
  gallery: Object,
  push: string => void,
  handleSubmit: ((Object) => void) => void,
  updatePicture: Object => Promise<*>,
  deletePicture: () => Promise<*>,
  onDeleteGallery: () => mixed
};

const GalleryPictureEditModal = ({
  picture,
  gallery,
  push,
  deletePicture,
  updatePicture,
  handleSubmit
}: Props) => {
  const onSubmit = data => {
    const body = {
      id: picture.id,
      gallery: gallery.id,
      description: data.description,
      active: data.active,
      taggees: data.taggees && data.taggees.map(taggee => taggee.value)
    };

    updatePicture(body).then(() =>
      push(`/photos/${gallery.id}/picture/${picture.id}`)
    );
  };

  return (
    <Modal
      onHide={() => push(`/photos/${gallery.id}`)}
      backdropClassName={styles.backdrop}
      backdrop
      show
      contentClassName={styles.content}
    >
      <Content className={styles.topContent}>
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Flex justifyContent="space-between">
            <img
              className={styles.galleryThumbnail}
              alt="some alt"
              src={gallery.cover.thumbnail}
            />

            <Flex column justifyContent="space-around">
              <h5 className={styles.header}>
                <Link to={`/photos/${gallery.id}`}>{gallery.title}</Link>
              </h5>
              <GalleryDetailsRow size="small" gallery={gallery} />
            </Flex>
          </Flex>
        </Flex>
      </Content>
      <Flex className={styles.pictureContainer}>
        <ProgressiveImage src={picture.file} alt="some alt" />
      </Flex>
      <Content className={styles.bottomContent}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="Bilde beskrivelse"
            placeholder="Beskrivelse"
            name="description"
            component={TextArea.Field}
            id="gallery-picture-description"
          />
          <Field
            label="Synlig for offenligheten"
            placeholder="Synlig for alle brukere"
            name="active"
            description="Om bildet skal være synlig for brukere som ikke har tilgang ti å redigere albumet."
            component={CheckBox.Field}
            id="gallery-picture-active"
            normalize={v => !!v}
          />
          <Field
            label="Tagg brukere"
            name="taggees"
            id="gallery-picture-taggees"
            filter={['users.user']}
            placeholder="Skriv inn navn på brukere i bildet"
            component={SelectInput.AutocompleteField}
            multi
          />
          <Flex justifyContent="flex-end">
            <Button
              onClick={() =>
                deletePicture(gallery.id, picture.id).then(() =>
                  push(`/photos/${gallery.id}`)
                )}
            >
              Slett
            </Button>
            <Button
              onClick={() =>
                push(`/photos/${gallery.id}/picture/${picture.id}`)}
            >
              Avbryt
            </Button>
            <Button type="submit">Lagre</Button>
          </Flex>
        </Form>
      </Content>
    </Modal>
  );
};

export default reduxForm({
  form: 'galleryPictureEditor'
})(GalleryPictureEditModal);
