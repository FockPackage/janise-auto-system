import Controller from 'ember-controller';
import set from 'ember-metal/set';

export default Controller.extend({
  currentEdit: { id: 0, value: '' },
  radioValue: 1,

  actions: {
    focusInput(id, value) {
      if (id) {
        set(this, 'currentEdit', { id, value });
      }

      if (id && id !== -1) {
        setTimeout(() => {
          document.getElementById('currentEdit').focus();
        }, 200);
      }
    },

    changeRadioValue(value) {
      set(this, 'radioValue', value);
    }
  }
});
