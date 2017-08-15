(function () {
    'use strict';

    angular
        .module('app')
        .factory('FlashService', FlashService);

    FlashService.$inject = ['$rootScope'];
    function FlashService($rootScope) {
        var service = {};

        service.Success = Success;
        service.Error = Error;

        return service;

        function Success(message, keepAfterLocationChange) {
            generate(message)
        }

        function Error(message, keepAfterLocationChange) {
            generate(message, 'error')
        }

        function generate(text, type, layout, timeout) {
            type = (type === undefined) ? 'success' : type
            layout = (layout === undefined) ? 'topCenter' : layout
            timeout = (timeout === undefined) ? 1500 : timeout
            var n = noty({
                text        : text,
                type        : type,
                dismissQueue: true,
                modal       : false,
                maxVisible  : 2,
                timeout     : timeout,
                layout      : layout,
                theme       : 'defaultTheme'
            });
        }
    }

})();