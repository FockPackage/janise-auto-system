import Route from 'ember-route';
import inject from 'ember-service/inject';
import { setProperties } from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  orderInfo: inject('order-info'),

  setupController(controller) {
    this._super(...arguments);

    const carAccessories = get(this, "orderInfo.filteredAccessories")
      .filterBy("fitType.meaning", "4S店")
      .map(accessory => {
        const selectedAccessory = get(this, "orderInfo.selected.carAccessories").findBy('id', accessory.id);
        if (selectedAccessory) {
          setProperties(accessory, { checked: true, count: selectedAccessory.count });
        } else {
          setProperties(accessory, { checked: false, count: 1 });
        }
        return accessory;
      });

    const generalAccessories = get(this, "orderInfo.generalAccessories")
      .map(accessory => {
        const selectedAccessory = get(this, "orderInfo.selected.accessories").findBy('id', accessory.id);
        if (selectedAccessory) {
          setProperties(accessory, { checked: true, count: selectedAccessory.count });
        } else {
          setProperties(accessory, { checked: false, count: 1 });
        }
        return accessory;
      });
    setProperties(controller, { carAccessories, generalAccessories });
  },

  actions: {
    toggleAccessory(accessoryId, type, price) {
      this.get('orderInfo').toggleAccessory(accessoryId, type, price);
    },

    setAccessoryCount(accessoryId, count, type) {
      this.get('orderInfo').setAccessoryCount(accessoryId, count, type);
    }
  }
});
