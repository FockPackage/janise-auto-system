import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  attributeBindings: ['type'],

  forId: computed('vehicle.value', function() {
    const value = get(this, 'vehicle.value');
    return `vehicle-${value}`;
  })
}).reopenClass({ positionalParams: ['vehicle']});
