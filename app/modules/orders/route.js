import Route from 'ember-route';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  orderInfo: inject('order-info'),

  beforeModel() {
    this._super(...arguments);

    if (!get(this, "permission").hasPermission("ORDER_MODULE")) {
      return this.transitionTo('manage');
    }
  },

  model() {
    return RSVP.hash({
      orders: this._getOrders(),
      searchTypes: [
        { type: 'date', text: "日期范围" },
        { type: 'number', text: "联系电话" },
        { type: 'text', text: "客户姓名" },
        { type: 'number', text: "订单编号" },
        { type: 'text', text: "汽车类型" },
      ],
      currentSearchType: { type: 'number', text: "订单编号" }
    });
  },

  _getOrders() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/order/getOrder`)
      .then(response => response.rows);
  },

  actions: {
    goToSalesSummary() {
      this.transitionTo("sales.summary");
    }
  }
});
