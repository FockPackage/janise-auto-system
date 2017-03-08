import Route from 'ember-route';
import inject from 'ember-service/inject';

export default Route.extend({
  orderInfo: inject('order-info'),

  actions: {
    toggleCarType(carType) {
      this.get('orderInfo').toggleCarType(carType);
    },

    toggleConfig(configId) {
      this.get('orderInfo').toggleConfig(configId);
    }
  }
});
