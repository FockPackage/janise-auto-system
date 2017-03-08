import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';
export default Component.extend({
  tagName: 'li',
  classNames: ['price-setup'],
  prefix:'¥',
  min:'0',
  max:'10000000000',
  lang:'zh',
  theme: 'mobiscroll', //codillac
  display:'bottom',

  didInsertElement() {
    this.mobi && this.mobi.destroy();
  },

  didRender(){
    this._super(...arguments);
    this.mobi = new  mobiscroll.numpad(`#${get(this, 'mobi-id')}`, {
      theme: get(this,'theme'),
      lang: get(this,'lang'),
      preset: 'decimal',
      scale: 0,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      min: get(this, 'min'),
      max: get(this, 'max'),
      prefix: get(this, 'prefix'),
      onSet: function (event) {
        get(this,'onSet') && get(this,'onSet')(event.valueText);
      },
    });
  },

  willDestroyElement(){
    this.mobi && this.mobi.destroy();
  }

});
