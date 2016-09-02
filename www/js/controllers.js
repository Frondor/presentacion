/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicLoading, $ionicPopup, $timeout, cacheService, calculatePrice, API) {
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    $scope.pedido = cacheService.get('pedido');

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    var currentUser = {
        'uid': 1,
        'name': 'Federico Vázquez',
        'img_src': 'img/users/1.jpg',
        'address': 'Battle 611, esq. Florencio Sánchez',
        'mail': 'admin4@cafeserrano.uy',
        'cash': 150,
        'points': 42,
        'packs': [
            {
                'name': 'Mi paquete',
                'products': [{'id': 1, 'cantidad': 1}, {'id': 2, 'cantidad': 3}]
            },
            {
                'name': 'Tu paquete',
                'products': [{'id': 1, 'cantidad': 1}, {'id': 2, 'cantidad': 3}]
            }
        ]
    };
    $scope.currentUser = cacheService.put('currentUser', currentUser);

    // Form data for the login modal
    $scope.loginData = {
        'mail': currentUser.mail,
        'pass': null
    };

    $scope.cart = cacheService.put('cart', []);


    /*$scope.$watch('cart', function(){
        $scope.getTotal();
    });*/

    $scope.getTotal = function(isPS){
        var total = 0;
        angular.forEach($scope.cart, function(item){
            total += item.price * item.cantidad;
        });
        if ( isPS ) {
            return calculatePrice.ofPS(total);
        } else {
            return Math.round(total);
        }
    };

    $scope.getPS = function(){
        var total = $scope.getTotal(false);
        return calculatePrice.toPS(total);
    };

    $scope.finalizarPedido = function(isPS){
        var total = $scope.getTotal(isPS);
        var currency = isPS ? 'points' : 'cash';
        $scope.currentUser[currency] -= total;
        $scope.currentUser.points += isPS ? 0 : parseInt(calculatePrice.toPS(total));
        
        $scope.pedido = cacheService.put('pedido', $scope.cart);
        $scope.cart = cacheService.put('cart', []);
    };

    var alertitaPopup;
    $scope.addItems = function(){
        var paqueteItems = {22: {'cantidad': 1}, 35: {'cantidad': 3}}; //pid / cantidad
        API.getProducts()
        .then(function(resp){
            angular.forEach(resp.data, function(item){
                if ( paqueteItems[item.id] ) {
                    item.cantidad = paqueteItems[item.id].cantidad;
                    if ($scope.cart) {
                        var getPedido = cacheService.get('cart') ? cacheService.get('cart') : [];
                        getPedido.push(item);
                        $scope.cart = cacheService.put('cart', getPedido);

                    }
                    else {
                        $scope.cart = [];
                        $scope.cart.push('item');
                    }

                  $ionicLoading.show({ 
                    template: 'Paquete añadido al pedido!', 
                    noBackdrop: true, 
                    duration: 2000 
                  });
                  $timeout(function(){
                    alertitaPopup.close();
                    $scope.tab = 3;
                  }, 2000);
                }
            });

        }, function(){
            alert('Algo horrible ha sucedido! =(');
        });
    };

    $scope.removeItem = function(index){
        $scope.cart.splice(index, 1);
    };


     $scope.showPaquete = function() {
       alertitaPopup = $ionicPopup.alert({
         title: 'Mis paquetes',
         templateUrl: 'paquete-modal.html',
         scope: $scope,
        okText: 'Cancelar', // String (default: 'OK'). The text of the OK button.
        okType: 'button-stable'
       });
     };
    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, cacheService) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope.profile = cacheService.get('currentUser');

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})


// START THE REAL APP 

.controller('CategoriesCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, API) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');
    
    $scope.categories = null;

    API.getCategories()
        .then(function success(resp){
            $scope.categories = resp.data;
        }, function error(){
          alert('Algo horrible ha sucedido!');
        });

    $timeout(function() {
        ionicMaterialMotion.blinds({
            selector: '.list .item'
        });
        /*ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });*/
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('ProductsCtrl', function($scope, $state, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, API, $filter, categoryName, cacheService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.viewTitle = categoryName;

    $scope.products = null;

    API.getProducts( $stateParams.catId )
    .then(function success(resp){
        resp.data = $filter('filter')(resp.data, {'category': $stateParams.catId});
        $scope.products = resp.data;
    }, function error(){
      alert('Algo horrible ha sucedido!');
    });

    $scope.showProduct = function(product){
        if ( product ) {
            product.catName = categoryName;
            cacheService.put('currentProduct', product)
            $state.go('app.product', {'pid': product.id});
        }
    }

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
})

.controller('ProductCtrl', function($scope, PRODUCT, $stateParams, $timeout, $ionicModal, ionicMaterialMotion, ionicMaterialInk, cacheService, calculatePrice, API) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('false');
    $scope.comments = [
        {
            'uid': 2,
            'name': 'Juan Pérez',
            'body': 'De lo más rico!'
        },
        {
            'uid': 4,
            'name': 'Fulana De Tal',
            'body': 'Exquisito, mi favorito de todos los días'
        },
        {
            'uid': 5,
            'name': 'Luis Suárez',
            'body': 'Me encantaaa'
        }
    ];

    $scope.tab = 0;

    $scope.product = PRODUCT;

    $scope.pricePS = calculatePrice.ofPS(PRODUCT.price);

  $ionicModal.fromTemplateUrl('comment-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.newComment = function(body){
    var comment = {
        uid: cacheService.get('currentUser').uid,
        avatar: cacheService.get('currentUser').img_src,
        body: body,
        name: cacheService.get('currentUser').name
    };
    $timeout(function(){       
        $scope.comments.push(comment);
        $scope.asdqwe = null;
        $scope.modal.hide();
    });
  };

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            finishDelayThrottle: 0,
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('CartCtrl', function(){
    
})

.controller('PedidoCtrl', function($scope, cacheService){

    $scope.pedido = [];
    angular.forEach(cacheService.get('pedido'), function(item){
        $scope.pedido.push(item);
    });

    var states = {'waiting': 'positive-bg', 'confirmed': 'energized-bg', 'sent': 'balanced-bg'};
    $scope.elestado = states.waiting;
    $scope.elestadotext = 'En espera';

    $scope.changeState = function(){
        switch($scope.elestado){
            case 'positive-bg':
                $scope.elestado = states.confirmed;
                $scope.elestadotext = 'Confirmado';
                break;
            case 'energized-bg':
            case 'balanced-bg':
                $scope.elestado = states.sent;
                $scope.elestadotext = 'En camino';
                $scope.pedido = cacheService.put('pedido', [])
                break;
            default:
                $scope.elestado = states.waiting;
                $scope.elestadotext = 'En espera';
        }
    };
    
})

;
