import Route from 'ember-route';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),

  beforeModel() {
    this._super(...arguments);

    if (!get(this, "permission").hasPermission("CLIENT_MODULE")) {
      return this.transitionTo('manage');
    }
  },

  model() {
    return RSVP.hash({
      clients: this._getClients(),
      searchTypes: [
        { type: 'number', text: "联系电话" },
        { type: 'text', text: "客户姓名" },
        { type: 'text', text: "汽车类型" }
      ],
      currentSearchType: { type: 'number', text: "联系电话" }
    });
  },

  afterModel(model) {
    this._super(...arguments);
    set(model, "all", model.clients);
  },

  _getClients() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/custom/getCustom`)
      .then(response => response.rows);
  },

  actions: {
    changeSearchType(searchType) {
      set(this, 'currentModel.currentSearchType', searchType);
    }
  }
});
