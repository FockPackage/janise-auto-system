import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  forId: computed('car.carConfig.id', function() {
    const carConfigId = get(this, 'car.carConfig.id');
    return `car-${carConfigId}`;
  }),

  title: computed('car.carConfig.id', function() {
    const carTypeMeaning = get(this, 'car.carType.meaning');
    const carYearMeaning = get(this, 'car.carYear.meaning');
    const carConfigMeaning = get(this, 'car.carConfig.meaning');
    return `${carTypeMeaning} ${carYearMeaning} ${carConfigMeaning}`;
  }),

  features: computed('car.carSummary3', function() {
    const summary = get(this, "car.carSummary3");
    return summary ? get(this, "car.carSummary3").split('|') : null;
  })
});
