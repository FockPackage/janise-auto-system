import Component from 'ember-component';
import getOwner from 'ember-owner/get';
import computed from 'ember-computed';
import get from 'ember-metal/get';

const nextRouteMapping = {
  "sales.trims": "sales.color",
  "sales.color": "sales.exterior",
  "sales.exterior": "sales.interior",
  "sales.interior": "sales.accessories",
  "sales.accessories": "sales.summary"
}

export default Component.extend({
  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  nextRouteName: computed('router.currentRouteName', function() {
    return nextRouteMapping[get(this, 'router.currentRouteName')];
  }),

  title: computed(
    'selected.carTypeId',
    'selected.configId',
    'selected.exteriorColorId',
    'selected.interiorColorId',
    function() {
      const carTypeId = get(this, "selected.carTypeId");
      const configId = get(this, "selected.configId");
      const exteriorColorId = get(this, "selected.exteriorColorId");
      const interiorColorId = get(this, "selected.interiorColorId");

      if (interiorColorId) {
        const car = get(this, "filteredInteriorColors")[0];
        return `${car.carType.meaning} ${car.carConfig.meaning} ${car.carOutsideColor.meaning} ${car.carInsideColor.meaning}`;
      }

      if (exteriorColorId) {
        const car = get(this, "filteredExteriorColors").findBy('carOutsideColor.id', exteriorColorId);
        return `${car.carType.meaning} ${car.carConfig.meaning} ${car.carOutsideColor.meaning}`;
      }

      if (configId) {
        const car = get(this, "filteredCarTypes").findBy('carConfig.id', configId);
        return `${car.carType.meaning} ${car.carConfig.meaning}`;
      }

      if (carTypeId) {
        return get(this, "carTypes").findBy('id', carTypeId).meaning;
      }
    })
});
