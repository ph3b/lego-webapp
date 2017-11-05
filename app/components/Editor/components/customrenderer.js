//@flow
import { EditorState, ContentBlock } from 'draft-js';

import QuoteCaptionBlock from './blocks/blockquotecaption';
import CaptionBlock from './blocks/caption';
import AtomicBlock from './blocks/atomic';
import TodoBlock from './blocks/todo';
import ImageBlock from './blocks/image';
import { Block } from '../util/constants';

export default (
  setEditorState: EditorState => void,
  getEditorState: () => EditorState
) => (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.BLOCKQUOTE_CAPTION:
      return {
        component: QuoteCaptionBlock
      };
    case Block.CAPTION:
      return {
        component: CaptionBlock
      };
    case Block.ATOMIC:
      return {
        component: AtomicBlock,
        editable: false,
        props: {
          getEditorState
        }
      };
    case Block.TODO:
      return {
        component: TodoBlock,
        props: {
          getEditorState
        }
      };
    case Block.IMAGE:
      return {
        component: ImageBlock,
        props: {
          setEditorState,
          getEditorState
        }
      };
    default:
      return null;
  }
};
