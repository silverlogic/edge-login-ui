import React, { Component } from 'react'
import { connect } from 'react-redux'

import CachedUsers from '../../CachedUsers/CachedUsers.web.js'
import dropdown from '../../../img/dropdown.png'

import {
  openLogin,
  loginPIN,
  openUserList,
  closeUserList,
  showErrorLoginPinMessage,
  clearErrorLoginPinMessage
} from '../Login.action'
import { loginWithPin } from '../Login.middleware'
import { closeLoading } from '../../Loader/Loader.action'

import styles from './LoginWithPin.webStyle.scss'
import Input from 'react-toolbox/lib/input'

class LoginWithPin extends Component {
  _handleSubmit = () => {
    console.log(this.props.pin)
    const callback = (error, account) => {
      this.props.dispatch(loginPIN(''))
      this.props.dispatch(clearErrorLoginPinMessage(error))
      if (!error) {
        if (window.parent.loginCallback) {
          return window.parent.loginCallback(null, account)
        }
        if (!window.parent.loginCallback) {
          this.props.dispatch(closeLoading())
          return this.props.router.push('/account')
        }
      }
      if (error) {
        return this.props.dispatch(showErrorLoginPinMessage(error))
      }
    }
    this.props.dispatch(
      loginWithPin(
        this.props.user,
        this.props.pin,
        callback
      )
    )
    // this.pin.getWrappedInstance().blur()
  }
  _handleChangePin = (pin) => {
    if (pin.length > 4) {
      pin = pin.substr(0, 4)
    }
    if (/^\d+$/.test(pin) || pin.length === 0) {
      this.props.dispatch(
        loginPIN(pin)
      )
    }
    if (pin.length === 4) {
      setTimeout(this._handleSubmit, 200)
    }
  }
  _gotoPasswordInput = (pin) => {
    this.props.dispatch(closeUserList())
    this.props.dispatch(openLogin())
  }
  _showCachedUsers = () => {
    this.props.dispatch(openUserList())
    this.pin.getWrappedInstance().blur()
  }
  _hideCachedUsers = () => {
    this.props.dispatch(closeUserList())
    this.pin.getWrappedInstance().focus()
  }
  _renderLoader = () => {
    if (this.props.loader.loading) {
      return <div className={styles.loading} />
    }
    if (!this.props.loader.loading) {
      return (
        <div className={styles.pinInput}>
          <p className={styles.placeholder}>&#8226;&#8226;&#8226;&#8226;</p>
          <Input
            type='password'
            name='password'
            ref={input => { this.pin = input }}
            className={styles.input}
            onChange={this._handleChangePin}
            value={this.props.pin}
            error={this.props.error}
          />
        </div>
      )
    }
  }
  render () {
    const usersDropdown = () => {
      return (
        <div className={styles.usernameContainer}>
          <p className={styles.label}>Username</p>
          <div className={styles.inputRow} tabIndex={1} onFocus={this._showCachedUsers} onBlur={this._hideCachedUsers}>
            <p className={styles.username}>{ this.props.user ? this.props.user : 'No User Selected' }</p>
            <img src={dropdown} className={styles.caret} />
          </div>
        </div>
      )
    }
    return (
      <div className={styles.container}>
        <div className={styles.background} />
        <div className={styles.main}>
          <p className={styles.header}>Login with your PIN</p>
          <div className={styles.box}>
            <CachedUsers
              component={usersDropdown()}
              area='pinLogin'
              containerClassName={styles.cachedUsers}
              userListClassName={styles.userListClassName}
            />
            <div className={styles.pinForm}>
              <p className={styles.pinLabel}>Enter PIN</p>
              {this._renderLoader()}
            </div>
          </div>
          <p className={styles.exitLink} onClick={this.props.openViewPassword}>Exit PIN Login</p>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  pin: state.login.pin,
  user: state.cachedUsers.selectedUserToLogin,
  showCachedUsers: state.login.showCachedUsers,
  loginPinWait: state.login.loginPinWait,
  error: state.login.errorPin,
  loader: state.loader,
  currentPasswordCountdown: false
}))(LoginWithPin)