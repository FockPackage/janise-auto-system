import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    this.mobi = new mobiscroll.numpad(this.element, {
      theme: 'ios',
      lang: "zh",
      preset: 'decimal',
      scale: 0,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      min: 0,
      max: 10000000000,
      prefix: get(this, "hasPrefix") ? "¥" : "",
      onSet: event => {
        get(this, 'onSet') && get(this, 'onSet')(event.valueText.replace(/,/g, ''));
        get(this, 'onClose') && get(this, 'onClose')();
      },
      onInit: (event, inst) => {
        inst.setVal(get(this, "value"));
        inst.attachShow(get(this, "bindId"));
      },
      onCancel: () => {
        get(this, 'onClose') && get(this, 'onClose')();
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, "mobi").destroy();
  }
});
