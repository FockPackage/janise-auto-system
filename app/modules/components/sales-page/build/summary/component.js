import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import inject from 'ember-service/inject';

export default Component.extend({
  orderInfo: inject('order-info'),

  isShow: {
    deleteCar: false,
    deleteAccessory: false,
    setAccessoryNetPrice: false,
    setCarNetPrice: false
  },

  allOfficalPrice: computed(
    'orderInfo.isBuyCar',
    'orderInfo.isBuyAccessory',
    'orderInfo.allAccessoriesOfficalPrice',
    function() {
      const isBuyCar = get(this, 'orderInfo.isBuyCar');
      const allAccessoriesOfficalPrice =  get(this, 'orderInfo.allAccessoriesOfficalPrice');
      const carOfficalPrice = +get(this, 'car').officialGuidePrice;

      if (get(this, 'orderInfo.isBuyAccessory')) {
        return isBuyCar ? carOfficalPrice + allAccessoriesOfficalPrice : allAccessoriesOfficalPrice;
      } else {
        return isBuyCar ? carOfficalPrice : 0;
      }
    }),

  title: computed(function() {
    const car = get(this, "orderInfo.filteredInteriorColors")[0];
    return `${car.carType.meaning} ${car.carConfig.meaning}`;
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

  isOrder: computed('orderInfo.orderStatus', function() {
    return get(this, "orderInfo.orderStatus") < 2;
  }),

  actions: {
    updateCarNetPrice(value) {
      this.get('orderInfo').updateCarNetPrice(get(this, "currentEdit.id"), value);
    },

    updateAccessoryNetPrice(value) {
      const accessoryId = get(this, "currentEdit.id");
      const accessory = get(this, "accessories").findBy("id", accessoryId);
      set(accessory, "netPrice", value);

      this.get('orderInfo').updateAccessoryNetPrice(accessoryId, value);
    },

    toggleSwitch() {
      return true;
    },

    togglePopup(type, currentEdit) {
      this.toggleProperty(`isShow.${type}`);

      if (get(this, `isShow.${type}`)) {
        set(this, "currentEdit", currentEdit);
      }
    },

    deleteAccessory() {
      this.get("orderInfo").deleteAccessory(get(this, "currentEdit.id"));
    },

    deleteCar() {
      this.get("orderInfo").deleteCar();
    },

    setAccessoryCount(accessoryId, e) {
      const value = e.target.value;
      const orderInfo = get(this, 'orderInfo');
      const selected = orderInfo.selected;

      let accessory = selected.exteriors.findBy("id", accessoryId);
      let type = "exteriors";
      if (!accessory) {
        accessory = selected.interiors.findBy("id", accessoryId);
        type = "interiors";
      }
      if (!accessory) {
        accessory = selected.accessories.findBy("id", accessoryId);
        type = "accessories";
      }
      if (!accessory) {
        accessory = selected.carAccessories.findBy("id", accessoryId);
        type = "carAccessories";
      }

      get(this, "setAccessoryCount")(accessoryId, value, type);
      set(accessory, "count", value);
    },
  }
});
