import Controller from 'ember-controller';
import { setProperties } from 'ember-metal/set';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Controller.extend({
  ajax: inject('cform-ajax'),

  actions: {
    searchOrder(type, params) {
      if (!params.text) {
        return set(this, 'model.orders', get(this, "model.all"));
      }

      let data = {};
      switch (type) {
        case "日期范围":
          data.date = params.text.replace(' - ', ',');
          break;
        case "联系电话":
          data.mobile = params.text;
          break;
        case "客户姓名":
          data.customName = params.text;
          break;
        case "订单编号":
          data.orderCode = params.text;
          break;
        case "汽车类型":
          data.carType = params.text;
          break;
      }

      return this.get('ajax').request(`${config.API_HOST}/api/v2/order/getOrder`, {
        data: data
      })
        .then(response => {
          let unreadOrders = [];
          let dateOrders = [];

          response.rows.forEach(order => {
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
          setProperties(this, { unreadOrders, dateOrders })
        });
    }
  }
});
