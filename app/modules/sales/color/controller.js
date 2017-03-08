import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Controller.extend({
  orderInfo: inject('order-info'),

  exteriorColors: computed("orderInfo.selected.configId", function() {
    let exteriorColors = [];
    get(this, "orderInfo.filteredConfigs").forEach(car => {
      if (!exteriorColors.findBy('id', car.carOutsideColor.id)) {
        exteriorColors.push(car.carOutsideColor);
      }
    });
    return exteriorColors;
  }),

  interiorColors: computed("orderInfo.selected.exteriorColorId", function() {
    let interiorColors = [];
    get(this, "orderInfo.filteredExteriorColors").forEach(car => {
      if (!interiorColors.findBy('id', car.carInsideColor.id)) {
        interiorColors.push(car.carInsideColor);
      }
    });
    return interiorColors;
  })
});
