import AjaxService from 'ember-ajax/services/ajax';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import inject from 'ember-service/inject';
import getOwner from 'ember-owner/get';

export default AjaxService.extend({
  session: inject(),

  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  headers: computed('session.data.authenticated.access_token', {
    get() {
      let headers = {};
      const token = get(this, 'session.data.authenticated.token');
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        get(this, 'router').transitionTo('login');
      }
      return headers;
    }
  }),

  trustedHosts: [
    'localhost', '192.168.0.213', '192.168.0.171', '114.215.252.83'
  ]
});
