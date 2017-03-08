import Route from 'ember-route';

export default Route.extend({
  actions: {
    goToOrders() {
      this.transitionTo('orders');
    }
  }
})
