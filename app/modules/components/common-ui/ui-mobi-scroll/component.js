import Component from 'ember-component';
import get from 'ember-metal/get';
import mobiInit from '../../../lib/mobile-factory'

export default Component.extend({
  classNames: ['ui-mobiScroll'],


  didInsertElement(){
    const input = this.element.getElementsByTagName('input')[0];
    let config = {type:get(this, 'mobiScrollType')};
    get(this, 'theme') && (config.theme = get(this, 'theme'));
    mobiInit(input, config);
  }
});
