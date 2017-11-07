// @flow

import styles from './ConfirmModal.css';
import React, { type ComponentType, type Node } from 'react';
import { get } from 'lodash';
import Modal from 'app/components/Modal';
import Button from '../Button';

type ConfirmModalProps = {
  onConfirm?: () => Promise<*>,
  onCancel?: () => Promise<*>,
  message: string,
  title: string,
  disabled?: boolean,
  errorMessage?: string
};

export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  title,
  disabled = false,
  errorMessage = ''
}: ConfirmModalProps) => (
  <div className={styles.overlay}>
    <div className={styles.confirmContainer}>
      <h2 className={styles.confirmTitle}>{title}</h2>
      <div className={styles.confirmMessage}>{message}</div>
      <div className={styles.buttonGroup}>
        <Button disabled={disabled} onClick={onCancel}>
          Avbryt
        </Button>
        <Button disabled={disabled} onClick={onConfirm}>
          Ja
        </Button>
        <p style={{ color: 'red' }}>{errorMessage} </p>
      </div>
    </div>
  </div>
);

type State = {
  modalVisible: boolean,
  working: boolean,
  errorMessage: string
};

type withModalProps = {
  /* Close the modal after confirm promise is resolved 
   * This should only be used if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnConfirm?: boolean,
  /* Close the modal after cancel promise is resolved 
   * This should only be true if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnCancel?: boolean,
  children: Node
};

export default function withModal<Props>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return class extends React.Component<
    withModalProps & ConfirmModalProps,
    State
  > {
    static displayName = `WithModal(${displayName})`;
    state = { modalVisible: false, working: false, errorMessage: '' };

    toggleModal = () => {
      this.setState(state => ({
        modalVisible: !state.modalVisible
      }));
      this.stopWorking();
      this.resetError();
    };

    hideModal = () => {
      this.setState({
        modalVisible: false
      });
    };

    startWorking = () => {
      this.setState({
        working: true
      });
    };

    stopWorking = () => {
      this.setState({
        working: false
      });
    };

    setErrorMessage = (errorMessage: string) => {
      this.setState({
        errorMessage
      });
    };

    resetError = () => {
      this.setState({
        errorMessage: ''
      });
    };

    render() {
      const {
        onConfirm = () => Promise.resolve(),
        onCancel = () => Promise.resolve(),
        message,
        title,
        closeOnCancel = true,
        closeOnConfirm = false,
        ...props
      } = this.props;

      const wrapAction = (action: () => Promise<*>, closeWhenDone: boolean) => {
        return () => {
          this.startWorking();
          return action().then(
            result => {
              if (closeWhenDone) {
                this.stopWorking();
                this.hideModal();
                this.resetError();
              }
              return result;
            },
            error => {
              this.stopWorking();
              const errorMessage =
                get(error, ['meta', 'errorMessage']) ||
                'Det skjedde en feil...';
              this.setErrorMessage(errorMessage);
              throw error;
            }
          );
        };
      };

      const modalOnConfirm = wrapAction(onConfirm, closeOnConfirm);
      const modalOnCancel = wrapAction(onCancel, closeOnCancel);

      const { working, errorMessage } = this.state;

      return [
        <WrappedComponent key={0} {...props} onClick={this.toggleModal} />,
        <Modal
          closeOnBackdropClick={!working}
          key={1}
          show={this.state.modalVisible}
          onHide={this.toggleModal}
        >
          <ConfirmModal
            onCancel={modalOnCancel}
            onConfirm={modalOnConfirm}
            message={message}
            title={title}
            disabled={working}
            errorMessage={errorMessage}
          />
        </Modal>
      ];
    }
  };
}

const ChildrenWithProps = ({ children, ...restProps }: { children: Node }) => (
  <div>
    {React.Children.map(children, child =>
      React.cloneElement(child, { ...restProps })
    )}
  </div>
);

export const ConfirmModalWithParent = withModal(ChildrenWithProps);
