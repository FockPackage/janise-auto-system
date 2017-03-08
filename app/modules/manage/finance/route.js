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

    if (!get(this, "permission").hasPermission("FINANCE_MODULE")) {
      return this.transitionTo('manage');
    }
  },

  model() {
    return RSVP.hash({
      finances: this._getFinances(),
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

  afterModel(model) {
    this._super(...arguments);
    set(model, "all", model.finances);
  },

  _getFinances() {
    return this.get('ajax').request(`${config.API_HOST}/api/v2/finance/getOrder`)
      .then(response => {
        return response.rows.map(finance => {
          if (finance.orderStatus > 2) {
            finance.schedule = `part${finance.orderStatus - 2}`;
          }
          const car = finance.carRelation;
          finance.label = `${car.carOutsideColor.meaning} ${car.carInsideColor.meaning}`;
          return finance;
        });
      });
  },

  actions: {
    changeSearchType(searchType) {
      set(this, 'currentModel.currentSearchType', searchType);
    },

    searchFinance(type, params) {
      if (!params.text) {
        return set(this, 'currentModel.finances', get(this, "currentModel.all"));
      }

      let data = {};
      switch (type) {
        case "日期范围":
          data.date = params.text;
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

      return this.get('ajax').request(`${config.API_HOST}/api/v2/finance/getOrder`, {
        data: data
      })
        .then(response => {
          const finances = response.rows.map(finance => {
            if (finance.orderStatus > 2) {
              finance.schedule = `part${finance.orderStatus - 2}`;
            }
            return finance;
          });

          set(this, "currentModel.finances", finances);
        });
    },

    openPreview(data) {
      this.get('orderInfo').setOrderInfo(data);
      this.transitionTo('sales.summary');
    },

    updateFinance(params) {
      this.get('ajax').put(`${config.API_HOST}/api/v2/finance/updateOrder/${params.id}`, {
        data: {
          deposit: params.deposit,
          dePostitDate: params.dePostitDate,
          paymentDate: params.paymentDate
        }
      })
        .then(() => {
          const finances = get(this, "currentModel.finances").findBy("id", params.id);

          const status = params.dePostitDate ? 3 : 4;
          setProperties(finances, {
            schedule: `part${status - 2}`,
            orderStatus: status,
          })
        });
    }
  }
});
