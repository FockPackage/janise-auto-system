import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    this.mobi = new mobiscroll.widget(this.element, {
      theme: 'ios',
      onInit: (_, inst) => {
        inst.attachShow(get(this, "bindId"));
      },
      ...get(this, "mobiConfig")
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, "mobi").destroy();
  }
});
