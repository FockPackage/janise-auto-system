import Route from 'ember-route';

export default Route.extend({
  renderTemplate() {
    this.render('temp', { outlet: 'single' });
  },

  activate() {
    this.controllerFor('application').set('single', true);
  },

  deactivate() {
    this.controllerFor('application').set('single', false);
  }
});
