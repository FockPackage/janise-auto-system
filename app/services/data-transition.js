import Service from 'ember-service';

export default Service.extend({
  transitionOrders(orders) {
    let unreadOrders = [];
    let dateOrders = [];

    orders.map(order => {
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
        label = `${car.carType.meaning} ${car.carConfig.meaning} ${car.carOutsideColor.meaning} ${car.carInsideColor.meaning}`;
        allOfficalPrice += order.carRelation.officialGuidePrice;
      } else {
        label = label.substring(0, label.length - 2);
      }
      allNetPrice += order.fitPrice;

      order.label = label;
      order.allOfficalPrice = allOfficalPrice;
      order.allNetPrice = allNetPrice;

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

    return { unreadOrders, dateOrders };
  },

  transitionFinances(finances) {
    let dateFinances = [];

    finances.forEach(finance => {
      const car = finance.carRelation;
      finance.label = `${car.carType.meaning} ${car.carConfig.meaning} ${car.carOutsideColor.meaning} ${car.carInsideColor.meaning}`;

      let status = "";
      switch (finance.orderStatus) {
        case 0:
          status = "订单";
          break;
        case 1:
          status = "合同已删除";
          break;
        case 2:
          status = "合同";
          break;
        case 3:
          status = "合同 - 已付定金";
          break;
        case 4:
          status = "合同 - 已付全款";
          break;
        case 5:
          status = "合同 - 已完成";
          break;
      }
      finance.status = status;

      const financeDate = finance.createdAt.split('T')[0];
      const date = dateFinances.findBy('date', financeDate);
      if (date) {
        date.finances.push(finance);
      } else {
        dateFinances.push({ date: financeDate, finances: [finance] });
      }
    });

    return dateFinances;
  }
});
