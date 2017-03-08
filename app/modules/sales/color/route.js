import Route from 'ember-route';
import inject from 'ember-service/inject';

export default Route.extend({
  orderInfo: inject('order-info'),

  actions: {
    toggleColor(colorId, type) {
      this.get('orderInfo').toggleColor(colorId, type);
    }
  }
});
