import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
export default Component.extend({
  didInsertElement() {

    mobiscroll.image('#vehicles', {
      theme: 'mobiscroll',
      display: 'bottom',
      placeholder: 'Please Select ...',
      labels: ['Make'],
      enhance: true,
      defaultValue: ['Citroen']
    });
  }

});
