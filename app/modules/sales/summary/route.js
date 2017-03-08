import Route from 'ember-route';

export default Route.extend({
  actions: {
    goToContact() {
      this.transitionTo('sales.contact');
    }
  }
});
