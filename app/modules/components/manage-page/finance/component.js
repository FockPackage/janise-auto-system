import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  currentFinance: null,
  isShow: { setDeposit: false, paymentComfirm: false },

  price: computed("currentFinance.id", function() {
    const finance = get(this, "currentFinance");
    if (finance) {
      const total = finance.carPrice + finance.fitPrice;
      return {
        total,
        finalPayment: total - finance.deposit
      }
    }
  }),

  actions: {
    setDeposit(value) {
      set(this, "currentFinance.deposit", value);

      get(this, "updateFinance")({
        id: get(this, "currentFinance.id"),
        deposit: value,
        dePostitDate: new Date()
      });
    },

    openPopup(finance) {
      switch (finance.orderStatus) {
        case 2:
          this.toggleProperty("isShow.setDeposit");
          break;
        case 3:
          this.toggleProperty("isShow.paymentComfirm");
          break;
      }
      set(this, "currentFinance", finance);
    },

    closeSetDepositPopup() {
      this.toggleProperty("isShow.setDeposit");
    },

    closePaymentComfirmPopup() {
      this.toggleProperty("isShow.paymentComfirm");
    },

    paymentComfirm() {
      get(this, "updateFinance")({
        id: get(this, "currentFinance.id"),
        paymentDate: new Date()
      });
    }
  }
});
