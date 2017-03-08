import Route from 'ember-route';
import inject from 'ember-service/inject';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  orderInfo: inject('order-info'),

  model() {
    const orderInfo = get(this, "orderInfo");

    return {
      formValue: this.modelFor('repertory').formValue,
      carTypes: orderInfo.carTypes,
      cars: orderInfo.cars
    };
  },

  actions: {
    toggleSelect(type, value) {
      const repertory = this.modelFor('repertory');
      switch (type) {
        case 'carTypeId':
          set(repertory, 'formValue.configId', null);
          set(repertory, 'formValue.yearId', null);
          set(repertory, 'formValue.exteriorColorId', null);
          break;
        case 'configId':
          set(repertory, 'formValue.yearId', null);
          set(repertory, 'formValue.exteriorColorId', null);
          break;
        case 'yearId':
          set(repertory, 'formValue.exteriorColorId', null);
          break;
      }
      this._value = '';
      set(repertory, `formValue.${type}`, value );
    }
  }
});
