/**
 * Created by darac on 7/23/2016.
 */
<!--6-->
(function() {
    'use strict';

    angular
        .module('authZeroApp')
        .directive('toolbar', toolbar);

    function toolbar() {
        return{
            templateUrl: 'components/toolbar/toolbar.tpl.html',
            controller: toolbarController,
            controllerAs: 'toolbar'
        }
    }

    //set toolbar button controller
    //auth-from auth0; store-for setting local storage;
    //$location- comes from angularJS, this will help to redirect user once login
    function toolbarController(auth, store, $location){
        var vm=this;
        vm.login=login;
        vm.logout=logout;
        vm.auth=auth; //auth service will hold property login status

        //profile- user json object; token- store with name id_token
        function login(){
            auth.signin(
                           {},
                           function(profile, token){
                           store.set('profile', profile);
                           store.set('id_token', token);
                           $location.path('/home');
                           },
                           function(error){
                           console.log(error);
                           }
            );
        }

        function logout(){

            //token lifetime manage, remove token
            store.remove('profile');
            store.remove('id_token');

            //clear the state from auth service
            auth.signout();

            //redirect user to home page
            $location.path('/home');
        }
    }

})();