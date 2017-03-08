import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  isShow: { setAccessoryCount: false },
  currentAccessory: null,

  actions: {
    setAccessoryCount(value) {
      const accessoryId = get(this, "currentAccessory.id");
      const accessory = get(this, "interiors").findBy("id", accessoryId);

      get(this, "setAccessoryCount")(accessoryId, value, "interiors");
      set(accessory, "count", value);
    },

    togglePopup(type, accessory) {
      this.toggleProperty(`isShow.${type}`);

      if (get(this, `isShow.${type}`)) {
        set(this, "currentAccessory", accessory);
      }
    },

    test(accessoryId, e) {
      const value = e.target.value;

      const accessory = get(this, "interiors").findBy("id", accessoryId);

      get(this, "setAccessoryCount")(accessoryId, value, "interiors");
      set(accessory, "count", value);
    },

    toggleAccessory(id, type, price) {
      const accessory = get(this, "interiors").findBy("id", id);
      set(accessory, "checked", !accessory.checked);
      get(this, "toggleAccessory")(id, type, price);
    }
  }
});
