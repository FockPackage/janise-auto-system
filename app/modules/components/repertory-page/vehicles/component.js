import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({

  isShow: { updatePrice: false, confirm: false, setPrice:false },
  formValue: { price: {} },

  storePrice: computed('formValue.price.carPrice3', function() {
    const storePrice = get(this, "formValue.price.carPrice3");
    return storePrice ? storePrice : get(this, 'currentEditCar.carPrice3');
  }),

  managerPrice: computed('formValue.price.carPrice2', function() {
    const managerPrice = get(this, "formValue.price.carPrice2");
    return managerPrice ? managerPrice : get(this, 'currentEditCar.carPrice2');
  }),

  hasPriceModulePermission: computed(function() {
    return get(this, "permission").hasPermission("PRICE_MODULE");
  }),

  actions: {
    togglePopup(type, car) {
      this.toggleProperty(`isShow.${type}`);
      set(this, "currentEditCar", car);

      if (type == "updatePrice") {
        set(this, 'formValue.price', {});
      }
    },

    togglePopupSetPrice(type) {
      this.toggleProperty('isShow.setPrice');
      set(this, "currentEditPrice", type);
    },

    setPrice(price) {
      set(this, `formValue.price.${get(this, 'currentEditPrice')}`, price);
    }
  }
});
