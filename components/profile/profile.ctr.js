/**
 * Created by darac on 7/23/2016.
 */
<!--4-->
(function() {
    'use strict';

    angular
        .module('authZeroApp')
        .controller('profileController', profileController);

    function profileController($http, store) {
        var vm = this;

        vm.getMessage = getMessage; // function to get public end-point messages
        vm.getSecretMessage = getSecretMessage; //secret messages
        vm.message= ''; //store here data coming from end-point

        //vm.message = 'Hello from Profile controller';

        //get user profile object details -email,photo
        vm.profile = store.get('profile');

        //public message
        function getMessage() {
            $http.get('http://localhost:3001/api/public', {
                skipAuthorization: true
            }).then(function(response) { //promise
                vm.message = response.data.message; //get locally stored data
            }, function(error) {
                console.log(error)
            });
        }
        function getSecretMessage() {
            $http.get('http://localhost:3001/api/private').then(function(response) {
                vm.message = response.data.message
            }, function(error) {
                console.log(error)
            })
        }
    }
})();