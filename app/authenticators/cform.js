import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import inject from 'ember-service/inject';
import config from 'auto-service-system/config/environment';
import RSVP from 'rsvp';

export default BaseAuthenticator.extend({
  ajax: inject(),

  authenticate(username, password) {
    return this.get('ajax').post(`${config.API_HOST}/login`, {
      data: { userName: username, password }
    })
      .then(response => {
        return {
          token: response.authToken, user: response.row
        };
      });
  },

  restore(data) {
    return RSVP.resolve(data);
  }
});
