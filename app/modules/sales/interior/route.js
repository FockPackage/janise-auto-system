import Route from 'ember-route';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  orderInfo: inject('order-info'),

  setupController(controller) {
    this._super(...arguments);

    const interiors = get(this, "orderInfo.filteredAccessories")
      .filterBy("fitType.meaning", "内部配件")
      .map(accessory => {
        const selectedAccessory = get(this, "orderInfo.selected.interiors").findBy('id', accessory.id);
        if (selectedAccessory) {
          setProperties(accessory, { checked: true, count: selectedAccessory.count });
        } else {
          setProperties(accessory, { checked: false, count: 1 });
        }
        return accessory;
      });
    setProperties(controller, { interiors });
  },

  actions: {
    toggleAccessory(accessoryId, price) {
      this.get('orderInfo').toggleAccessory(accessoryId, "interiors", price);
    },

    setAccessoryCount(accessoryId, count, type) {
      this.get('orderInfo').setAccessoryCount(accessoryId, count, type);
    }
  }
});
