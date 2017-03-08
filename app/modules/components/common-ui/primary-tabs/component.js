import Component from 'ember-component';
import computed from 'ember-computed';
import getOwner from 'ember-owner/get';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  computedTabList: computed('router.currentRouteName', function() {
    const currentRouteName = get(this, 'router.currentRouteName');
    return get(this, 'tabList').map(tab => {
      if (currentRouteName.includes(tab.routeName)) {
        set(tab, 'isCurrentRoute', true);
      } else {
        set(tab, 'isCurrentRoute', false);
      }
      return tab;
    });
  })
});
