# angular-ecommerce-analytics
[Google Analytics Ecommerce](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce) helper with tracking events  

## Usage

```js
// add your GA.js code before this script
angular.module('App', ['Analytics']).run(['$analytics', function($analytics){
    // send by code
    $analytics.setAction(4 /* CHECKOUT */, {
        'step': 2
    }).event({
        eventAction: 'checkout',
        eventCategory: 'plans',
        eventLabel: 'do-checkout-button'
    });
    
    $analytics.addProduct({
        id: '1',
        name: 'product',
        price: 100
    });
    $analytics.setAction(2 /* ADD */);
    $analytics.setAction(3 /* REMOVE */);
    
    $analytics.event({
        eventCategory: 'button',
        eventAction: 'action',
        eventLabel: 'label',
        eventValue: 'value'
    });
    
    try {
        lol++;    
    } catch (e) {
      $analytics.exception({
        exDescription: 'error: ' + e
      });
    }
    
    $analytics.pageView({
        // page: '/randomurl/1'
    });
    $analytics.social({
        socialNetwork: 'facebook',
        socialAction: 'like',
        socialTarget: url
    });
}]);
```

```html
<a analytics="click" analytics-category="'pay'" analytics-label="'debit'" target="_blank" class="btn btn-primary btn-pagamento" ng-href="{{url}}">Pay with Debit</a>
```
