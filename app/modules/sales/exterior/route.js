import Route from 'ember-route';
import inject from 'ember-service/inject';
import { setProperties } from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  orderInfo: inject('order-info'),

  model() {
    return {
      filteredInteriorColors: this.get('orderInfo.filteredInteriorColors'),
    }
  },

  setupController(controller, model) {
    this._super(...arguments);

    const car = model.filteredInteriorColors[0];
    const defaultWheel = car.carHub;

    const filteredAccessories = get(this, "orderInfo.filteredAccessories");
    const wheels = filteredAccessories.filterBy("fitType.meaning", "轮毂");

    const exteriors = filteredAccessories
      .filterBy("fitType.meaning", "外部配件")
      .map(accessory => {
        const selectedAccessory = get(this, "orderInfo.selected.exteriors").findBy('id', accessory.id);

        if (selectedAccessory) {
          setProperties(accessory, { checked: true, count: selectedAccessory.count });
        } else {
          setProperties(accessory, { checked: false, count: 1 });
        }
        return accessory;
      });

    setProperties(controller, { defaultWheel, wheels, exteriors });
  },

  actions: {
    toggleWheel(wheelId, isSelectDefaultWheel, price) {
      this.get('orderInfo').toggleWheel(wheelId, isSelectDefaultWheel, price);
    },

    toggleAccessory(accessoryId, type, price) {
      this.get('orderInfo').toggleAccessory(accessoryId, type, price);
    },

    setAccessoryCount(accessoryId, count, type) {
      this.get('orderInfo').setAccessoryCount(accessoryId, count, type);
    }
  }
});
