import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    mobiscroll.calendar('#deliveryDate', {
      theme: 'cadillac',
      display: 'bottom',
      dateFormat: "yy-mm-dd",
      onSet: event => {
        get(this, 'onSetDate') && get(this, 'onSetDate')(event.valueText);
      }
    });
  }
});
