ngGridDirectives.directive('ngCell', ['$compile', '$domUtilityService', function ($compile, domUtilityService) {
    var ngCell = {
        scope: false,
        compile: function() {
            return {
                pre: function($scope, iElement) {
                    var html;
                    var cellTemplate = $scope.col.cellTemplate.replace(COL_FIELD, '$eval(\'row.entity.\' + col.field)');

                    // Enable setting editable for individual cells
                    if ($scope.myData[$scope.row.rowIndex].hasOwnProperty('metadata') &&
                        $scope.myData[$scope.row.rowIndex].metadata.hasOwnProperty($scope.col.field) &&
                        $scope.myData[$scope.row.rowIndex].metadata[$scope.col.field].hasOwnProperty('editable') ) {

                        $scope.col.enableCellEdit = ($scope.myData[$scope.row.rowIndex].metadata[$scope.col.field].editable === true) ? true : false;
                    }

					if($scope.col.enableCellEdit){
						html =  $scope.col.cellEditTemplate;
						html = html.replace(DISPLAY_CELL_TEMPLATE, cellTemplate);
						html = html.replace(EDITABLE_CELL_TEMPLATE, $scope.col.editableCellTemplate.replace(COL_FIELD, '$eval(\'row.entity.\' + col.field)'));
					} else {
					    html = cellTemplate;
					}
					var cellElement = $compile(html)($scope);
					if($scope.enableCellSelection && cellElement[0].className.indexOf('ngSelectionCell') == -1){
						cellElement[0].setAttribute('tabindex', 0);
						cellElement.addClass('ngCellElement');
					}
                    iElement.append(cellElement);
                },
				post: function($scope, iElement){	
					if($scope.enableCellSelection){
						$scope.domAccessProvider.selectionHandlers($scope, iElement);
					}
					
					$scope.$on('ngGridEventDigestCell', function(){
						domUtilityService.digest($scope);
					});
				}
            };
        }
    };
    return ngCell;
}]);