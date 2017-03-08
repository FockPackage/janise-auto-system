import Component from 'ember-component';
import set from 'ember-metal/set';

export default Component.extend({
  tagName: '',

  popup:true,

  actions: {
    close(){
      set(this,'popup', false);
    }
  }

});
