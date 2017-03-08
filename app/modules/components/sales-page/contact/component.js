import Component from 'ember-component';
import inject from 'ember-service/inject';
import config from 'auto-service-system/config/environment';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';

export default Component.extend({
  ajax: inject("cform-ajax"),
  orderInfo: inject(),

  formValue: { isCreateFinance: true },

  _createOrUpdateOrderItem(orderId) {
    const orderInfo = get(this, "orderInfo");

    let items = [];
    const carId = orderInfo.selected.car.id;

    if (orderInfo.selected.exteriors) {
      orderInfo.selected.exteriors.forEach(accessory => {
        const item = orderInfo.allAccessories.findBy('id', accessory.id);
        items.push({
          orderId,
          accessoriesId: item.id,
          carRelationId: carId,
          itemName: item.fitName,
          itemNumber: accessory.count,
          salePrice: accessory.price,
          itemType: 1
        })
      });
    }

    if (orderInfo.selected.interiors) {
      orderInfo.selected.interiors.forEach(accessory => {
        const item = orderInfo.allAccessories.findBy('id', accessory.id);
        items.push({
          orderId,
          accessoriesId: item.id,
          carRelationId: carId,
          itemName: item.fitName,
          itemNumber: accessory.count,
          salePrice: accessory.price,
          itemType: 1
        })
      });
    }

    if (orderInfo.selected.carAccessories) {
      orderInfo.selected.carAccessories.forEach(accessory => {
        const item = orderInfo.allAccessories.findBy('id', accessory.id);
        items.push({
          orderId,
          accessoriesId: item.id,
          carRelationId: carId,
          itemName: item.fitName,
          itemNumber: accessory.count,
          salePrice: accessory.price,
          itemType: 1
        })
      });
    }

    if (orderInfo.selected.accessories) {
      orderInfo.selected.accessories.forEach(accessory => {
        const item = orderInfo.allAccessories.findBy('id', accessory.id);
        items.push({
          orderId,
          accessoriesId: item.id,
          itemName: item.fitName,
          itemNumber: accessory.count,
          salePrice: accessory.price,
          itemType: 1
        })
      });
    }

    if (orderInfo.isBuyCar) {
      items.push({
        orderId,
        carRelationId: carId,
        itemName: "车",
        itemNumber: 1,
        salePrice: orderInfo.carNetPrice,
        itemType: 0
      })
    }

    if (orderInfo._data) {
      // TODO: update order
      items.forEach(item => {
        if (item.itemType == 0) {
          this.get('ajax').put(`${config.API_HOST}/api/v2/order/updateOrderItem/${item.carRelationId}`, {
            data: item
          });
        } else {
          const accessory = orderInfo._data.orderItem.findBy("accessoriesId", item.accessoriesId)

          if (accessory) {
            this.get('ajax').put(`${config.API_HOST}/api/v2/order/updateOrderItem/${accessory.id}`, {
              data: item
            });
          } else {
            return this.get('ajax').post(`${config.API_HOST}/api/v2/order/postOrderItem`, {
              data: { items: [item] }
            });
          }
        }
      });
      return true;
    } else {
      return this.get('ajax').post(`${config.API_HOST}/api/v2/order/postOrderItem`, {
        data: { items }
      });
    }
  },

  _createOrder(params) {
    this.get('ajax').post(`${config.API_HOST}/api/v2/order/postOrder`, { data: params })
      .then(response => this._createOrUpdateOrderItem(response.row.id))
      .then(() => {
        this.transitionTo('manage.order');
      });
  },

  _updateOrder(params, orderId) {
    this.get('ajax').put(`${config.API_HOST}/api/v2/order/updateOrder/${orderId}`, {
      data: params
    })
      .then(() => this._createOrUpdateOrderItem(orderId))
      .then(() => get(this, "goToOrders"));
  },

  _createOrUpdateClient() {
    const formValue = get(this, "formValue");
    const data = {
      customName: formValue.name,
      address: formValue.address,
      mobile: formValue.mobile,
      email: formValue.email,
      postal: formValue.postal,
      company: formValue.company,
      description: formValue.description
    }

    if (formValue.id) {
      return this.get('ajax').put(`${config.API_HOST}/api/v2/custom/updateCustom/${formValue.id}`, {
        data: data
      })
      .then(() => formValue.id);
    } else {
      return this.get('ajax').post(`${config.API_HOST}/api/v2/custom/postCustom`, { data })
        .then(response => response.row.id)
    }
  },

  actions: {
    createOrUpdateOrderInfo() {
      const formValue = get(this, "formValue");
      if (!formValue.name) return this.get('notification').error('请输入姓名！');
      if (!formValue.mobile) return this.get('notification').error('请输入电话号码！');

      this._createOrUpdateClient()
        .then(clientId => {
          const orderInfo = get(this, "orderInfo");
          const car = orderInfo.selected.car;
          const params = {
            carPrice: orderInfo.carNetPrice,
            fitPrice: orderInfo.allAccessoriesNetPrice,
            isInsurance: orderInfo.isBuyInsurance,
            isLoanPrice: orderInfo.isInstallment,
            carRelationId: car.id,
            isBuyCar: orderInfo.isBuyCar,
            customId: clientId,
            orderStatus: formValue.isCreateFinance ? 2 : 0,
            depositDate: formValue.depositDate
          }

          if (orderInfo._data) {
            this._updateOrder(params, orderInfo._data.id);
          } else {
            this._createOrder(params);
          }
        })
        .catch(error => {
          console.log(error)  // eslint-disable-line no-console
          this.get('notification').error('创建失败，重新提交')
        });
    },

    searchClient() {
      const formValue = get(this, "formValue");

      return get(this, 'ajax').request(`${config.API_HOST}/api/v2/custom/getCustom`, {
        data: { mobile: formValue.mobile }
      })
        .then(response => {
          if (response.rows) {
            const client = response.rows[0];
            setProperties(formValue, {
              id: client.id,
              name: client.customName,
              company: client.company,
              address: client.address,
              postal: client.postal,
              email: client.email,
              description: client.description
            });
          }
        });
    },

    setDeliveryDate(text) {
      set(this, "formValue.depositDate", text)
    }
  }
});
