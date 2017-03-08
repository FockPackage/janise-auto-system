import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';
import inject from 'ember-service/inject';

export default Route.extend({
  orderInfo: inject('order-info'),

  setupController() {
    setProperties(this.controllerFor('application'), {
      singlePage: false,
      navClassName: 'nav',
      showLogo: false,
      defaultMenu: false,
      primaryComponent: 'common-ui/navbar',
      hasSubnav: false
    });

    this._super(...arguments);
  },

  afterModel() {
    this.get('orderInfo').setOrderInfo(null);
  }
});
