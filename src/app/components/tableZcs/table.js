export let TABLE_BASE = {
	curNum: 40,
	curIndex: 1,
	keyArr: []
};

/**
 * Mock() mockjs.com
 */

export class tbaleService {
	constructor(TABLE_BASE) {
		'ngInject';

		function RandomNum(Min = 5, Max = 20) {
			let Range = Max - Min;
			let Rand = Math.random();
			let num = Min + Math.round(Rand * Range);
			return num;
		}

		let keyArr = new Array(RandomNum());

		for (let i = 0; i < keyArr.length; i++) {
			keyArr[i] = Mock.mock('@word(3, 10)');
		}

		this.keyArr = TABLE_BASE.keyArr = keyArr;



		//随机模拟数据的类型
		let mockArr = ['@natural(0, 10000)', '@string(7, 10)', '@datetime("yyyy-MM-dd A HH:mm:ss")', '@paragraph(1, 3)', '@word(3, 5)', '@title(3, 5)', '@cparagraph(1, 3)', '@csentence(3, 5)', '@url()', '@email()', '@ip()', '@county(true)', '@guid()', '@id()', '@name(true)'];

		function randArray(data) {
			//获取数组长度
			let arrlen = data.length;
			//创建数组 存放下标数
			let try1 = new Array();
			for (let i = 0; i < arrlen; i++) {
				try1[i] = i;
			}
			//创建数组 生成随机下标数
			let try2 = new Array();
			for (let i = 0; i < arrlen; i++) {
				try2[i] = try1.splice(Math.floor(Math.random() * try1.length), 1);
			}
			//创建数组，生成对应随机下标数的数组
			let try3 = new Array();
			for (let i = 0; i < arrlen; i++) {
				try3[i] = data[try2[i]];
			}
			return try3;
		}

		this.mockArr = randArray(mockArr);
	}

	getTableHeads() {

		let headConf = {};
		let keyArr = this.keyArr

		keyArr.forEach((n) => {
			headConf[n] = {
				key: n,
				value: Mock.mock('@ctitle(3, 10)'),
				checked: false,
				width: 0
			}
		})


		return headConf;

	}

	getTableBody(param = {
		num: TABLE_BASE.curNum,
		index: 1
	}) {
		let keyArr = this.keyArr;
		let bodyArr = [];
		let mockArr = this.mockArr;

		for (let j = 0; j < param.num; j++) {
			let obj = {};
			for (let i = 0; i < keyArr.length; i++) {
				let mockTmp = mockArr[i] || '@ctitle(3, 5)'
				obj[keyArr[i]] = Mock.mock(mockTmp);
			}

			bodyArr.push(obj);

		}
		return bodyArr;

	}
}

export function tableZcs() {
	'ngInject';

	let directive = {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/tableZcs/table_tmp.html',
		controller: tableZcsController,
		/*controllerAs: 'vm',
		bindToController: true,*/
		scope: {
			/*tableConf:'@'*/
		},
		link: linkFunc
	};

	return directive;

	function linkFunc(scope, el, attr) {

		scope.$watch(() => attr.theadConf, n => {
			if (angular.isUndefined(n) || n === '') return;

			scope.table.theadConf = angular.fromJson(n);

		});

		scope.$watch(() => attr.tbodyArr, n => {
			if (angular.isUndefined(n) || n === '') return;

			scope.table.tbodyArr = angular.fromJson(n);

		})

		scope.$watch(() => attr.tableFilter, n => {
			if (angular.isUndefined(n) || n === '') return;

			scope.table.filter = angular.fromJson(n);

		})

		scope.$watch(() => attr.tableConf, n => {
			if (angular.isUndefined(n) || n === '') return;

			scope.table.conf = Object.assign({}, scope.table.conf, angular.fromJson(n));

		})

		scope.table.elm = el;


		//表头同步表格滚动距离
		let syncElmTag = el.find('div.table')

		syncElmTag.on('scroll', () => {
			scope.navLeft = -syncElmTag.scrollLeft();
			scope.$apply();
		})
	}

}
/**
 *
 * $scope.$emit('tbalePageParamChange',{'curNum',val});
 */
