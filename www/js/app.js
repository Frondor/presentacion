// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    //START THE REAL APP   

    .state('app.categories', {
        url: '/categories',
        views: {
            'menuContent': {
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.products', {
        url: '/products/:catId',
        views: {
            'menuContent': {
                templateUrl: 'templates/products.html',
                controller: 'ProductsCtrl'
            },
            'fabContent': {
                template: ''
            }
        },
        resolve: {
            categoryName: function(API, $stateParams, $q){
                var deferred = $q.defer();
                var catName = 'Productos';
                API.getCategories()
                .then(function(resp){
                    angular.forEach(resp.data, function(category){
                        if ( category.id === $stateParams.catId ) {
                            catName = category.name;
                        }
                    });

                    deferred.resolve(catName);
                });
                return deferred.promise;
            }
        }
    })

    .state('app.product', {
        url: '/product/:pid',
        views: {
            'menuContent': {
                templateUrl: 'templates/product.html',
                controller: 'ProductCtrl'
            },
            'fabContent': {
                template: '<product-actions></product-actions>',
                controller: function ($scope, $timeout, cacheService) {
                    var btn = document.getElementById('fab-profile');
                    $timeout(function () {
                        btn.classList.toggle('on');
                    }, 800);
                }
            }
        },
        resolve: {
            PRODUCT: function(API, $stateParams, $q, $filter, cacheService){
                if ( cacheService.get('currentProduct') ) {
                    return cacheService.get('currentProduct');
                } else {                 
                    var deferred = $q.defer();
                    var pdct;
                    API.getProduct( $stateParams.pid )
                    .then(function(resp){
                        pdct = $filter('filter')(resp.data, {'id': $stateParams.pid})[0];
                        cacheService.put('currentProduct', pdct);
                        deferred.resolve(pdct);

                    });
                    return deferred.promise;   
                }
            }
        }
    })

    .state('app.cart', {
        url: '/cart',
        views: {
            'menuContent': {
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
            },
            'fabContent': ''
        }
    })

    .state('app.pedido', {
        url: '/pedido',
        views: {
            'menuContent': {
                templateUrl: 'templates/pedidos.html',
                controller: 'PedidoCtrl'
            },
            'fabContent': ''
        }
    })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
