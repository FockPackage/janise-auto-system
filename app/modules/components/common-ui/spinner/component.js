import Component from 'ember-component';
import computed, { reads } from 'ember-computed';
import { isPresent, tryInvoke } from 'ember-utils';
import { htmlSafe } from 'ember-string';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  classNameBindings: ['disabled'],

  hasDisabled: reads('disabled'),

  hasLabel: computed('label', function() {
    return isPresent(get(this, 'label'));
  }),

  labelContent: computed('hasLabel', function() {
    const label = get(this, 'label');
    if (get(this, 'hasLabel')) {
      return htmlSafe(`<label>${label}</label>`);
    } else return '';
  }),

  unitContent: computed('hasUnit', function() {
    const unit = get(this, 'unit');
    const position = this.getWithDefault('unitPosition', 'l');
    if (isPresent(unit)) {
      return htmlSafe(`<div class="spinner-unit ${position}">${unit}</div>`);
    } else return '';
  }),

  errorContent: computed('subject.error', 'error', function() {
    const error = get(this, 'subject.error') || get(this, 'error');
    if (isPresent(error)) {
      return htmlSafe(`<div class="field-error">${error}</div>`);
    } else return '';
  }),

  didInsertElement() {
    this.element.parentElement.classList.add('ui-spinner');

    if (get(this, 'hasLabel')) {
      const input = this.element.querySelector('input');
      const label = this.element.querySelector('label');
      label.setAttribute('for', input.id);
      this.element.parentElement.classList.add('has-label');
    }
  },

  // check if value is valid against max
  isValidToMax: computed('max', 'value', function() {
    return get(this, 'value') < get(this, 'max');
  }),

  // check if value is valid against min
  isValidToMin: computed('min', 'value', function() {
    return get(this, 'value') > get(this, 'min');
  }),

  // check if need normalize to align with step
  normalized: computed('value', 'step', function() {
    return get(this, 'value') % get(this, 'step') === 0;
  }),

  actions: {
    increase() {
      if (get(this, 'hasDisabled')) return;

      let value = get(this, 'value');
      const step = get(this, 'step');

      if (get(this, 'normalized')) {
        value = +value + step
      } else {
        value = value + (step - value % step);
      }
      set(this, 'value', value);
      tryInvoke(this, "onInput", [{target: {value}}]);
    },

    decrease() {
      if (get(this, 'hasDisabled')) return;

      let value = get(this, 'value');
      if (get(this, 'isValidToMin')) {
        const step = get(this, 'step');

        if (get(this, 'normalized')) {
          value = value - step;
        } else {
          value = value - value % step;
        }
      }
      set(this, 'value', value);
      tryInvoke(this, "onInput", [{target: {value}}]);
    }
  }
});
