import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Component.extend({
  isShow: { updatePrice: false },
  formValue: { price: {} },

  actions: {
    togglePopup(type, accessory) {
      this.toggleProperty(`isShow.${type}`);

      if (get(this, `isShow.${type}`)) {
        set(this, "currentEditAccessory", accessory);
        get(this, "getAccessories")({ fitCode: accessory.fitCode });
      }
    },

    none() {}
  }
});
