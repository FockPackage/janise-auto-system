import Service from 'ember-service';
import set, { setProperties } from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Service.extend({
  netPrice: computed(
    'carNetPrice',
    'allAccessoriesNetPrice',
    'isBuyAccessory',
    'isBuyCar',
    function() {
      const carNetPrice = get(this, "carNetPrice");
      const allAccessoriesNetPrice = get(this, 'allAccessoriesNetPrice');
      const isBuyCar = get(this, "isBuyCar");

      if (get(this, "isBuyAccessory")) {
        return isBuyCar ? carNetPrice + allAccessoriesNetPrice : allAccessoriesNetPrice;
      } else {
        return isBuyCar ? carNetPrice : 0;
      }
    }),

  filteredAccessories: computed('selected.car.id', function() {
    const car = get(this, "selected.car");
    if (!car) return [];

    this.updateCarNetPrice(car.officialGuidePrice);

    let filteredAccessories = [];
    get(this, "allAccessories").forEach(accessory => {
      const condition = accessory.suitableForCar ? JSON.parse(accessory.suitableForCar) : [];

      const carType = condition.findBy("meaning", car.carType.meaning);
      if (carType) {
        // 该车型通用配件
        if (carType.configMeanings.length == 0) {
          filteredAccessories.push(accessory);
        }
        // 该车型配件
        if (carType.configMeanings.indexOf(car.carConfig.meaning) != -1) {
          filteredAccessories.push(accessory);
        }
      }
    });

    return filteredAccessories;
  }),

  exteriorAccessories: computed("selected.car.id", function() {
    return get(this, "filteredAccessories")
      .filterBy("fitType.meaning", "外部配件");
  }),

  interiorAccessories: computed("selected.car.id", function() {
    return get(this, "filteredAccessories")
      .filterBy("fitType.meaning", "内部配件");
  }),

  carAccessories: computed("selected.car.id", function() {
    return get(this, "filteredAccessories")
      .filterBy("fitType.meaning", "4S店");
  }),

  // accessories: computed("selected.car.id", function() {
  //   return get(this, "filteredAccessories")
  //     .filterBy("fitType.meaning", "内部配件")
  //     .map(accessory => {
  //       const selectedAccessory = get(this, "selected.interiors").findBy('id', accessory.id);
  //       set(accessory, "checked", selectedAccessory ? true : false);
  //       return accessory;
  //     });
  // }),

  carNetPrice: 0,
  allAccessoriesOfficalPrice: 0,
  allAccessoriesNetPrice: 0,

  carTypes: [],
  cars: [],
  filteredCarTypes: [],
  filteredConfigs: [],
  filteredExteriorColors: [],
  filteredWheels: [],

  isBuyCar: true,
  isBuyAccessory: true,
  isBuyInsurance: true,
  isInstallment: false,

  netPrices: [],

  formValue: {},

  isCreateOrder: true,

  initData(data) {
    setProperties(this, data);
  },

  toggleCarType(carTypeId) {
    if (get(this, 'selected.carTypeId') === carTypeId) {
      set(this, "filteredCarTypes", []);
      set(this, "selected.carTypeId", null);
    } else {
        set(this, "selected.carTypeId", carTypeId);
        set(this, "filteredCarTypes", get(this, "cars").filterBy('carType.id', carTypeId));
    }
    set(this, "carNetPrice", 0);
    setProperties(get(this, "selected"), {
      configId: null,
      exteriorColorId: null,
      interiorColorId: null,
      defaultWheel: true,
      wheelId: null,
      exteriors: [],
      interiors: [],
      carAccessories: []
    });
  },

  toggleConfig(configId) {
    if (get(this, 'selected.configId') === configId) {
      set(this, "selected.configId", null);
    } else {
      set(this, "isBuyCar", true);
      set(this, "selected.configId", configId);
      const filteredConfigs = get(this, "filteredCarTypes").filterBy('carConfig.id', configId);
      set(this, "filteredConfigs", filteredConfigs);

      const price = +filteredConfigs[0].officialGuidePrice;
      set(this, "carNetPrice", price);
    }

    setProperties(get(this, "selected"), {
      exteriorColorId: null,
      interiorColorId: null,
      defaultWheel: true,
      wheelId: null,
      exteriors: [],
      interiors: [],
      carAccessories: []
    });
  },

  toggleColor(colorId, type) {
    switch (type) {
      case "exterior":
        if (get(this, 'selected.exteriorColorId') === colorId) {
          set(this, "selected.exteriorColorId", null);
        } else {
          set(this, "selected.exteriorColorId", colorId);
          set(this, "filteredExteriorColors", get(this, "filteredConfigs").filterBy('carOutsideColor.id', colorId));
        }

        setProperties(get(this, "selected"), {
          interiorColorId: null,
        });
        break;
      case "interior":
        if (get(this, 'selected.interiorColorId') === colorId) {
          set(this, "selected.interiorColorId", null);
        } else {
          set(this, "selected.interiorColorId", colorId);
          set(this, "filteredInteriorColors", get(this, "filteredExteriorColors").filterBy('carInsideColor.id', colorId));
          set(this, "selected.defaultWheel", true);
        }
        break;
    }
  },

  toggleWheel(wheelId, isSelectDefaultWheel, price) {
    if (isSelectDefaultWheel || get(this, 'selected.wheelId') === wheelId) {
      set(this, "selected.defaultWheel", true);

      const wheel = get(this, "filteredAccessories")
        .filterBy("fitType.meaning", "轮毂")
        .findBy('id', get(this, "selected.wheelId"));

      if (wheel) {
        set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") - wheel.costPrice);
        set(this, "allAccessoriesOfficalPrice", get(this, "allAccessoriesOfficalPrice") - wheel.costPrice);
      }

      set(this, "selected.wheelId", null);
    } else {
      set(this, "selected.defaultWheel", false);
      set(this, "selected.wheelId", wheelId);

      set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") + price);
      set(this, "allAccessoriesOfficalPrice", get(this, "allAccessoriesOfficalPrice") + price);
    }
  },

  toggleAccessory(accessoryId, type, price, count = 1) {
    let accessories = get(this, `selected.${type}`);
    const selectedAccessory = accessories.findBy("id", accessoryId);
    if (selectedAccessory) {
      accessories = accessories.filter(accessory => accessory.id != accessoryId);

      set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") - selectedAccessory.price * selectedAccessory.count);

      const accessory = get(this, "allAccessories").findBy('id', accessoryId);
      set(this, "allAccessoriesOfficalPrice", get(this, "allAccessoriesOfficalPrice") - accessory.costPrice * selectedAccessory.count);
    } else {
      accessories.push({ id: accessoryId, price, count });

      set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") + price);
      set(this, "allAccessoriesOfficalPrice", get(this, "allAccessoriesOfficalPrice") + price);
    }
    set(this, `selected.${type}`, accessories);
  },

  updateCarNetPrice(price) {
    set(this, "carNetPrice", +price);
  },

  updateAccessoryNetPrice(accessoryId, price) {
    let accessory = get(this, "selected.carAccessories").findBy("id", accessoryId);
    if (!accessory) {
      accessory = get(this, "selected.accessories").findBy("id", accessoryId);
    }
    if (!accessory) {
      accessory = get(this, "selected.interiors").findBy("id", accessoryId);
    }
    if (!accessory) {
      accessory = get(this, "selected.exteriors").findBy("id", accessoryId);
    }

    const netPriceSpread = accessory.count * (price - accessory.price);
    set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") + +netPriceSpread);
    set(accessory, "price", price);
  },

  updateAccessoryCount(accessoryId, count) {
    let accessory = get(this, "selected.carAccessories").findBy("id", accessoryId);
    if (!accessory) {
      accessory = get(this, "selected.accessories").findBy("id", accessoryId);
    }
    if (!accessory) {
      accessory = get(this, "selected.interiors").findBy("id", accessoryId);
    }
    if (!accessory) {
      accessory = get(this, "selected.exteriors").findBy("id", accessoryId);
    }

    const netPriceSpread = accessory.price * (count - accessory.count);
    set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") + netPriceSpread);

    const accessorySalePrice = get(this, "allAccessories").findBy('id', accessoryId).salePrice;
    const officalPriceSpread = accessorySalePrice * (count - accessory.count);
    set(this, "allAccessoriesOfficalPrice", get(this, "allAccessoriesOfficalPrice") + officalPriceSpread);

    set(accessory, "count", count);
  },

  deleteAccessory(accessoryId) {
    let selectedAccessory = get(this, "selected.carAccessories").findBy("id", accessoryId);
    let type = 'carAccessories';
    if (!selectedAccessory) {
      selectedAccessory = get(this, "selected.accessories").findBy("id", accessoryId);
      type = 'accessories';
    }
    if (!selectedAccessory) {
      selectedAccessory = get(this, "selected.interiors").findBy("id", accessoryId);
      type = 'interiors';
    }
    if (!selectedAccessory) {
      selectedAccessory = get(this, "selected.exteriors").findBy("id", accessoryId);
      type = 'exteriors';
    }
    set(this, "allAccessoriesNetPrice", get(this, "allAccessoriesNetPrice") - selectedAccessory.price * selectedAccessory.count);

    const accessory = get(this, "allAccessories").findBy('id', accessoryId);
    set(this, "allAccessoriesOfficalPrice", get(this, "allAccessoriesOfficalPrice") - accessory.costPrice * selectedAccessory.count);

    const accessories = get(this, `selected.${type}`).filter(accessory => accessory.id != accessoryId);
    set(this, `selected.${type}`, accessories);
  },

  deleteCar() {
    setProperties(this, { isBuyCar: false });
  },

  setIsOrder(value) {
    set(this, "isOrder", value);
  },

  setOrderInfo(data) {
    set(this, "_data", data);
  },

  selectCar(carId) {
    const car = get(this, "cars").findBy("id", carId);
    set(this, "selected.car", car);
  }
});
