// @flow

import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import logoImage from 'app/assets/logo-dark.png';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import cx from 'classnames';
import Search from '../Search';
import { ProfilePicture } from '../Image';
import FancyNodesCanvas from './FancyNodesCanvas';
import NotificationsDropdown from '../HeaderNotifications';
import { Flex } from 'app/components/Layout';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm
} from 'app/components/LoginForm';
import styles from './Header.css';

import type { UserEntity } from 'app/reducers/users';

type Props = {
  searchOpen: boolean,
  toggleSearch: () => any,
  currentUser: UserEntity,
  loggedIn: boolean,
  login: () => Promise<*>,
  logout: () => void,
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => Promise<void>,
  markNotification: number => Promise<void>,
  fetchNotificationData: () => Promise<void>
};

type State = {
  accountOpen: boolean,
  shake: boolean,
  forgotPassword: boolean,
  registerUser: boolean
};

type AccountDropdownItemsProps = {
  logout: () => void,
  onClose: () => void,
  username: string
};

function AccountDropdownItems({
  logout,
  onClose,
  username
}: AccountDropdownItemsProps) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <Link to="/users/me" onClick={onClose} style={{ color: '#333' }}>
          <strong>{username}</strong>
          <Icon name="contact" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <Link to="/users/me/settings/profile" onClick={onClose}>
          Innstillinger
          <Icon name="cog" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to="/meetings/" onClick={onClose}>
          Møteinnkallinger
          <Icon name="calendar" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <a onClick={() => (logout(), onClose())}>
          Logg ut
          <Icon name="log-out" size={24} />
        </a>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

class Header extends Component<Props, State> {
  state: State = {
    accountOpen: false,
    shake: false,
    forgotPassword: false,
    registerUser: false
  };

  toggleRegisterUser = (e: Event) => {
    this.setState({ registerUser: true });
    e.stopPropagation();
  };

  toggleForgotPassword = (e: Event) => {
    this.setState({ forgotPassword: true });
    e.stopPropagation();
  };

  toggleBack = (e: Event) => {
    this.setState({ registerUser: false, forgotPassword: false });
    e.stopPropagation();
  };

  render() {
    const { loggedIn } = this.props;

    const { registerUser, forgotPassword } = this.state;

    let title, form;
    if (registerUser) {
      title = 'Registrer bruker';
      form = <RegisterForm />;
    } else if (forgotPassword) {
      title = 'Glemt passord';
      form = <ForgotPasswordForm />;
    } else {
      title = 'Logg inn';
      form = <LoginForm />;
    }

    return (
      <header className={styles.header}>
        <FancyNodesCanvas height={300} />
        <div className={styles.content}>
          <IndexLink to="/" className={styles.logo}>
            <img src={logoImage} alt="" />
          </IndexLink>

          <div className={styles.menu}>
            <div className={styles.navigation}>
              <Link to="/events" activeClassName={styles.activeItem}>
                Arrangementer
              </Link>
              {!loggedIn ? (
                <Link
                  to="/pages/info/for-bedrifter"
                  activeClassName={styles.activeItem}
                >
                  For bedrifter
                </Link>
              ) : (
                <Link to="/joblistings" activeClassName={styles.activeItem}>
                  Karriere
                </Link>
              )}
              <Link to="/pages/info/om-oss" activeClassName={styles.activeItem}>
                Om Abakus
              </Link>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={this.props.toggleSearch}
                className={styles.burger}
              >
                <Icon name="menu" size={30} scaleOnHover />
              </button>

              {loggedIn && (
                <NotificationsDropdown
                  notificationsData={this.props.notificationsData}
                  fetchNotifications={this.props.fetchNotifications}
                  notifications={this.props.notifications}
                  markAllNotifications={this.props.markAllNotifications}
                  markNotification={this.props.markNotification}
                  fetchNotificationData={this.props.fetchNotificationData}
                />
              )}

              {loggedIn && (
                <Dropdown
                  show={this.state.accountOpen}
                  toggle={() =>
                    this.setState(state => ({
                      accountOpen: !state.accountOpen
                    }))}
                  triggerComponent={
                    <ProfilePicture
                      size={30}
                      user={this.props.currentUser}
                      style={{ verticalAlign: 'middle' }}
                    />
                  }
                >
                  <AccountDropdownItems
                    onClose={() => {}}
                    username={this.props.currentUser.username}
                    logout={this.props.logout}
                  />
                </Dropdown>
              )}

              {!loggedIn && (
                <Dropdown
                  show={this.state.accountOpen}
                  toggle={() =>
                    this.setState(state => ({
                      accountOpen: !state.accountOpen,
                      shake: false
                    }))}
                  contentClassName={cx(
                    this.state.shake ? 'animated shake' : '',
                    styles.dropdown
                  )}
                  triggerComponent={<Icon name="contact" size={30} />}
                >
                  <div style={{ padding: 10 }}>
                    <Flex
                      component="h2"
                      justifyContent="space-between"
                      alignItems="center"
                      className="u-mb"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {title}
                      {!(registerUser || forgotPassword) && (
                        <div>
                          <button
                            onClick={this.toggleForgotPassword}
                            className={styles.toggleButton}
                          >
                            Glemt passord
                          </button>
                          <span className={styles.toggleButton}>&bull;</span>
                          <button
                            onClick={this.toggleRegisterUser}
                            className={styles.toggleButton}
                          >
                            Jeg er ny
                          </button>
                        </div>
                      )}
                      {(registerUser || forgotPassword) && (
                        <button
                          onClick={this.toggleBack}
                          className={styles.toggleButton}
                        >
                          Tilbake
                        </button>
                      )}
                    </Flex>
                    {form}
                  </div>
                </Dropdown>
              )}

              <button
                onClick={this.props.toggleSearch}
                className={styles.hideOnMobile}
              >
                <Icon name="search" size={30} className={styles.searchIcon} />
              </button>
            </div>
          </div>

          <Modal
            show={this.props.searchOpen}
            onHide={this.props.toggleSearch}
            backdropClassName={styles.backdrop}
            backdrop
          >
            <Search
              loggedIn={loggedIn}
              isOpen={this.props.searchOpen}
              onCloseSearch={this.props.toggleSearch}
            />
          </Modal>
        </div>
      </header>
    );
  }
}
export default Header;
