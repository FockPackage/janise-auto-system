import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: "ul",
  attributeBindings: ['mbsc:mbsc-enhance'],
  mbsc:true,

  didInsertElement() {
    this._super(...arguments);

    this.a = mobiscroll.listview(this.element, {
      theme: 'ios',
      enhance: true,
      ...get(this, "mobiConfig")
    });
  }
});
