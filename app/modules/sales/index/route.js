import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';
import inject from 'ember-service/inject';
import config from 'auto-service-system/config/environment';
import get from 'ember-metal/get';

export default Route.extend({
  intl: inject(),
  orderInfo: inject('order-info'),
  ajax: inject('cform-ajax'),

  // setupController() {
  //   setProperties(this.controllerFor('application'), {
  //     singlePage: false,
  //     navClassName: 'nav',
  //     showLogo: false,
  //     defaultMenu: false,
  //     primaryComponent: 'sales-page/navbar',
  //     hasSubnav: true
  //   });
  //
  //   this._super(...arguments);
  // },

  // renderTemplate() {
  //   this.render('sales/subnav', { outlet: 'subnav', into: 'application' });
  //   this._super(...arguments);
  // },

  // beforeModel(transition) {
  //   if (!get(this, "permission").hasPermission("SALE_MODULE")) {
  //     return this.transitionTo('manage');
  //   }
  //   if (!get(this, "orderInfo._data") && transition.targetName != 'sales.car-types') {
  //     return this.transitionTo('sales.car-types');
  //   }
  // },

  model() {
    const orderInfo = get(this, "orderInfo");

    return {
      carTypes: orderInfo.carTypes,
      exteriorColors: orderInfo.exteriorColors,
      interiorColors: orderInfo.interiorColors,
      defaultWheels: orderInfo.defaultWheels,
      cars: orderInfo.cars,
      allAccessories: orderInfo.allAccessories
    };
  },

  afterModel(model) {
    const orderInfo = get(this, "orderInfo");
    console.log(orderInfo);
    const _data = orderInfo._data;
    let generalAccessories = orderInfo.generalAccessories;

    let exteriors = [];
    let interiors = [];
    let carAccessories = [];
    let accessories = [];

    if (_data) {
      const car = model.cars.findBy('id', _data.carRelationId);
      const filteredCarTypes = model.cars.filterBy('carType.id', car.carType.id);
      const filteredConfigs = filteredCarTypes.filterBy('carConfig.id', car.carConfig.id);
      const filteredExteriorColors = filteredConfigs.filterBy('carOutsideColor.id', car.carOutsideColor.id);
      const filteredInteriorColors = filteredExteriorColors.filterBy('carInsideColor.id', car.carInsideColor.id);

      _data.orderItem.forEach(item => {
        if (item.accessoriesId) {
          const accessory = model.allAccessories.findBy('id', item.accessoriesId)
            || generalAccessories.findBy('id', item.accessoriesId);
          if (accessory.suitableForCar) {
            switch (accessory.fitType.meaning) {
              case "外部配件":
                exteriors.push({
                  id: item.accessoriesId, count: item.itemNumber, price: item.salePrice
                });
                break;
              case "内部配件":
                interiors.push({
                  id: item.accessoriesId, count: item.itemNumber, price: item.salePrice
                });
                break;
              case "4S店":
                carAccessories.push({
                  id: item.accessoriesId, count: item.itemNumber, price: item.salePrice
                });
                break;
            }
          } else {
            accessories.push({
              id: item.accessoriesId, count: item.itemNumber, price: item.salePrice
            });
          }
        }
      });

      const client = _data.custom;
      const formValue = {
        id: client.id,
        name: client.customName,
        company: client.company,
        address: client.address,
        postal: client.postal,
        mobile: client.mobile,
        email: client.email,
        description: client.description
      }

      orderInfo.initData(Object.assign({}, model, {
        selected: {
          car,
          carTypeId: car.carType.id,
          configId: car.carConfig.id,
          exteriorColorId: car.carOutsideColor.id,
          interiorColorId: car.carInsideColor.id,
          exteriors,
          interiors,
          carAccessories,
          accessories
        },
        filteredCarTypes,
        filteredConfigs,
        filteredExteriorColors,
        filteredInteriorColors,
        generalAccessories,
        isBuyInsurance: _data.isInsurance,
        isInstallment: _data.isLoanPrice,
        isBuyCar: _data.isBuyCar,
        isBuyAccessory: _data.isBuyAccessory,
        carNetPrice: _data.carPrice,
        allAccessoriesNetPrice: _data.fitPrice,
        formValue,
        orderStatus: _data.orderStatus
      }));
    } else {
      // const carTypeId = model.carTypes[0].id;
      const carTypes = model.carTypes.map(carType => {
        let carConfigs = [];
        const filteredCarTypes = model.cars.filterBy('carType.id', carType.id);

        filteredCarTypes.forEach(car => {
          if (!carConfigs.findBy('id', car.carConfig.id)) {
            carConfigs.push(car.carConfig);
          }
        });

        carType.carConfigs = carConfigs.map(carConfig => {
          let exteriorColors = [];
          const filteredConfigs = filteredCarTypes.filterBy('carConfig.id', carConfig.id);

          filteredConfigs.forEach(car => {
            if (!exteriorColors.findBy('id', car.carOutsideColor.id)) {
              exteriorColors.push(car.carOutsideColor);
            }
          });

          carConfig.exteriorColors = exteriorColors.map(exteriorColor => {
            let interiorColors = [];
            const filteredExteriorColors = filteredConfigs.filterBy('carOutsideColor.id', exteriorColor.id);

            filteredExteriorColors.forEach(car => {
              if (!interiorColors.findBy('id', car.carInsideColor.id)) {
                interiorColors.push(car.carInsideColor);
              }
            });

            exteriorColor.interiorColors = interiorColors.map(interiorColor => {
              interiorColor.carId = filteredExteriorColors.filterBy('carInsideColor.id', interiorColor.id)[0].id;
              return interiorColor;
            })

            return exteriorColor;
          });

          return carConfig;
        });

        return carType;
      });

      orderInfo.initData(Object.assign({}, model, {
        carTypes,
        selected: {
          // carTypeId,
          exteriors,
          interiors,
          carAccessories,
          accessories
        },
        allAccessoriesOfficalPrice: 0,
        allAccessoriesNetPrice: 0,
        carNetPrice: 0,
        filteredCarTypes: [],
        filteredConfigs: [],
        filteredExteriorColors: [],
        filteredWheels: [],
        generalAccessories,
        formValue: {},
        orderStatus: 0
      }));
    }
  },

  isAllowContinue(targetName) {
    const selected = get(this, "orderInfo.selected");

    switch (targetName) {
      case "sales.color":
        if (selected.configId) return true;
        return false;
      case "sales.exterior":
      case "sales.interior":
      case "sales.accessories":
      case "sales.summary":
        if (selected.interiorColorId) return true;
        return false;
      default:
        return true;
    }
  },

  actions: {
    // willTransition(transition) {
    //   this._super(...arguments);
    //
    //   if (!this.isAllowContinue(transition.targetName)) {
    //     this.get('notification').error(this.get('intl').t('sales.trims.notification.error'));
    //     transition.abort();
    //   }
    // },

    goToSummary() {
      this.transitionTo("sales.summary");
    }
  }
});
