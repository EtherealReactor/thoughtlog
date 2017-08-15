(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'CONSTANTS'];
    function UserService($http, CONSTANTS) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(CONSTANTS.REST_URL+'/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(CONSTANTS.REST_URL+'/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(CONSTANTS.REST_URL+'/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
           return $http({
                method: 'POST',
                url: CONSTANTS.REST_URL+'/api/users',
                data : user
            }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                }
            );
            // return $http.post(CONSTANTS.REST_URL+'/api/users', user).then(handleSuccess({data:true}), handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put(CONSTANTS.REST_URL+'/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(CONSTANTS.REST_URL+'/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
