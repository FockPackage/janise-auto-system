import Component from 'ember-component';
import mobiscroll from 'mobiscroll';

export default Component.extend({
  didInsertElement() {
    mobiscroll.form(this.element, {
      theme: 'ios'
    });
  }
});
