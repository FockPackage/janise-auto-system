import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  orderInfo: inject(),

  car: computed('orderInfo.selected.car', function() {
    const car = get(this, "orderInfo.selected.car");
    set(car, "label", `${car.carType.meaning} ${car.carConfig.meaning}`);
    return car;
  }),

  accessories: computed(
    'orderInfo.selected.exteriors.length',
    'orderInfo.selected.interiors.length',
    'orderInfo.selected.carAccessories.length',
    'orderInfo.selected.accessories.length',
    function() {
      const orderInfo = get(this, 'orderInfo');
      const selected = orderInfo.selected;
      let accessories = [];

      selected.exteriors.forEach(exterior => {
        let accessory = orderInfo.allAccessories.findBy("id", exterior.id);
        set(accessory, "netPrice", exterior.price);
        set(accessory, "count", exterior.count);
        accessories.push(accessory);
      });

      selected.interiors.forEach(interior => {
        let accessory = orderInfo.allAccessories.findBy("id", interior.id);
        set(accessory, "netPrice", interior.price);
        set(accessory, "count", interior.count);
        accessories.push(accessory);
      });

      selected.carAccessories.forEach(accessory => {
        const ca = orderInfo.allAccessories.findBy("id", accessory.id);
        set(ca, "netPrice", accessory.price);
        set(ca, "count", accessory.count);
        accessories.push(ca);
      });

      selected.accessories.forEach(accessory => {
        const a = orderInfo.allAccessories.findBy("id", accessory.id);
        set(a, "netPrice", accessory.price);
        set(a, "count", accessory.count);
        accessories.push(a);
      });

      return accessories;
    }),

  actions: {
    updateCarNetPrice(price) {
      get(this, "orderInfo").updateCarNetPrice(price);
    },

    updateAccessoryNetPrice(accessoryId, price) {
      get(this, "orderInfo").updateAccessoryNetPrice(accessoryId, price);
    },

    updateAccessoryCount(accessoryId, price) {
      get(this, "orderInfo").updateAccessoryCount(accessoryId, price);
    }
  }
});
