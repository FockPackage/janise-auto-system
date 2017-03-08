import Route from 'ember-route';

export default Route.extend({
  activate() {
    this.controllerFor('application').set('hasSubnav', true);
  },

  setupController() {
    this._super(...arguments);

    const application = this.controllerFor('application');
    application.set('manage', true)
  },

  renderTemplate() {
    this._super(...arguments);
    this.render('global/vehicles/creating/subnav', {outlet: 'subnav', into: 'application'});
  }
});
