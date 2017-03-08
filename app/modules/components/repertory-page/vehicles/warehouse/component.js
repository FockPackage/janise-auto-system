import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import config from 'auto-service-system/config/environment';
import set from 'ember-metal/set';
import inject from 'ember-service/inject';

export default Component.extend({
  ajax: inject('cform-ajax'),

  configs: computed('formValue.carTypeId', function () {
    let configs = [];
    get(this, "cars")
      .filterBy('carTypeId', get(this, "formValue.carTypeId"))
      .forEach(car => {
        if (!configs.findBy('carConfigId', car.carConfigId)) {
          configs.push(car);
        }
      });
    return configs;
  }),

  years: computed('formValue.configId', function () {
    let years = [];
    get(this, "cars")
      .filterBy('carTypeId', get(this, "formValue.carTypeId"))
      .filterBy("carConfigId", get(this, "formValue.configId"))
      .forEach(car => {
        if (!years.findBy('carYearId', car.carYearId)) {
          years.push(car);
        }
      });
    return years;
  }),

  filteredExteriorColors: computed('formValue.yearId', function () {
    let filteredExteriorColors = [];
    get(this, "cars")
      .filterBy('carTypeId', get(this, "formValue.carTypeId"))
      .filterBy("carConfigId", get(this, "formValue.configId"))
      .filterBy("carYearId", get(this, "formValue.yearId"))
      .forEach(car => {
        if (!filteredExteriorColors.findBy('id', car.carOutsideColorId)) {
          filteredExteriorColors.push(car.carOutsideColor);
        }
      });
    return filteredExteriorColors;
  }),

  filteredInteriorColors: computed('formValue.exteriorColorId', function () {
    let filteredInteriorColors = [];
    get(this, "cars")
      .filterBy('carTypeId', get(this, "formValue.carTypeId"))
      .filterBy("carConfigId", get(this, "formValue.configId"))
      .filterBy("carYearId", get(this, "formValue.yearId"))
      .filterBy("carOutsideColorId", get(this, "formValue.exteriorColorId"))
      .forEach(car => {
        filteredInteriorColors.push(car);
      });
    return filteredInteriorColors;
  }),

  alert: {},

  carType_MobiConfig: computed(function () {
    return {
      onSet: (value) => {
        const carTypes = get(this, 'carTypes');
        const carTypeId = carTypes.filterBy('meaning', value.valueText)[0].id;
        console.log(carTypeId);
        get(this, 'toggleSelect')('carTypeId', carTypeId);
        console.log(get(this, 'carTypes'));
      }
    }
  }),

  carConfig_MobiConfig: computed('configs', function () {
    return {
      onSet: (value) => {
        let carConfigId = '';
        get(this, 'configs').forEach((item)=>{
          if(item.carConfig.meaning == value.valueText){
            return carConfigId = item.carConfigId;
          }
        });
        get(this, 'toggleSelect')('configId', carConfigId);
      }
    }
  }),

  year_MobiConfig: computed(function () {
    return {
      onSet: (value) => {
        let carYearId = '';
        get(this, 'years').forEach((item)=>{
          if(item.carYear.meaning == value.valueText){
            return carYearId = item.carYearId;
          }
        });
        console.log(carYearId);
        get(this, 'toggleSelect')('yearId', carYearId);
      }
    }
  }),

  exteriorColor_MobiConfig: computed(function () {
    return {
      onSet: (value) => {
        const exteriorColors = get(this, 'filteredExteriorColors');
        const exteriorColorId = exteriorColors.filterBy('meaning', value.valueText)[0].id;
        console.log(exteriorColorId);
        get(this, 'toggleSelect')('exteriorColorId', exteriorColorId);
      }
    }
  }),

  insideColor_MobiConfig: computed(function () {
    return {
      onSet: (value) => {
        const carInsideColors = get(this, 'filteredInteriorColors').map((item)=>{
          return item.carInsideColor;
        });
        const carId = carInsideColors.filterBy('meaning', value.valueText)[0].id;
        console.log(carId);
        get(this, 'toggleSelect')('carId', carId);
      }
    }
  }),

  actions: {
    searchCar(id) {
      if (!id) return;

      this.get('ajax').request(`${config.API_HOST}/api/v2/carWarehouse/getCarWarehouse`, {
        data: {carIdentify: id}
      })
        .then(response => {
          if (response.rows.length) {
            set(this, "alert.created", true);
          } else {
            set(this, "alert.created", false);
          }
        });
    }
  }
});
