import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController() {
    setProperties(this.controllerFor('application'), {
      singlePage: false,
      navClassName: 'nav',
      showLogo: false,
      defaultMenu: false,
      primaryComponent: 'common-ui/navbar',
      hasSubnav: true
    });

    this._super(...arguments);
  },

  renderTemplate() {
    this.render('price/subnav', { outlet: 'subnav', into: 'application' });
    this._super(...arguments);
  }
});
