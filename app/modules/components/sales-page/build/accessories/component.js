import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  isShow: { setAccessoryCount: false },
  currentAccessory: null,

  actions: {
    setAccessoryCount(value) {
      const accessoryId = get(this, "currentAccessory.id");
      const accessory = get(this, "carAccessories").findBy("id", accessoryId);

      if (accessory) {
        get(this, "setAccessoryCount")(accessoryId, value, "carAccessories");
        set(accessory, "count", value);
      } else {
        get(this, "setAccessoryCount")(accessoryId, value, "accessories");
        set(get(this, "accessories").findBy("id", accessoryId), "count", value);
      }
    },

    togglePopup(type, accessory) {
      this.toggleProperty(`isShow.${type}`);

      if (get(this, `isShow.${type}`)) {
        set(this, "currentAccessory", accessory);
      }
    },

    test(accessoryId, e) {
      const value = e.target.value;

      const accessory = get(this, "carAccessories").findBy("id", accessoryId);

      if (accessory) {
        get(this, "setAccessoryCount")(accessoryId, value, "carAccessories");
        set(accessory, "count", value);
      } else {
        get(this, "setAccessoryCount")(accessoryId, value, "accessories");
        set(get(this, "accessories").findBy("id", accessoryId), "count", value);
      }
    },

    toggleAccessory(accessoryId, type, price) {
      const accessory = get(this, "carAccessories").findBy("id", accessoryId);
      if (accessory) {
        set(accessory, "checked", !accessory.checked);
      } else {
        const accessory = get(this, "accessories").findBy("id", accessoryId);
        set(accessory, "checked", !accessory.checked);
      }
      get(this, "toggleAccessory")(accessoryId, type, price);
    }
  }
});
