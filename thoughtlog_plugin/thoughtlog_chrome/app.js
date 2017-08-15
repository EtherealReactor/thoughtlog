(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'ThoughtsController',
                templateUrl: 'views/thoughts/new.html',
                controllerAs: 'vm'
            })
            .when('/about', {
                controller: 'HomeController',
                templateUrl: 'views/home/about.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'views/register/register.view.html',
                controllerAs: 'vm'
            })

            .when('/add_thought', {
                controller: 'ThoughtsController',
                templateUrl: 'views/thoughts/new.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }else{
                $('#current-user').parent().show();
                currentUser = $rootScope.globals.currentUser;
                // $('#current-user').html(loggedIn.username);
            }
        });
    }

})();