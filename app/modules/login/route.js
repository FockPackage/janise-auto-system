import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController() {
    setProperties(this.controllerFor('application'), {
      singlePage: true,
      navClassName: 'nav',
      showLogo: false,
      defaultMenu: true,
      primaryComponent: 'common-ui/navbar',
      hasSubnav: false
    });

    this._super(...arguments);
  }
});
