import Route from 'ember-route';
import set from 'ember-metal/set';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),

  model() {
    return RSVP.hash({
      accessories: this._getAccessories(),
      searchTypes: [
        { type: 'text', text: "合同编号" },
        { type: 'text', text: "汽车类型" },
        { type: 'text', text: "配件编号" },
        { type: 'text', text: "配件名称" }
      ],
      currentSearchType: { type: 'text', text: "合同编号" }
    });
  },

  afterModel(model) {
    this._super(...arguments);
    set(model, "all", model.accessories);
  },

  _getAccessories() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/fitWarehouse/getAccessoriesAndSum`)
      .then(response => {
        if (response.rows) {
          return response.rows.map(accessory => {
            const dateTimeArray = accessory.createdAt.split("T");
            const timeArray = dateTimeArray[1].split(':');
            accessory.dateTime =  `${dateTimeArray[0]} ${timeArray[0]}:${timeArray[1]}`;

            return accessory;
          })
        } else {
          return [];
        }
      });
  },

  actions: {
    changeSearchType(searchType) {
      set(this, 'currentModel.currentSearchType', searchType);
    },

    searchAccessory(type, params) {
      if (!params.text) {
        return set(this, 'currentModel.accessories', get(this, "currentModel.all"));
      }

      let data = {};
      switch (type) {
        case "合同编号":
          data.orderCode = params.text;
          set(this, "orderCode", params.text);
          break;
        case "汽车类型":
          data.carType = params.text;
          break;
        case "配件编号":
          data.fitCode = params.text;
          break;
        case "配件名称":
          data.fitName = params.text;
          break;
      }

      if (data.orderCode) {
        this.get('ajax').request(`${config.API_HOST}/api/v2/fitWarehouse/getDeliveryList`, {
          data: data
        })
          .then(response => {
            set(this, "currentModel.accessories", response.rows ? response.rows : []);
          });
      } else {
        this.get('ajax').request(`${config.API_HOST}/api/v2/fitWarehouse/getFitWarehouse`, {
          data: data
        })
          .then(response => {
            if (response.rows) {
              const accessories = response.rows.map(accessory => {
                const dateTimeArray = accessory.createdAt.split("T");
                const timeArray = dateTimeArray[1].split(':');
                accessory.dateTime =  `${dateTimeArray[0]} ${timeArray[0]}:${timeArray[1]}`;

                return accessory;
              })
              set(this, "currentModel.accessories", accessories);
            } else {
              set(this, "currentModel.accessories", []);
            }
          });
      }
    },

    goTo(accessory) {
      this.get('ajax').request(`${config.API_HOST}/api/v2/fitWarehouse/getFitWarehouse`, {
        data: { fitCode: accessory.fitCode }
      })
        .then(response => {
          if (response.rows) {
            const formValue = {
              id: accessory.id,
              fitCode: accessory.fitCode,
              fitName: accessory.fitName,
              carTypeMeanings: accessory.suitableForCar ? JSON.parse(accessory.suitableForCar) : [],
              description: accessory.description,
              list: response.rows,
              canEdit: true
            }
            set(this.modelFor('repertory'), "formValue", formValue);
            set(this, "currentModel.formValue", formValue);
          } else {
            const formValue = {
              id: accessory.id,
              fitCode: accessory.fitCode,
              fitName: accessory.fitName,
              carTypeMeanings: accessory.suitableForCar ? JSON.parse(accessory.suitableForCar) : [],
              description: accessory.description,
              list: [],
              canEdit: true
            }
            set(this.modelFor('repertory'), "formValue", formValue);
            set(this, "currentModel.formValue", formValue);
          }
          this.transitionTo('repertory.accessories.warehouse');
        })
        .catch(() => this.get('notification').error("跳转失败，请重新操作"));
    },

    // toggleWarhouse(accessoryId, stockStatus) {
    //   this.get('ajax').put(`${config.API_HOST}/api/v2/accessories/updateAccessories/${accessoryId}`, {
    //     data: { stockStatus: stockStatus == 1 ? 0 : 1 }
    //   })
    //     .then(() => {
    //       const accessory = get(this, "currentModel.accessories").findBy("id", accessoryId);
    //
    //       set(accessory, "stockStatus", stockStatus == 1 ? 0 : 1 );
    //     })
    //     .catch(() => this.get('notification').error("设定失败"));
    // },

    toggleCanSell(accessoryId, closeStatus) {
      this.get('ajax').put(`${config.API_HOST}/api/v2/accessories/updateAccessories/${accessoryId}`, {
        data: { closeStatus: !closeStatus }
      })
        .then(() => {
          const accessory = get(this, "currentModel.accessories").findBy("id", accessoryId);

          set(accessory, "closeStatus", !closeStatus);
        })
        .catch(() => this.get('notification').error("设定失败"));
    },

    updatePrice(id) {
      const data = {
        salePrice: 1
      }

      this.get('ajax').put(`${config.API_HOST}/api/v2/price/updateFitSelingPric/${id}`, {
        data: data
      })
        .then(() => this.get("notification").success("价格设定成功"))
        .catch(() => this.get("notification").error("价格设定失败，请重新设定"));
    },

    deliveryAccessory(id) {
      this.get('ajax').post(`${config.API_HOST}/api/v2/fitWarehouse/setStockOut`, {
        data: { orderCode: get(this, "orderCode"), accessoriesId: id }
      })
        .then(() => {
          this.get("notification").success("出库成功");
          const accessories = get(this, "currentModel.accessories").filter(accessory => accessory.accessoriesId != id);
          if (accessories.length) {
            set(this, "currentModel.accessories", accessories);
          } else {
            this.get('ajax').request(`${config.API_HOST}/api/v2/fitWarehouse/getAccessoriesAndSum`)
              .then(response => set(this, "currentModel.accessories", response.rows ? response.rows : []));
          }
        })
        .catch(error => {
          if (error.errors[0].detail.message == "understock") {
            this.get("notification").error("库存不足，出库失败");
          }
          console.log(error);  //eslint-disable-line no-console
        });
    },

    getAccessories(params) {
      this.get('ajax').request(`${config.API_HOST}/api/v2/accessories/getAccessories`, {
        data: params
      })
        .then(response => {
          const accessory = get(this, 'currentModel.accessories').findBy('fitCode', params.fitCode);
          set(accessory, "closeStatus", response.rows[0].closeStatus);
        })
    }
  }
});
