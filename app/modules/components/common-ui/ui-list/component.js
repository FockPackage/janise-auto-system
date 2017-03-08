import Component from 'ember-component';
import Swiper from 'swiper';
import { scheduleOnce } from 'ember-runloop';
import imagesLoaded from 'imagesLoaded';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'li',
  classNames: ['ui-list'],

  attributeBindings: ['type', 'id', 'alt'],
  id: null,
  alt: null,
  slide: 'list-swiper',

  deliveryComputed: computed("delivery", function() {
    const delivery = get(this, "delivery");
    return delivery ? delivery : 0;
  }),

  swiper(){
    const element = this.element.getElementsByClassName('list-swiper')[0];
    new Swiper(element, {

    });
  },

  didInsertElement(){
    imagesLoaded(this.element, () => {
      scheduleOnce('afterRender', this, 'swiper');
    });
  }
});
