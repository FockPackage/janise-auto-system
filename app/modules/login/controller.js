import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { later } from 'ember-runloop';
import computed from 'ember-computed';

export default Controller.extend({
  session: inject(),
  prepareData: inject(),

  formValue: { username: localStorage.getItem('username'), password: '' },
  rememberMe: computed(function() {
    return !!get(this, 'formValue.username');
  }),
  error: { password: false },

  actions: {
    login(formValue) {
      const { username, password } = formValue;
      this.get('session').authenticate('authenticator:cform', username, password)
        .then(() => {
          const currentRole = get(this, "permission.currentRole");
          get(this, 'prepareData').start((currentRole));
          switch (currentRole) {
            case "管理员":
            case "老板":
              this.transitionToRoute('manage');
              break;
            case "销售经理":
            case "普通销售":
              this.transitionToRoute('manage.order');
              break;
            case "库管":
              this.transitionToRoute('repertory.vehicles.index');
              break;
          }

          later(this, () => {
            if(!get(this, 'rememberMe')) {
              set(this, 'formValue.username', '');
            }
            set(this, 'formValue.password', '');
          }, 1000);
        })
        .catch(error => {
          set(this, 'error.password', true);
          set(this, 'formValue.password', "");
          console.log(error)  // eslint-disable-line no-console
        });

      if(get(this, 'rememberMe')) {
        localStorage.setItem('username', this.get('formValue.username'));
      } else {
        localStorage.removeItem('username');
      }
    }
  }
});
