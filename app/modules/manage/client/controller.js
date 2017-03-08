import Controller from 'ember-controller';
import { setProperties } from 'ember-metal/set';
import config from 'auto-service-system/config/environment';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Controller.extend({
  ajax: inject('cform-ajax'),

  actions: {
    searchClient(type, params) {
      if (!params.text) {
        return set(this, 'model.clients', get(this, "model.all"));
      }

      let data = {};
      switch (type) {
        case "联系电话":
          data.mobile = params.text;
          break;
        case "客户姓名":
          data.customName = params.text;
          break;
        case "汽车类型":
          data.carType = params.text;
          break;
      }

      return this.get('ajax').request(`${config.API_HOST}/api/v2/custom/getCustom`, {
        data: data
      })
        .then(response => {
          setProperties(get(this, "model"), {
            clients: response.rows ? response.rows : []
          });
        })
        .catch(() => {
          setProperties(get(this, "model"), {
            clients: []
          });
        });
    }
  }
});
