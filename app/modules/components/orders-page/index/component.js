import Component from 'ember-component';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';
import { setProperties } from 'ember-metal/set';
import computed from 'ember-computed';

export default Component.extend({
  dataTransition: inject(),
  orderInfo: inject(),

  mobiConfig: computed(function() {
    return {
      onItemTap: event => {
        if (event.index === 0) {
          const orderId = event.target.attributes.getNamedItem("data-id").value;
          // get(this, "orderInfo").setOrderInfo(get(this, "orders").findBy("id", orderId));
          get(this, "goToSalesSummary")();
        }
      }
    }
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    setProperties(this, get(this, "dataTransition").transitionOrders(get(this, "orders")));
  },
});