class tableZcsController {
	constructor($scope, $log) {
		'ngInject';

		$scope.$on('editRowData',(e,d)=>{
			$scope.table.tbodyArr[d.rowIndex] = Object.assign({},$scope.table.tbodyArr[d.rowIndex],d.rowData);
			//syncTableCss();
		})

		$scope.table = Object.assign({}, TABLE_BASE);

		$scope.table.conf = {
			showCog: true,
			actions: [/*{
				type: 'edit',
				name: '编辑'
			},{
				type: 'action',
				name: '操作'
			}*/],
			actionsWidth:0
		}

		$scope.$watch('table.conf.actions',n=>{
			if (angular.isUndefined(n)) {
				return;
			}
			let width = 0;
			n.forEach(i=>{
				width+=(GetLength(i.name)*8 + 20)
			})

			$scope.table.conf.actionsWidth = width;
		})
		/**
		 * 过滤条件监听事件相关
		 */

		$scope.$watch('table.filter', n => {

			if (angular.isUndefined(n)) {
				return;
			}

			for (let i in $scope.table.theadConf) {
				$scope.table.theadConf[i].checked = false;
				n.forEach((n) => {
					$scope.table.theadConf[n].checked = true;
					let newW = GetLength($scope.table.theadConf[n].value) * 8;
					let oldW = $scope.table.theadConf[n].width
					$scope.table.theadConf[n].width = newW > oldW ? newW : oldW;
				})
			}

			syncTableCss();

		})



		/**
		 * 表格内容监听事件相关
		 */

		$scope.tableStyle = {
			'overflow-x': 'hidden',
			'width': 10,
			'overflow-y': 'hidden'
		}

		$scope.$watch('table.tbodyArr', n => {

			if (angular.isUndefined(n)) return;


			//根据类容更新对应字段宽度
			n.forEach((i) => {
				for (let m in i) {
					let newW = GetLength(i[m]) * 8 + 2
					newW = newW > 200 ? 200 : newW;

					if (newW > $scope.table.theadConf[m].width) {
						$scope.table.theadConf[m].width = newW
					}
				}
			});

			syncTableCss();
		},true);

		let syncTableCss = () => {
			//根据类容初始化表格宽度
			$scope.tableStyle.width = $scope.table.conf.actionsWidth+10;

			for (let i in $scope.table.theadConf) {
				if ($scope.table.theadConf[i].checked) {
					$scope.tableStyle.width += $scope.table.theadConf[i].width
				}
			}

			//表格X轴滚动判断,

			let tableStyle = {};

			if ($scope.tableStyle.width > $scope.table.elm.width()) {
				tableStyle = {
					'overflow-x': 'scroll'
				}
			} else {
				tableStyle = {
					'width': $scope.table.elm.width(),
					'overflow-x': 'hidden'
				}
			}

			//表格X轴滚动判断,

			if ($scope.table.tbodyArr.length * 24 > $scope.table.elm.find('ul.table-body').height()) {
				tableStyle = Object.assign({}, tableStyle, {
					'overflow-y': 'scroll'
				});
			} else {
				tableStyle = Object.assign({}, tableStyle, {
					'overflow-y': 'hidden'
				});
			}

			$scope.tableStyle = Object.assign({}, $scope.tableStyle, tableStyle);
		}

		/**
		 * 分页功能
		 */

		$scope.setCurNum = val => {
			TABLE_BASE.curNum = val;
			$scope.table = Object.assign($scope.table, TABLE_BASE);
			$scope.$emit('tbalePageParamChange', {
				'curNum': val
			});
		}

		/**
		 * 翻页功能
		 */

		$scope.setCurIndex = val => {
			TABLE_BASE.curIndex = val;
			$scope.table = Object.assign($scope.table, TABLE_BASE);
			$scope.$emit('tbalePageParamChange', {
				'curIndex': val
			});
		}

		/**
		 * 显示过滤功能的popBox
		 */

		$scope.showFilterBox = () => {
			angular.element('#myModal').modal('toggle');
			//$scope.table.conf.showFilterBox=bool
		}


		/**
		 * 表字段自定义功能
		 */

		$scope.changeFilter = () => {
			let newFilter = [];
			$scope.table.elm.find('div.modal-body input:checkbox').each((i, n) => {
				if (angular.element(n).is(':checked')) {
					newFilter.push(angular.element(n).attr('key'));
				}
			})

			$scope.table.filter = newFilter;

			angular.element('#myModal').modal('toggle');
		}

		$scope.theadConfActions = bool => {
			$scope.table.elm.find('div.modal-body input:checkbox').each((i, n) => {
				angular.element(n).prop('checked', true);
				if (bool && i > 5) {
					angular.element(n).prop('checked', false);
				}
			})
		}


		$scope.rowClick = (rowData,rowIndex,actions) => {

			$scope.$emit('rowActionsClick',{
				rowData:rowData,
				rowIndex:rowIndex,
				actions:actions
			})
		}

		/**
		 * 辅助方法计算字符串的长度
		 */


		let GetLength = (str) => {
			///<summary>获得字符串实际长度，中文2，英文1</summary>

			///<param name="str">要获得长度的字符串</param>

			let realLength = 0,
				len = str.length,
				charCode = -1;
			for (let i = 0; i < len; i++) {
				charCode = str.charCodeAt(i);
				if (charCode >= 0 && charCode <= 128) realLength += 1;
				else realLength += 2;
			}
			return realLength;
		};
	}

	/*setCurNum(val){
		TABLE_BASE.curNum = val;
		$scope.table = Object.assign($scope.table,TABLE_BASE);
	}

	setcurIndex(val){
		TABLE_BASE.curIndex = val;
		$scope.table = Object.assign($scope.table,TABLE_BASE);
	}*/
}