import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  mobiActions: computed(function() {
    return {
      right: [{
        icon: 'thumbs-up',
        action: (event, inst) => {
          get(this, 'notification').success("thumbs-up")
        }
      }, {
        icon: 'share',
        action: (event, inst) => {
          get(this, 'notification').success("share")
        }
      }, {
        icon: 'bubble',
        action: (event, inst) => {
          get(this, 'notification').success("bubble")
        }
      }],
      left: [{
        icon: 'thumbs-up',
        action: (event, inst) => {
          get(this, 'notification').success("thumbs-up")
        }
      }, {
        icon: 'share',
        action: (event, inst) => {
          get(this, 'notification').success("share")
        }
      }, {
        icon: 'bubble',
        action: (event, inst) => {
          get(this, 'notification').success("bubble")
        }
      }]
    }
  }),

  mobiStages: computed(function() {
    return [{
        percent: 25,
        color: 'green',
        icon: 'plus',
        text: 'new order',
        action: () => {
          get(this, "goToCreateOrder")()
        }
    }]
  })
});
