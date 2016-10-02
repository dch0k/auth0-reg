/**
 * Created by darac on 7/23/2016.
 */
<!--2-->
(function() {
    'use strict';

    angular
        .module('authZeroApp', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router'])
        .config(moduleConfig)
        .run(moduleRun);

    function moduleConfig($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider) {

        //after setting up node server
        //Set authProvider from auth0, to get server token
        authProvider.init({
            domain: 'jwt-dara.auth0.com',
            clientID: 'zZBYySg1ARu4TeWmomEItfM3LJYm9bNZ'
        });

        //attach jwt token to HTTP header for requesting private content
        //return locally stored token using jwtInterceptorProvider
        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('id_token');
        };

        $urlRouterProvider.otherwise('/home');

        //url state ui route
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'components/home/home.tpl.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'components/profile/profile.tpl.html',
                controller: 'profileController',
                controllerAs: 'user'
            });

        //start token expire redirect
        // server 401 status, json token expired at auth0 server
        function redirect($q, $injector, $timeout, store, $location) {

            //solve circular dependency
            var auth;
            $timeout(function(){
            auth = $injector.get('auth');
            });
            return {
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        auth.signout();
                        store.remove('profile');
                        store.remove('id_token');
                        $location.path('/home');
                    }
                    return $q.reject(rejection);
                }
            }
        }
        $provide.factory('redirect', redirect);
        $httpProvider.interceptors.push('redirect');
        //end token expire redirect

        //jwtInterceptor is from angular-jwt, attach jwt to header
        $httpProvider.interceptors.push('jwtInterceptor');
    } //end moduleConfig


    //save login state, even on page reload
    function moduleRun($rootScope, auth, store, jwtHelper, $location){
        $rootScope.$on('$locationChangeStart', function(){          //$locationChangeStart check for any state change, or reload
            var token = store.get('id_token');
            if(token) {
                if(!jwtHelper.isTokenExpired(token)){
                    if(!auth.isAuthenticated){
                        auth.authenticate(store.get('profile'), token);
                    }
                }
            } else {
                $location.path('/home');
            }
        })
    } //end moduleRun


})();