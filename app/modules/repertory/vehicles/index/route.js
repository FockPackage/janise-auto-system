import Route from 'ember-route';
import set, { setProperties } from 'ember-metal/set';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  orderInfo: inject('order-info'),

  model() {
    return RSVP.hash({
      vehicles: this._getVehicles(),
      searchTypes: [
        { type: 'text', text: "合同编号" },
        { type: 'date', text: "日期范围" },
        { type: 'text', text: "汽车类型" },
        { type: 'text', text: "车辆识别码" }
      ],
      currentSearchType: { type: 'text', text: "合同编号" },
      isShow: { carIdentify: false }
    });
  },

  afterModel(model) {
    this._super(...arguments);
    set(model, "all", model.vehicles);
  },

  _getVehicles() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/carWarehouse/getCarWarehouse`)
      .then(response => {
        if (response.rows) {
          return response.rows.map(car => {
            const realCar = car.carRelation;
            car.label = `${realCar.carType.meaning} ${realCar.carYear.meaning}
              ${realCar.carConfig.meaning} ${realCar.carOutsideColor.meaning}
              ${realCar.carInsideColor.meaning} ${realCar.carHub.meaning}`

            const dateTimeArray = car.createdAt.split("T");
            const timeArray = dateTimeArray[1].split(':');
            car.dateTime =  `${dateTimeArray[0]} ${timeArray[0]}:${timeArray[1]}`;

            return car;
          });
        } else {
          return [];
        }
      });
  },

  actions: {
    changeSearchType(searchType) {
      set(this, 'currentModel.currentSearchType', searchType);
    },

    searchVehicles(type, params) {
      if (!params.text) {
        return set(this, 'currentModel.vehicles', get(this, "currentModel.all"));
      }

      let data = {};
      switch (type) {
        case "合同编号":
          data.orderCode = params.text;
          set(this, "orderCode", params.text);
          break;
        case "日期范围":
          data.date = params.text.replace(' - ', ',');
          break;
        case "汽车类型":
          data.carType = params.text;
          break;
        case "车辆识别码":
          data.carIdentify = params.text;
          break;
      }

      if (data.orderCode) {
        this.get('ajax').request(`${config.API_HOST}/api/v2/carWarehouse/getDeliveryList`, {
          data: data
        })
          .then(response => {
            if (response.rows) {
              const vehicles = response.rows.map(car => {
                const realCar = car.carRelation;
                car.delivery = true;
                car.label = `${realCar.carType.meaning} ${realCar.carYear.meaning}
                  ${realCar.carConfig.meaning} ${realCar.carOutsideColor.meaning}
                  ${realCar.carInsideColor.meaning} ${realCar.carHub.meaning}`

                return car;
              });
              set(this, "currentModel.vehicles", vehicles);
            } else {
              this.get('notification').error('没有任何关于该订单的信息');
            }
          });
      } else {
        this.get('ajax').request(`${config.API_HOST}/api/v2/carWarehouse/getCarWarehouse`, {
          data: data
        })
          .then(response => {
            if (response.rows) {
              const vehicles = response.rows.map(car => {
                const realCar = car.carRelation;
                car.label = `${realCar.carType.meaning} ${realCar.carYear.meaning}
                  ${realCar.carConfig.meaning} ${realCar.carOutsideColor.meaning}
                  ${realCar.carInsideColor.meaning} ${realCar.carHub.meaning}`

                const dateTimeArray = car.createdAt.split("T");
                const timeArray = dateTimeArray[1].split(':');
                car.dateTime =  `${dateTimeArray[0]} ${timeArray[0]}:${timeArray[1]}`;

                return car;
              });
              set(this, "currentModel.vehicles", vehicles);
            }
          });
      }
    },

    goTo(car) {
      const formValue = {
        id: car.id,
        carIdentify: car.carIdentify,
        carTypeId: car.carRelation.carTypeId,
        configId: car.carRelation.carConfigId,
        yearId: car.carRelation.carYearId,
        exteriorColorId: car.carRelation.carOutsideColorId,
        carId: car.carRelationId,
        description: car.description,
        canEdit: true
      }

      set(this.modelFor('repertory'), "formValue", formValue);
      this.transitionTo('repertory.vehicles.warehouse');
    },

    toggleStore(carId, stockStatus) {
      this.get('ajax').put(`${config.API_HOST}/api/v2/carWarehouse/updateCarWarehouse/${carId}`, {
        data: { stockStatus: stockStatus == 1 ? 0 : 1 }
      })
        .then(() => {
          const car = get(this, "currentModel.vehicles").findBy("id", carId);

          set(car, "stockStatus", stockStatus == 1 ? 0 : 1);
        })
        .catch(() => this.get('notification').error("设定失败"));
    },

    toggleCanSell(carId, closeStatus) {
      this.get('ajax').put(`${config.API_HOST}/api/v2/price/updateCarConfig/${carId}`, {
        data: { closeStatus: !closeStatus }
      })
        .then(() => {
          const car = get(this, "currentModel.vehicles").findBy("id", carId);

          set(car, "closeStatus", !closeStatus);
        })
        .catch(() => this.get('notification').error("设定失败"));
    },

    updatePrice(id, price) {
      let data = {}

      if (price.carPrice2) {
        data = { carPrice2: price.carPrice2 }
      }
      if (price.carPrice3) {
        data = price
      }

      this.get('ajax').put(`${config.API_HOST}/api/v2/price/updateCarSelingPrice/${id}`, {
        data: data
      })
        .then(() => {
          this.get("notification").success("价格设定成功");
          const car = get(this, "currentModel.vehicles").findBy("id", id);
          setProperties(car, data);
        })
        .catch(() => this.get("notification").error("价格设定失败，请重新设定"));
    },

    deliveryCar() {
      this.get('ajax').post(`${config.API_HOST}/api/v2/carWarehouse/setStockOut`, {
        data: { orderCode: get(this, "orderCode") }
      })
        .then(response => {
          set(this, 'currentModel.carIdentify', response.row.carIndentify);

          this.toggleProperty('currentModel.isShow.carIdentify');

        })
        .catch(error => {
          if (error.errors[0].detail.message == "understock") {
            this.get("notification").error("库存不足，出库失败");
          }
          console.log(error);  //eslint-disable-line no-console
        });
    },

    getAccessories() {
      this._getVehicles()
        .then(cars => {
          this.toggleProperty('currentModel.isShow.carIdentify');
          set(this, "currentModel.vehicles", cars)
        });
    },

    none() {}
  }
});
