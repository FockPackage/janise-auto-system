import Component from 'ember-component';
import mobiscroll from 'mobiscroll';

export default Component.extend({
  classNames: ['md-login-form'],

  formValue: {},

  didInsertElement() {
    mobiscroll.form(this.element, {
      theme: 'ios'
    });
  }
});
