(function () {
    angular.module("cyTools")
    .directive("cyList", [ '$compile', function ($compile) {
        return {
            "scope"    : {
                "items" : "<",
                "cb" : "&callback"
            },
            restrict: 'EA',
            transclude: true,
            controller: function($scope) {
                /*
                this.$doCheck = function() {
                    console.log($scope);
                    console.log('doCheck: time mutated: ' + new Date().getTime());
                };
                this.$postLink = function() {
                    console.log('postLink: time mutated: ' + new Date().getTime());
                    console.log($scope);
                };
                */
            },
            compile: function(elem, attrs) {
                function render(scope, elem, transclude) {
                    //reset all elements
                    elem.html('');
                    while (scope.$$childTail) scope.$$childTail.$destroy();

                    angular.element.each(scope.items, function(key, item) {
                        var
                            childScope = scope.$new(),
                            childElem = angular.element('<li />');

                        childScope.item = item;
                        childScope.clickDispatcher = function() {
                            childScope.$parent.cb(childScope);
                        };

                        childElem.bind('click', childScope.clickDispatcher);

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
                        scope.$watch('items', function(newValue, oldValue, scope) {
                            if (!angular.equals(oldValue, newValue)) {
                                render(scope, elem, transclude);
                            }
                        });
                    }
                };
            },
        };
    }]);
})();
