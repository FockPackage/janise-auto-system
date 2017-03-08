import Route from 'ember-route';
import inject from 'ember-service/inject';
import { setProperties } from 'ember-metal/set';
import config from 'auto-service-system/config/environment';
import get from 'ember-metal/get';

export default Route.extend({
  intl: inject(),
  session: inject(),
  ajax: inject('cform-ajax'),
  orderInfo: inject('order-info'),
  prepareData: inject(),

  beforeModel() {
    this._super(...arguments);
    // Extract window.navigator object
    // const {navigator} = window;
    // Get current language name
    // let language = navigator.language || navigator.browserLanguage;
    const language = 'en-us';
    // Change lang attribute for <html> tag
    document.querySelector('html')
      .setAttribute('lang', language.toLowerCase());
    // Set active locale name
    this.get('intl').setLocale(/zh-cn/i.test(language) ? 'zh-hans' : language);

    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
      return;
    }
  },

  model() {
    const currentRole = get(this, "permission.currentRole");

    if (currentRole) {
      return get(this, 'prepareData').start((currentRole));
    }
    return {};
  },

  // afterModel(model) {
  //   this._super(...arguments);
  //
  //   const orderInfo = get(this, "orderInfo");
  //   if (model.allAccessories) {
  //     let generalAccessories = model.allAccessories.filter(accessory => accessory.suitableForCar === "");
  //
  //     const carTypeId = model.carTypes[0].id;
  //
  //     orderInfo.initData(Object.assign({}, model, {
  //       selected: {
  //         carTypeId,
  //         exteriors: [],
  //         interiors: [],
  //         carAccessories: [],
  //         accessories: []
  //       },
  //       filteredCarTypes: model.cars.filterBy('carType.id', carTypeId),
  //       filteredConfigs: [],
  //       filteredExteriorColors: [],
  //       filteredWheels: [],
  //       generalAccessories,
  //       formValue: {}
  //     }));
  //   }
  // },

  setupController(controller) {
    setProperties(controller, {
      singlePage: false,
      navClassName: 'nav',
      showLogo: false,
      defaultMenu: false,
      primaryComponent: 'common-ui/navbar',
      hasSubnav: true
    });

    this._super(...arguments);
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
  },

  actions: {
    logout() {
      this.get('session').invalidate();
      this.transitionTo('login');
    }
  }
});
