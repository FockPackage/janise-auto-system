import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';
import { scheduleOnce } from 'ember-runloop';

export default Component.extend({

  tagName: "select",

  mobiInit(){
    this.mobi = new mobiscroll.select(this.element, {
      theme: 'ios',
      display: 'bottom',
      minWidth: 200,
      ...get(this, "mobiConfig"),
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
