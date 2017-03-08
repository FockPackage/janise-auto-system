import Route from 'ember-route';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  dataTransition: inject(),

  beforeModel() {
    this._super(...arguments);

    if (!get(this, "permission").hasPermission("FINANCE_MODULE")) {
      return this.transitionTo('manage');
    }
  },

  model() {
    return RSVP.hash({
      dateFinances: this._getDateFinances(),
      searchTypes: [
        { type: 'date', text: "日期范围" },
        { type: 'number', text: "联系电话" },
        { type: 'text', text: "客户姓名" },
        { type: 'number', text: "订单编号" },
        { type: 'text', text: "汽车类型" }
      ],
      currentSearchType: { type: 'date', text: "日期范围" }
    });
  },

  _getDateFinances() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/finance/getOrder`)
      .then(response => {
        return response.rows ? get(this, "dataTransition").transitionFinances(response.rows) : [];
      });
  }
});
