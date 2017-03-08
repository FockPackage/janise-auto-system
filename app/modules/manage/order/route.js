import Route from 'ember-route';
import RSVP from 'rsvp';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import set, { setProperties } from 'ember-metal/set';
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

  afterModel(model) {
    this._super(...arguments);
    set(model, "all", model.orders);
  },

  _getOrders() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/order/getOrder`)
      .then(response => response.rows);
  },

  setupController(controller, model) {
    this._super(...arguments);

    let unreadOrders = [];
    let dateOrders = [];

    model.orders.forEach(order => {
      const car = order.carRelation;

      let allOfficalPrice = 0;
      let allNetPrice = 0;
      let label = "";
      order.orderItem.forEach(item => {
        if (item.itemType != "0") {
          allOfficalPrice += item.itemNumber * item.accessories.costPrice;
        } else {
          allNetPrice += item.salePrice;
        }
        label += item.itemName + ', ';
      });


      if (order.isBuyCar) {
        label = `${car.carOutsideColor.meaning} ${car.carInsideColor.meaning}`;
        allOfficalPrice += order.carRelation.officialGuidePrice;
      } else {
        label = label.substring(0, label.length - 2);
        // set(order, "carRelation.defaultImgSrc", null);
        set(order, "carRelation.carType.meaning", null);
      }
      allNetPrice += order.fitPrice;

      set(order, "label", label);
      set(order, "allOfficalPrice", allOfficalPrice);
      set(order, "allNetPrice", allNetPrice);

      if (order.isReadOfSale) {
        const orderDate = order.createdAt.split('T')[0];
        const date = dateOrders.findBy('date', orderDate);
        if (date) {
          date.orders.push(order);
        } else {
          dateOrders.push({ date: orderDate, orders: [order] });
        }
      } else {
        unreadOrders.push(order);
      }
    });
    setProperties(controller, { unreadOrders, dateOrders })
  },

  actions: {
    changeSearchType(searchType) {
      set(this, 'currentModel.currentSearchType', searchType);
    },

    openPreview(data) {
      this.get('orderInfo').setOrderInfo(data);
      this.transitionTo('sales.summary');
    },

    showNotification() {
      this.get('notification').success("有更新");
    },

    goToCreateOrder() {
      this.transitionTo('sales.trims');
    }
  }
});
