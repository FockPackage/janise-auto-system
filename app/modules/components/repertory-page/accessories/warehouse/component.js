import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import set from 'ember-metal/set';
import mobiscroll from 'mobiscroll';

export default Component.extend({
  configs: computed('formValue.carTypeMeaning', function() {
    let configs = [];
    get(this, "cars")
      .filterBy('carType.meaning', get(this, "formValue.carTypeMeaning"))
      .forEach(car => {
        if (!configs.findBy('carConfig.meaning', car.carConfig.meaning)) {
          const carTypeMeaning = get(this, "formValue.carTypeMeanings")
            .findBy("meaning", car.carType.meaning);

          if (carTypeMeaning && carTypeMeaning.configMeanings.includes(car.carConfig.meaning)) {
            set(car, "checked", true);
          } else {
            set(car, "checked", false);
          }
          configs.push(car);
        }
      });
    return configs;
  }),

  carTypesComputed: computed("formValue.fitCode", function() {
    const carTypeMeanings =  get(this, "formValue.carTypeMeanings");
    return get(this, "carTypes").map(carType => {
      if (carTypeMeanings) {
        const carTypeMeaning = carTypeMeanings.findBy("meaning", carType.meaning);
        if (carTypeMeaning) {
          const length = carTypeMeaning.configMeanings.length;
          if (length == 1) {
            set(carType, "tagTrims", carTypeMeaning.configMeanings[0]);
          } else if (length == get(this, "configs").length) {
            set(carType, "tagTrims", "ALL");
          } else if (length > 1){
            set(carType, "tagTrims", "MULTI");
          }
        }
      }
      return carType;
    });
  }),

  didInsertElement() {
    this._super(...arguments);

    new mobiscroll.numpad('#accessory-new', {
      theme: 'cadillac',
      lang: "zh",
      preset: 'decimal',
      scale: 0,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      min: 0,
      max: 10000000000,
      onSet: event => {
        get(this, 'setAccessoryCount') && get(this, 'setAccessoryCount')(event.valueText);
      },
    });
  },

  didRender() {
    this._super(...arguments);


    // TODO: 不要渲染不需要的 mobiscroll
    const canEdit = get(this, "formValue.canEdit");

    this[`mobi-new`] = new mobiscroll.numpad(`#accessory-new`, {
      theme: 'cadillac',
      lang: "zh",
      preset: 'decimal',
      scale: 0,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      min: 0,
      max: 10000000000,
      onSet: event => {
        get(this,'setAccessoryCount') && get(this,'setAccessoryCount')(event.valueText);
      }
    });

    const list = get(this, "formValue.list");

    if (list) {
      list.forEach(accessory => {
        if (!this[`mobi${accessory.id}`]) {
          this[`mobi${accessory.id}`] = new mobiscroll.numpad(`#accessory-${accessory.id}`, {
            theme: 'cadillac',
            lang: "zh",
            preset: 'decimal',
            scale: 0,
            decimalSeparator: '.',
            thousandsSeparator: ',',
            min: 0,
            max: 10000000000,
            onSet: event => {
              get(this,'setAccessoryCount') && get(this,'setAccessoryCount')(event.valueText, accessory.id);
            }
          });
        }
      });
    }
  }
});
