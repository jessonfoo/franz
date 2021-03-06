import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';

import Webview from './ServiceWebview';
import Appear from '../../ui/effects/Appear';

const messages = defineMessages({
  welcome: {
    id: 'services.welcome',
    defaultMessage: '!!!Welcome to Franz',
  },
  getStarted: {
    id: 'services.getStarted',
    defaultMessage: '!!!Get started',
  },
});

@observer
export default class Services extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    handleIPCMessage: PropTypes.func.isRequired,
    openWindow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    isAppMuted: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
  };

  static defaultProps = {
    services: [],
    activeService: '',
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      services,
      handleIPCMessage,
      setWebviewReference,
      openWindow,
      reload,
      isAppMuted,
      update,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="services">
        {services.length === 0 && (
          <Appear
            timeout={1500}
            transitionName="slideUp"
          >
            <div className="services__no-service">
              <img src="./assets/images/logo.svg" alt="" />
              <h1>{intl.formatMessage(messages.welcome)}</h1>
              <Appear
                timeout={300}
                transitionName="slideUp"
              >
                <Link to="/settings/recipes" className="button">
                  {intl.formatMessage(messages.getStarted)}
                </Link>
              </Appear>
            </div>
          </Appear>
        )}
        {services.map(service => (
          <Webview
            key={service.id}
            service={service}
            handleIPCMessage={handleIPCMessage}
            setWebviewReference={setWebviewReference}
            openWindow={openWindow}
            reload={() => reload({ serviceId: service.id })}
            isAppMuted={isAppMuted}
            enable={() => update({
              serviceId: service.id,
              serviceData: {
                isEnabled: true,
              },
              redirect: false,
            })}
          />
        ))}
      </div>
    );
  }
}
