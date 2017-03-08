import Service from 'ember-service';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Service.extend({
  ajax: inject('cform-ajax'),
  orderInfo: inject('order-info'),
  data: {},

  start(currentRole) {
    let data = {};
    switch (currentRole) {
      case "管理员":
      case "老板":
        data = {
          carTypes: this._getCarTypes(),
          exteriorColors: this._getExteriorColors(),
          interiorColors: this._getInteriorColors(),
          defaultWheels: this._getDefaultWheels(),
          cars: this._getCars(),
          allAccessories: this._getAllAccessories()
        }
        break;
      case "销售经理":
      case "普通销售":
        data = {
          carTypes: this._getCarTypes(),
          exteriorColors: this._getExteriorColors(),
          interiorColors: this._getInteriorColors(),
          defaultWheels: this._getDefaultWheels(),
          cars: this._getCars(),
          allAccessories: this._getAllAccessories()
        }
        break;
      case "库管":
        data = {
          carTypes: this._getCarTypes(),
          cars: this._getCars()
        }
        break;
    }

    return RSVP.hash(data)
      .then(data => {
        const orderInfo = get(this, "orderInfo");
        if (data.allAccessories) {
          let generalAccessories = data.allAccessories.filter(accessory => accessory.suitableForCar === "");

          const carTypeId = data.carTypes[0].id;

          orderInfo.initData(Object.assign({}, data, {
            selected: {
              car: data.cars[0],
              carTypeId,
              exteriors: [],
              interiors: [],
              carAccessories: [],
              accessories: []
            },
            filteredCarTypes: data.cars.filterBy('carType.id', carTypeId),
            filteredConfigs: [],
            filteredExteriorColors: [],
            filteredWheels: [],
            generalAccessories,
            formValue: {}
          }));

          return data;
        }
      });
  },

  _getCarTypes() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/classify/getCarType`)
      .then(response => response.rows);
  },

  _getCars() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/sales/getCarRelation`)
      .then(response => response.rows);
  },

  _getExteriorColors() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/classify/getOutsideColor`)
      .then(response => response.rows);
  },

  _getInteriorColors() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/classify/getInsideColor`)
      .then(response => response.rows);
  },

  _getDefaultWheels() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/classify/getHub`)
      .then(response => response.rows);
  },

  _getAllAccessories() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/sales/getAccessories`)
      .then(response => response.rows);
  }
});
