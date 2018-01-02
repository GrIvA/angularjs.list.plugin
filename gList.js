(function (angular, module) {
    module.directive('grList', ['$compile', function($compile) {
        function controller($scope, $element) {
            $scope.tag = $scope.grListTag || $element[0].nodeName;
            $scope.$on('grListClick', function(e, item) {
                $scope.grListCb && $scope.grListCb(item);
            });
        }

        function compile(elem, attrs) {
            function render(scope, elem, transclude) {
                //reset all elements
                elem.html('');
                while (scope.$$childTail) scope.$$childTail.$destroy();

                scope.grListItems && angular.forEach(scope.grListItems, function(item, key) {
                    var
                        childScope = scope.$new(),
                        childElem = angular.element('<' + scope.tag + ' />');

                    childScope.item = item;

                    childElem.bind('click', function(e) {
                        childScope.$emit('grListClick', childScope.item);
                    });

                    //do the transclusion
                    transclude(childScope, function(clone, innerScope) {
                        //clone is a copy of the transcluded DOM element content
                        childElem.append($compile(clone)(innerScope));
                    });

                    elem.append(childElem);
                });
            }

            return {
                pre: function(scope, elem, attrs, ctrl, transclude) {
                    render(scope, elem, transclude);
                    $compile(elem.contents())(scope);
                },
                post: function(scope, elem, attrs, ctrl, transclude) {
                    // So, our list can rerender automatically,
                    // but all items must be in "items" array
                    scope.$watch('grListItems.length', function(newValue, oldValue, scope) {
                        if (!angular.equals(oldValue, newValue)) {
                            render(scope, elem, transclude);
                        }
                    });
                }
            };
        }

        return {
            "scope": {
                "grListItems": "<",
                "grListTag": "@",
                "grListCb": "<"
            },
            restrict: 'EA',
            controller: controller,
            compile: compile,
            transclude: true,
        };
    }]);
 })(angular, app);
