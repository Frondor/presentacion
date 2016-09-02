angular.module('starter.services', [])

.factory('cacheService', function ($cacheFactory) {
  var cache = $cacheFactory('appcache');

  return cache;
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('API', function($http){
  var db = 'js/db/';
  return {
    'getCategories': function(){
      return $http.get(db + 'categories.json', {cache: true});
    },
    'getProducts': function(){
      return $http.get(db + 'products.json', {cache: true});
    },
    'getProduct': function(id){
      return $http.get(db + 'products.json?id=' + id, {cache: true});
    }
  };
})

.factory('calculatePrice', function(){
  var base_pesos = 45,
      base_ps = 1;

  return {
    'toPS': function(pesos){
      return ( pesos / base_pesos ).toFixed(1);
    },
    'ofPS': function(pesos){
      return ( pesos / (base_pesos / 10) ).toFixed(1);
    },
    'toPesos': function(ps){
      return ( ps / base_ps ).toFixed(2);
    }
  }
})

.directive('animateRepeat', function(ionicMaterialMotion) {
  return function(scope, element, attrs) {
    if (scope.$last){
      ionicMaterialMotion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
      });
    }
  }
})

.directive('rating', function($ionicPopup, $ionicLoading, $timeout){
  return {
    restrict: 'AE',
    templateUrl: 'templates/dir.rating.html',
    scope: {
      rates: '='
    },
    link: function(scope, elem, attr){
      scope.max = [1, 2, 3, 4, 5];
      var setRating;

      scope.setRating = function(){
        if ( setRating ) {
          $ionicLoading.show({ 
            template: 'Muchas gracias!', 
            noBackdrop: true, 
            duration: 1000 
          });
          $timeout(function(){
            setRating.close();
            setRating = null;
          }, 1000);
        } 
        else {
          setRating = $ionicPopup.show({            
              templateUrl: 'templates/dir.rating.html',
              title: 'Califica este producto!',
              cssClass: 'text-center',
              scope: scope
          });          
        }
      };
    }
  }
})

.directive('productActions', function($ionicModal, $ionicPopup, cacheService, $ionicLoading, $state, $timeout){
  return {
    restrict: 'AE',
    replace: true,
    template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right spin button-balanced"><i class="icon ion-android-cart"></i></button>',
    link: function(scope, elem, attrs){
      scope.product = cacheService.get('currentProduct');
      var showAlert;

      var alert = '<div><button ng-click="addToCart()" class="button button-balanced button-block icon-left ion-plus"> Añadir al pedido</button></div>'+
                  '<div><button ng-init="isFav = null" ng-show="!isFav" ng-click="isFav = true" class="button button-assertive button-block icon-left ion-bag"> Crear paquete</button></div>'+
                  '<div><button ng-click="closeAlert()" class="button button-stable button-block icon-left ion-chevron-left"> Atrás </button></div>';

      elem.on('click', function(){
        scope.showAlert();
      });

      scope.showAlert = function() {

         showAlert = $ionicPopup.show({
           title: 'Elige una acción!',
           scope: scope,
           template: alert
         });

         return showAlert;
       };

       scope.closeAlert = function () {
          showAlert.close();
          showAlert = null;
       }

       scope.addToCart = function(){
        scope.closeAlert();
        scope.openModal();
       }

       scope.cartSent = null;
       scope.sendCart = function(){  
          scope.cartSent = true;
          var cart = cacheService.get('cart');
          cart.push(scope.product);
          cacheService.put('cart', cart);
          $timeout(function(){
            scope.closeModal();
            scope.cartSent = null;
          }, 2500);
       }

        scope.modal = null;
        $ionicModal.fromTemplateUrl( 'templates/dir.addtocart-modal.html' , {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.modal = modal;
        });
        scope.openModal = function() {
          scope.modal.show();
        };
        scope.closeModal = function() {
          scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        scope.$on('$destroy', function() {
          scope.modal.remove();
        });

        scope.addToFavs = function(){

        }

    }
  };
})

.directive("digitalClock",function($timeout,dateFilter){
   return function(scope,element,attrs) {
     
     scope.updateClock = function(){
       $timeout(function(){
         element.text(dateFilter(new Date(), 'HH:mm')); 
         scope.updateClock();
       },1000);
     };
     
     scope.updateClock();
     
   };
 })

;
