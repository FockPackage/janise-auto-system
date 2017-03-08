import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';
import { scheduleOnce } from 'ember-runloop';

export default Component.extend({

  attributeBindings: ['style:style'],
  style:'display:none',

  mobiInit(){
    this.mobi = new mobiscroll.form(this.element, {
      theme: 'ios'
    });
  },

  didInsertElement() {
    this._super(...arguments);
    scheduleOnce('afterRender', this, 'mobiInit');
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, "mobi").destroy();
  }
});
