import Route from 'ember-route';
import set, { setProperties } from 'ember-metal/set';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  orderInfo: inject('order-info'),

  model() {
    const orderInfo = get(this, "orderInfo");

    return {
      formValue: this.modelFor('repertory').formValue,
      carTypes: orderInfo.carTypes,
      cars: orderInfo.cars
    };
  },


  actions: {
    toggleSelect(type, value) {
      switch (type) {
        case "carTypeMeanings": {
          const carTypeMeanings = get(this.modelFor('repertory'), "formValue.carTypeMeanings");
          if (carTypeMeanings) {
            const meaning = get(this.modelFor('repertory'), "formValue.carTypeMeaning");

            if (meaning == value) {
              set(
                this.modelFor('repertory'),
                "formValue.carTypeMeanings",
                carTypeMeanings.filter(carTypeMeaning => carTypeMeaning.meaning != value)
              );
              set(this.modelFor('repertory'), "formValue.carTypeMeaning", "");
            } else {

              set(this.modelFor('repertory'), "formValue.carTypeMeanings", [...carTypeMeanings, {
                meaning: value,
                configMeanings: []
              }]);

              set(this.modelFor('repertory'), "formValue.carTypeMeaning", value);
            }
          } else {
            set(this.modelFor('repertory'), "formValue.carTypeMeanings", [{
              meaning: value,
              configMeanings: []
            }]);
            set(this.modelFor('repertory'), "formValue.carTypeMeaning", value);
          }
          break;
        }
        case "configMeanings": {
          const meaning = get(this.modelFor('repertory'), "formValue.carTypeMeaning");
          const carType = get(this.modelFor('repertory'), "formValue.carTypeMeanings")
            .findBy("meaning", meaning);

          if (carType.configMeanings.includes(value)) {
            set(carType, "configMeanings", carType.configMeanings.filter(meaning => meaning != value));
          } else {
            set(carType, "configMeanings", [...carType.configMeanings, value]);
          }
        }
      }
    },

    searchAccessory(id) {
      if (!id) return;

      this.get('ajax').request(`${config.API_HOST}/api/v2/accessories/getAccessories`, {
        data: { fitCode: id }
      })
        .then(response => {
          if (response.rows) {
            const accessory = response.rows[0];
            const formValue = {
              id: accessory.id,
              fitCode: accessory.fitCode,
              fitName: accessory.fitName,
              carTypeMeanings: accessory.suitableForCar ? JSON.parse(accessory.suitableForCar) : [],
              description: accessory.description,
              canEdit: false,
              isNew: true
            }

            set(this.modelFor('repertory'), "formValue", formValue);
            set(this, "currentModel.formValue", formValue);

            this.get('ajax').request(`${config.API_HOST}/api/v2/fitWarehouse/getFitWarehouse`, {
              data: { fitCode: id }
            })
              .then(response => {
                if (response.rows) {
                  set(this.modelFor('repertory'), "formValue.list", response.rows);
                  set(this, "currentModel.formValue.list", response.rows);
                } else {
                  set(this, "currentModel.formValue.list", []);
                }
              })
              .catch(() => set(this, "currentModel.formValue.list", []));
          } else {
            set(this, "currentModel.formValue.canEdit", true);
            set(this, "currentModel.formValue.isNew", true);
          }
        })
        .catch(() => {
          set(this, "currentModel.formValue.isNew", true)
        });
    },

    setAccessoryCount(count, id) {
      if (id) {
        const accessory = get(this.modelFor('repertory'), "formValue.list").findBy("id", id);
        setProperties(accessory, {
          fitNumber: count,
          isModify: true
        });
      } else {
        set(this.modelFor('repertory'), "formValue.fitNumber", count);
      }
    },

    toggleAllowable(id, value) {
      const accessory = get(this.modelFor('repertory'), "formValue.list").findBy("id", id);
      setProperties(accessory, {
        closeStatus: !value,
        isModify: true
      });
    }
  }
});
