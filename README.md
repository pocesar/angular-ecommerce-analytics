# angular-ecommerce-analytics
[Google Analytics Ecommerce](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce) helper with tracking events  

## Install

```bash
bower install angular-ecommerce-analytics
```

## Usage

#### Service

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

#### Directive

* `analytics` Support multiple events, either separated by space or by commas
* `analytics-if` Conditional to trigger the sending of the event, optional
* `analytics-category` Category of the event
* `analytics-label` How it will show in the analytics panel
* `analytics-value` The value assigned to the event

Every attribute are evaluated for expressions, so literal strings must be set as `'some string'`

The same events (click, mouseover, mouseenter, etc) still fires, since the directive won't do anything to
the event, and just send tracking data.

```html
<a 
   analytics="click,mouseover,focus" 
   analytics-if="ctrl.isCheckingOut()" 
   analytics-category="'pay'" 
   analytics-label="'debit'" 
   target="_blank" 
   class="btn btn-primary btn-pagamento" 
   ng-href="{{url}}"
   >Pay with Debit</a>
```
