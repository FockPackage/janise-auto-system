import Component from 'ember-component';
import computed from 'ember-computed';

export default Component.extend({
  mobiConfig: computed(function() {
    return {
    }
  }),

  mobiWidgetConfig: computed(function() {
    return {
      display: 'center',
       buttons: [{
         text: '确认',
         handler: 'set'
       }, {
         text: '取消',
         handler: 'cancel'
       }]
    }
  })
});
