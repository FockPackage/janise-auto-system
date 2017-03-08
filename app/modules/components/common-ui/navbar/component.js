import Component from 'ember-component';

export default Component.extend({
  tagName: 'nav',
  classNames: ['navbar']
}).reopenClass({positionalParams: ['text']});
