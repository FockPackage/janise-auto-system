import Ember from 'ember';
import Swiper from 'swiper';
import device from "device";
import {scheduleOnce} from 'ember-runloop';

export default Ember.Component.extend({
  swiper(){
    const element = this.element.getElementsByClassName('vehicles-swiper')[0];
    new Swiper(element, {
        pagination: '.vehicles-pagination',
        slidesPerView: device.mobile() ? 2 : 5,
        spaceBetween: device.mobile() ? 10 : 30,
        breakpoints: {
          1200: {
            slidesPerView: 5,
          },
          990: {
            slidesPerView: 3,
          },
          767: {
            slidesPerView: 2,
          }
        }
      }
    );
  },

  didInsertElement(){
    scheduleOnce('afterRender', this, 'swiper');
  }
});
