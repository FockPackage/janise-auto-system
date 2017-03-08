import Service from 'ember-service';
import get from 'ember-metal/get';
import inject from 'ember-service/inject';
import computed from 'ember-computed';

export default Service.extend({
  session: inject(),

  销售经理: [
    "SALE_MODULE", "CLIENT_MODULE", "ORDER_MODULE"
  ],
  普通销售: [
    "SALE_MODULE", "CLIENT_MODULE", "ORDER_MODULE"
  ],
  库管: [
    "CAR_WAREHOUSE_MODULE", "ACCESSORY_WAREHOUSE_MODULE"
  ],
  财务: [
    "FINANCE_MODULE"
  ],
  老板: [
    "SALE_MODULE", "CLIENT_MODULE", "ORDER_MODULE", "CAR_WAREHOUSE_MODULE",
    "ACCESSORY_WAREHOUSE_MODULE", "FINANCE_MODULE", "PRICE_MODULE"
  ],

  currentRole: computed("session.data.authenticated.user.role.roleName", function() {
    if (get(this, "session.isAuthenticated")) {
      return get(this, "session.data.authenticated.user.role.roleName");
    }
    return null;
  }),

  hasPermission(moduleName) {
    const currentRole = get(this, "currentRole");
    if (currentRole == "管理员") {
      return true;
    } else if (currentRole) {
      return get(this, `${currentRole}`).indexOf(moduleName) != -1;
    } else {
      return false;
    }
  }
});
