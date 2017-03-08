import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Controller.extend({
  orderInfo: inject('order-info'),

  cars: computed('orderInfo.selected.carTypeId', function() {
    let cars = [];
    get(this, "orderInfo.filteredCarTypes").forEach(car => {
      if (!cars.findBy('carConfig.id', car.carConfig.id)) {
        cars.push(car);
      }
    });
    return cars;
  })
});
