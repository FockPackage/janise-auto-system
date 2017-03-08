import Route from 'ember-route';
import RSVP from 'rsvp';
import { setProperties } from 'ember-metal/set';
import config from 'auto-service-system/config/environment';
import get from 'ember-metal/get';
import inject from 'ember-service/inject';
import set from 'ember-metal/set';

export default Route.extend({
  ajax: inject('cform-ajax'),

  setupController() {
    setProperties(this.controllerFor('application'), {
      singlePage: false,
      navClassName: 'nav',
      showLogo: false,
      defaultMenu: false,
      primaryComponent: 'common-ui/navbar',
      hasSubnav: true
    });

    this._super(...arguments);
  },

  renderTemplate() {
    this.render('repertory/subnav', { outlet: 'subnav', into: 'application' });
    this._super(...arguments);
  },

  beforeModel() {
    this._super(...arguments);

    if (!get(this, "permission").hasPermission("CAR_WAREHOUSE_MODULE")) {
      return this.transitionTo('manage');
    }
  },

  model() {
    return { formValue: {} };
  },

  _createAccessory(params) {
    const suitableForCar = params.carTypeMeanings.map(carTypeMeaning => {
      if (carTypeMeaning.configMeanings.length > 0) {
        return carTypeMeaning;
      }
    });

    return this.get('ajax').post(`${config.API_HOST}/api/v2/fitWarehouse/postFitWarehouse`, {
      data: {
        fitCode: params.fitCode,
        fitName: params.fitName,
        fitNumber: params.fitNumber,
        suitableForCar: JSON.stringify(suitableForCar),
        description: params.description
      }
    })
      .then(() => {
        this.transitionTo('repertory.accessories.index');
        set(this, "currentModel.formValue", {});
      })
      .catch(() => this.get('notification').error('信息不完整，请继续输入！'));  // eslint-disable-line no-console
  },

  _updateAccessory(params) {
    return this.get('ajax').post(`${config.API_HOST}/api/v2/fitWarehouse/postFitWarehouse`, {
      data: {
        fitCode: params.fitCode,
        fitNumber: params.fitNumber,
        description: params.description
      }
    })
      .then(() => {
        this.transitionTo('repertory.accessories.index');
        set(this, "currentModel.formValue", {});
      })
      .catch(() => this.get('notification').error('信息不完整，请继续输入！'));  // eslint-disable-line no-console
  },

  _createCar(params) {
    if (!params.carIdentify || !params.carId) return this.get('notification').error('信息不完整，请继续输入！');
    return this.get('ajax').post(`${config.API_HOST}/api/v2/carWarehouse/postCarWarehouse`, {
      data: {
        carIdentify: params.carIdentify,
        carRelationId: params.carId,
        description: params.description
      }
    })
      .then(() => {
        this.transitionTo('repertory.vehicles.index');
        set(this, "currentModel.formValue", {});
      })
      .catch(error => console.log(error));  // eslint-disable-line no-console
  },

  _updateCar(params) {
    if (!params.carIdentify || !params.carId) return this.get('notification').error('信息不完整，请继续输入！');
    return this.get('ajax').put(`${config.API_HOST}/api/v2/carWarehouse/updateCarWarehouse/${params.id}`, {
      data: {
        // carIdentify: params.carIdentify,
        carRelationId: params.carId,
        description: params.description
      }
    })
    .then(() => {
      this.transitionTo('repertory.vehicles.index');
      set(this, "currentModel.formValue", {});
    })
      .catch(error => console.log(error));  // eslint-disable-line no-console
  },

  _updateAccessoryList(params) {
    let suitableForCar = [];
    if (params.carTypeMeanings) {
      suitableForCar = params.carTypeMeanings.map(carTypeMeaning => {
        if (carTypeMeaning.configMeanings.length > 0) {
          return carTypeMeaning;
        }
      });
    }

    this.get('ajax').put(`${config.API_HOST}/api/v2/accessories/updateAccessories/${params.id}`, {
      data: {
        fitCode: params.fitCode,
        fitName: params.fitName,
        suitableForCar: JSON.stringify(suitableForCar)
      }
    })
      .then(() => {
        let array = [];
        params.list.forEach(accessory => {
          if (accessory.isModify) {
            const promise =  this.get('ajax').put(`${config.API_HOST}/api/v2/fitWarehouse/updateFitWarehouse/${accessory.id}`, {
              data: { fitNumber: accessory.fitNumber, closeStatus: accessory.closeStatus }
            });

            array.push(promise);
          }
        });

        return RSVP.all(array);
      })
      .then(() => {
        this.transitionTo('repertory.accessories.index');
        set(this, "currentModel.formValue", {});
      })
      .catch(() => this.get('notification').error('更新失败，请重新操作'));  // eslint-disable-line no-console
  },

  actions: {
    createOrUpdateCar() {
      const params = get(this, "currentModel.formValue");

      params.id ? this._updateCar(params) : this._createCar(params);
    },

    createOrUpdateAccessory() {
      const params = get(this, "currentModel.formValue");

      if (params.canEdit) {
        if (params.id) {
          this._updateAccessoryList(params);
        } else {
          this._createAccessory(params);
        }
      } else {
        this._updateAccessory(params);
      }
    }
  }
});
