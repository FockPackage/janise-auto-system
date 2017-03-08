import Route from 'ember-route';

export default Route.extend({
  model() {
    return {
      tabList: [
        {
          routeName: 'global.vehicles',
          text: 'modules.vehicles'
        }, {
          routeName: 'global.accessories',
          text: 'modules.accessories'
        }, {
          routeName: 'global.client',
          text: 'modules.client'
        }
      ]
    }
  },
});
