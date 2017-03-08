import Component from 'ember-component';
import getOwner from 'ember-owner/get';
import computed from 'ember-computed'
import get from 'ember-metal/get';

export default Component.extend({
  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  headerButton: computed('router.currentRouteName', function() {
    const currentRouteName = get(this, "router.currentRouteName");
    const isCreate = {
      accessory: currentRouteName === "repertory.accessories.warehouse",
      vehicle: currentRouteName === "repertory.vehicles.warehouse"
    }
    if (isCreate.accessory) {
      return {
        text: "Save",
        action: "createOrUpdateAccessory"
      }
    } else if (isCreate.vehicle) {
      return {
        text: "Save",
        action: "createOrUpdateCar"
      }
    } else {
      const isVehicleIndex = currentRouteName === "repertory.vehicles.index";
      return {
        text: isVehicleIndex ?  "Warehouse Vehicles" : "Warehouse Accessories",
        route: isVehicleIndex ? 'repertory.vehicles.warehouse' : 'repertory.accessories.warehouse'
      }
    }
  }),

  actions: {
    createOrUpdateCar() {
      get(this, "createOrUpdateCar")();
    },

    createOrUpdateAccessory() {
      get(this, "createOrUpdateAccessory")();
    }
  }
});
