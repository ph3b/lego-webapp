import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchGallery, addPictures } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import GalleryDetail from './components/GalleryDetail';
import {
  selectGalleryById,
  selectPicturesForGallery
} from 'app/reducers/galleries';

function mapStateToProps(state, props) {
  const { galleryId } = props.params;

  return {
    gallery: selectGalleryById(state, { galleryId }),
    pictures: selectPicturesForGallery(state, { galleryId }),
    loading: state.galleries.fetching
  };
}

const mapDispatchToProps = { push, addPictures };

export default compose(
  dispatched(
    ({ params: { galleryId } }, dispatch) => dispatch(fetchGallery(galleryId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(GalleryDetail);
