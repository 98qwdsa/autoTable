export class MainController{
  constructor (tbaleService,TABLE_BASE,$scope){
    'ngInject';

    function RandomNum(Min = 5, Max = 20) {
      let Range = Max - Min;
      let Rand = Math.random();
      let num = Min + Math.round(Rand * Range);
      return num;
    }

    $scope.theadConf = tbaleService.getTableHeads();
    $scope.tableBody = tbaleService.getTableBody();
    $scope.tableFilter = TABLE_BASE.keyArr.slice(0,RandomNum(5,TABLE_BASE.keyArr.length));

    $scope.$on('tbalePageParamChange',function(e,d){
      $scope.tableBody = tbaleService.getTableBody();
    })

    /*$scope.tableConf = {
      showCog:true
    }*/

  }


}
/*export class MainController {
  constructor ($timeout, webDevTec, toastr,$http) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1472646985741;
    this.toastr = toastr;

    this.activate($timeout, webDevTec);

  }

  activate($timeout, webDevTec) {
    this.getWebDevTec(webDevTec);
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }

  getWebDevTec(webDevTec) {
    this.awesomeThings = webDevTec.getTec();

    angular.forEach(this.awesomeThings, (awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }

  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    this.classAnimation = '';
  }
}*/
