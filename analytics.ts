module Analytics {
    'use strict';

    export interface IEcommerceImpressionData {
        /** The product ID or SKU (e.g. P67890). *Either this field or name must be set.*/
        id:        string;
        /** The name of the product (e.g. Android T-Shirt). *Either this field or id must be set. */
        name:      string;
        /** The list or collection to which the product belongs (e.g. Search Results) */
        list?:     string;
        /**  The brand associated with the product (e.g. Google). */
        brand?:    string;
        /**  The category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Mens/T-Shirts). */
        category?: string;
        /**  The variant of the product (e.g. Black). */
        variant?:  string;
        /**  The product's position in a list or collection (e.g. 2). */
        position?: number;
        /**  The price of a product (e.g. 29.20). */
        price?:    number;
    }

    export interface IEcommerceProductData {
        /** The product ID or SKU (e.g. P67890). *Either this field or name must be set. */
        id:        string;
        /** The name of the product (e.g. Android T-Shirt). *Either this field or id must be set. */
        name:      string;
        /** The brand associated with the product (e.g. Google). */
        brand?:    string;
        /** The category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Mens/T-Shirts). */
        category?: string;
        /** The variant of the product (e.g. Black). */
        variant?:  string;
        /** The price of a product (e.g. 29.20). */
        price?:    number;
        /** The quantity of a product (e.g. 2). */
        quantity?: number;
        /** The coupon code associated with a product (e.g. SUMMER_SALE13). */
        coupon?:   string;
        /** The product's position in a list or collection (e.g. 2). */
        position?: number;
    }

    export interface IEcommercePromotionData {
        /** The promotion ID (e.g. PROMO_1234). *Either this field or name must be set. */
        id:        string;
        /** The name of the promotion (e.g. Summer Sale). *Either this field or id must be set. */
        name:      string;
        /** The creative associated with the promotion (e.g. summer_banner2). */
        creative?: string;
        /** The position of the creative (e.g. banner_slot_1). */
        position?: string;
    }

    export interface IEcommerceActionData {
        /** The transaction ID (e.g. T1234). *Required if the action type is purchase or refund. */
        id?          : string;
        /** The store or affiliation from which this transaction occurred (e.g. Google Store). */
        affiliation? : string;
        /** Specifies the total revenue or grand total associated with the transaction (e.g. 11.99). This value may include shipping, tax costs, or other adjustments to total revenue that you want to include as part of your revenue calculations. Note: if revenue is not set, its value will be automatically calculated using the product quantity and price fields of all products in the same hit. */
        revenue?     : number;
        /** The total tax associated with the transaction. */
        tax?         : number;
        /** The shipping cost associated with the transaction. */
        shipping?    : number;
        /** The transaction coupon redeemed with the transaction. */
        coupon?      : string;
        /** The list that the associated products belong to. Optional on click or detail actions. */
        list?        : string;
        /** A number representing a step in the checkout process. Optional on checkout actions. */
        step?        : number;
        /** Additional field for checkout and checkout_option actions that can describe option information on the checkout page, like selected payment method. */
        option?      : string;
    }

    export enum IEcommerceEvents {
        /** A click on a product or product link for one or more products. */
        CLICK,
        /** A view of product details. */
        DETAIL,
        /** Adding one or more products to a shopping cart. */
        ADD,
        /** Remove one or more products from a shopping cart. */
        REMOVE,
        /** Initiating the checkout process for one or more products. */
        CHECKOUT,
        /** Sending the option value for a given checkout step. */
        CHECKOUT_OPTION,
        /** The sale of one or more products. */
        PURCHASE,
        /** The refund of one or more products. */
        REFUND,
        /** A click on an internal promotion. */
        PROMO_CLICK
    }

    export var EcommerceEvents = [
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

    export interface IEventTrack {
        eventCategory: string;
        eventAction: string;
        eventLabel?: string;
        eventValue?: number;
    }

    export interface IPageView {
        page?: string;
        title?: string;
    }

    export interface IException {
        exDescription?: string;
        exFatal?: boolean;
    }

    export interface ISocial {
        socialNetwork: string;
        socialAction: string;
        socialTarget?: string;
        page?: string;
    }

    export module Directives {

        export class Analytics implements angular.IDirective {
            priority = 3000;
            link: angular.IDirectiveLinkFn;

            constructor($analytics: Analytics.Services.Analytics){
                this.link = (scope, el, attr) => {
                    if (typeof attr['analytics'] !== 'string') {
                        return;
                    }

                    var events = attr['analytics'].split(/[,\s]/g);

                    el.off('.analytics').on(events.join('.analytics ') + '.analytics', (ev) => {
                        //console.log(events, ev, attr, scope.$eval(attr['analyticsIf']));
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

                    scope.$on('$destroy', () => {
                        el.off('.analytics');
                    });
                };
            }

            static instance() {
                return ['$analytics', ($analytics) => new this($analytics)];
            }
        }

    }

    export module Services {

        export class Analytics {
            static $inject: string[] = ['$window','$location'];

            _send(name: string, ...args: any[]): Analytics {
                if (typeof this.$window['ga'] === 'function') {
                    try {
                        this.$window['ga'].apply(null, [name].concat(args));
                    } catch (e) { }
                }
                return this;
            }

            addImpression(data: IEcommerceImpressionData): Analytics {
                return this._send('ec:addImpression', data);
            }

            addProduct(data: IEcommerceProductData): Analytics {
                return this._send('ec:addProduct', data);
            }

            setAction(type: IEcommerceEvents, data?:IEcommerceActionData): Analytics {
                return this._send('ec:setAction', EcommerceEvents[type], data);
            }

            exception(data?: IException) {
                return this._send('send', 'exception', data);
            }

            event(data: IEventTrack): Analytics {
                return this._send('send', angular.extend({}, data, {
                    hitType: 'event'
                }));
            }

            pageView(data?: IPageView): Analytics {
                var url: string = this.$location.url();

                try {
                    url = this.$location.absUrl().split(this.$location.host())[1];
                } catch (e) { }

                return this._send('send', angular.extend({
                    page: url
                }, data, {
                    hitType: 'pageview'
                }));
            }

            social(data?: ISocial): Analytics {
                return this._send('send', angular.extend({
                    socialTarget: this.$location.url()
                }, data, {
                    hitType: 'social'
                }));
            }

            constructor(private $window: angular.IWindowService, private $location: angular.ILocationService) { }
        }

    }

    angular
    .module('Analytics', [

    ])
    .service('$analytics', Services.Analytics)
    .directive('analytics', Directives.Analytics.instance())
    ;
}

export = Analytics;
