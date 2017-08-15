(function () {
    'use strict';

    angular
        .module('app')
        .controller('ThoughtsController', ThoughtsController);

    ThoughtsController.$inject = ['ThoughtsService', '$location', '$scope', 'FlashService', '$sce'];
    function ThoughtsController(ThoughtsService, $location, $scope, FlashService, $sce) {
        var vm = this;

        vm.ThoughtCreate = Create;
        vm.getThoughts = getThoughts;
        vm.deleteThought = deleteThought;
        vm.sanitizeHtml = sanitizeHtml;

        function sanitizeHtml(text) {
            return $sce.trustAsHtml(text);
        };

        function deleteThought(_id) {
            var flag = confirm("Are you sure want to delete thought?")
            if(flag){
                vm.dataLoading = true;
                ThoughtsService.Delete(_id).then(function (response) {
                    if (response) {

                        FlashService.Success('Thought deleted successfully', true);

                        var index = $scope.thoughts.findIndex(function(thought){
                            return thought._id === _id;
                        });

                        $scope.thoughts.splice(index, 1);

                        vm.dataLoading = false;
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
            }
        }


        function Create() {
            vm.dataLoading = true;
            ThoughtsService.Create(vm.thought, $scope.globals.currentUser).then(function (response) {
                // created_at: "2017-07-06T18:48:47.795Z"
                // created_by:"satishakumar"
                // description:"asdsad"
                // updated_at:"2017-07-06T18:48:47.795Z"
                // __v:0
                // _id:"595e860fbf6d8f1458851e63"
                var newThought  = response.data
                if (newThought) {
                    $scope.thoughts.push(newThought)
                    emitThought(newThought)
                    FlashService.Success('Thought added successfully', true);
                    $location.path('/');
                    vm.dataLoading = false;
                    vm.thought.description = " ";
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }

        function getThoughts() {
            vm.dataLoading = true;
            ThoughtsService.GetAll().then(function (response) {
                if (response) {
                    // $scope.thoughts.push({username: $scope.globals.currentUser.username, description: vm.thought.description, createdAt: new Date().toLocaleString()})
                    // FlashService.Success('Thought added successfully', true);
                    // $location.path('/');
                    $scope.thoughts = response
                    vm.dataLoading = false;
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }

        function emitThought(thoughtHash){
            socket.emit('newThought', {
                channel: "notifications",
                thoughtHash: thoughtHash
            });
        }

        getThoughts();
    }

})();
