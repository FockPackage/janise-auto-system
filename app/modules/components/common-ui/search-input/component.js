import Component from 'ember-component';
import mobiscroll from 'mobiscroll';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  classNames: ['search'],
  formValue: {},

  didReceiveAttrs() {
    this._super(...arguments);

    set(this, "formValue", {});
  },

  didRender() {
    this._super(...arguments);

    if (get(this, "currentSearchType.type") === "date") {
      mobiscroll.range('#searchDate', {
        theme: 'cadillac',
        display: 'bottom',
        dateFormat: "yy-mm-dd",
        onSet: event => {
          get(this, 'onSearch') && get(this, 'onSearch')("日期范围", { text: event.valueText });
        }
      });
    }
  }
});
