import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import $ from 'jquery';

export default Component.extend({
  mobiConfig: computed(function() {
    return {
      onInit: (_, inst) => {
      },
      onItemTap: event => {
        if (event.index != -1) {
          const type = event.target.attributes.getNamedItem("data-step").value;
          const dataId = event.target.attributes.getNamedItem("data-id").value;

          switch (type) {
            case "car": {
              get(this, "orderInfo").selectCar(dataId);
              break;
            }
            case "exteriorAccessory": {
              console.log(dataId);
              break;
            }
            case "interiorAccessory": {
              console.log(dataId);
              break;
            }
            case "carAccessory": {
              const accessory = get(this, "orderInfo.carAccessories").findBy("id", dataId);
              get(this, "orderInfo").toggleAccessory(accessory.id, "carAccessories", accessory.salePrice);
              break;
            }
          }
        }
      }
    }
  }),

  orderInfo: inject(),

  isSelectedCar: computed("orderInfo.selected.car.id", function() {
    const car = get(this, "orderInfo.selected.car");
    return car ? true : false;
  })
});
