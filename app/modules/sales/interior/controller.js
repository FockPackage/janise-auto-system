import Controller from 'ember-controller';
import inject from 'ember-service/inject';

export default Controller.extend({
  orderInfo: inject('order-info'),
});
