(function(){
  var Analytics;
  (function (_Analytics) {
      'use strict';
      (function (IEcommerceEvents) {
          IEcommerceEvents[IEcommerceEvents["CLICK"] = 0] = "CLICK";
          IEcommerceEvents[IEcommerceEvents["DETAIL"] = 1] = "DETAIL";
          IEcommerceEvents[IEcommerceEvents["ADD"] = 2] = "ADD";
          IEcommerceEvents[IEcommerceEvents["REMOVE"] = 3] = "REMOVE";
          IEcommerceEvents[IEcommerceEvents["CHECKOUT"] = 4] = "CHECKOUT";
          IEcommerceEvents[IEcommerceEvents["CHECKOUT_OPTION"] = 5] = "CHECKOUT_OPTION";
          IEcommerceEvents[IEcommerceEvents["PURCHASE"] = 6] = "PURCHASE";
          IEcommerceEvents[IEcommerceEvents["REFUND"] = 7] = "REFUND";
          IEcommerceEvents[IEcommerceEvents["PROMO_CLICK"] = 8] = "PROMO_CLICK";
      })(_Analytics.IEcommerceEvents || (_Analytics.IEcommerceEvents = {}));
      var IEcommerceEvents = _Analytics.IEcommerceEvents;
      _Analytics.EcommerceEvents = [
          'click',
          'detail',
          'add',
          'remove',
          'checkout',
          'checkout_option',
          'purchase',
          'refund',
          'promo_click'
      ];
      var Directives;
      (function (Directives) {
          var Analytics = (function () {
              function Analytics($analytics) {
                  this.priority = 3000;
                  this.link = function (scope, el, attr) {
                      if (typeof attr['analytics'] !== 'string') {
                          return;
                      }
                      var events = attr['analytics'].split(/[,\s]/g);
                      el.off('.analytics').on(events.join('.analytics ') + '.analytics', function (ev) {
                          if (attr['analyticsIf']) {
                              if (!scope.$eval(attr['analyticsIf'])) {
                                  return;
                              }
                          }
                          $analytics.event({
                              eventCategory: scope.$eval(attr['analyticsCategory']) || 'button',
                              eventAction: ev.type,
                              eventLabel: scope.$eval(attr['analyticsLabel']),
                              eventValue: scope.$eval(attr['analyticsValue'])
                          });
                      });
                      scope.$on('$destroy', function () {
                          el.off('.analytics');
                      });
                  };
              }
              Analytics.instance = function () {
                  var _this = this;
                  return ['$analytics', function ($analytics) { return new _this($analytics); }];
              };
              return Analytics;
          })();
          Directives.Analytics = Analytics;
      })(Directives = _Analytics.Directives || (_Analytics.Directives = {}));
      var Services;
      (function (Services) {
          var Analytics = (function () {
              function Analytics($window, $location) {
                  this.$window = $window;
                  this.$location = $location;
              }
              Analytics.prototype._send = function (name) {
                  var args = [];
                  for (var _i = 1; _i < arguments.length; _i++) {
                      args[_i - 1] = arguments[_i];
                  }
                  if (typeof this.$window['ga'] === 'function') {
                      try {
                          this.$window['ga'].apply(null, [name].concat(args));
                      }
                      catch (e) {
                      }
                  }
                  return this;
              };
              Analytics.prototype.addImpression = function (data) {
                  return this._send('ec:addImpression', data);
              };
              Analytics.prototype.addProduct = function (data) {
                  return this._send('ec:addProduct', data);
              };
              Analytics.prototype.setAction = function (type, data) {
                  return this._send('ec:setAction', _Analytics.EcommerceEvents[type], data);
              };
              Analytics.prototype.exception = function (data) {
                  return this._send('send', 'exception', data);
              };
              Analytics.prototype.event = function (data) {
                  return this._send('send', angular.extend({}, data, {
                      hitType: 'event'
                  }));
              };
              Analytics.prototype.pageView = function (data) {
                  var url = this.$location.url();
                  try {
                      url = this.$location.absUrl().split(this.$location.host())[1];
                  }
                  catch (e) {
                  }
                  return this._send('send', angular.extend({
                      page: url
                  }, data, {
                      hitType: 'pageview'
                  }));
              };
              Analytics.prototype.social = function (data) {
                  return this._send('send', angular.extend({
                      socialTarget: this.$location.url()
                  }, data, {
                      hitType: 'social'
                  }));
              };
              Analytics.$inject = ['$window', '$location'];
              return Analytics;
          })();
          Services.Analytics = Analytics;
      })(Services = _Analytics.Services || (_Analytics.Services = {}));
      angular.module('Analytics', [
      ]).service('$analytics', Services.Analytics).directive('analytics', Directives.Analytics.instance());
  })(Analytics || (Analytics = {}));
  
  if (typeof module !== 'undefined') {
      module.exports = Analytics;
  }
})();
