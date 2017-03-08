import Component from 'ember-component';
import Swiper from 'swiper';
import device from "device";

import inject from 'ember-service/inject';


export default Component.extend({
  handleSelect: inject('handle-select'),
  handleSwiper(){
    const element = this.element.getElementsByClassName('trims-container')[0];
    this.swiper = new Swiper(element, {
        pagination: '.trims-pagination',
        spaceBetween: 30,
        slidesPerView: device.mobile() ? 1 : 3,
        breakpoints: {
          1200: {
            slidesPerView: 3,
          },
          990: {
            slidesPerView: 2,
          },
          479: {
            slidesPerView: 1,
          },
        },
      }
    );
  },

  didRender(){
    this.swiper && this.swiper.destroy(true, false);
    this.handleSwiper();
  }
});
