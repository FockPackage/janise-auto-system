import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('404', {path: '/*wildcard'});
  this.route('login');
  this.route('sales', function () {
    this.route('summary');
    this.route('contact');
  });
  this.route('orders');
  this.route('finances');

  this.route('manage', function () {
    this.route('order');
    this.route('client');
    this.route('finance');
  });
  this.route('repertory', function () {
    this.route('vehicles', function () {
      this.route('delivery');
      this.route('warehouse');
    });
    this.route('accessories', function () {
      this.route('delivery');
      this.route('warehouse');
    });
  });
  this.route('price', function () {
    this.route('vehicles');
    this.route('accessories');
  });
  this.route('details');

  this.route('global', function () {
    this.route('vehicles', function () {
      this.route('creating' , function () {
        this.route('color');
        this.route('trims');
        this.route('mpgs');
      });
    });
    this.route('accessories');
    this.route('client');
  });
  this.route('mobi-scroll');

  if (config.environment == 'development') {
    this.route('temp');
  }
});

export default Router;
