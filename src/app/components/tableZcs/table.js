export let TABLE_BASE = {
	curNum: 40,
	curIndex: 1,
	keyArr: []
};

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
		};

		this.keyArr = TABLE_BASE.keyArr = keyArr;
	}

	getTableHeads() {

		let headConf = {};
		let keyArr = this.keyArr

		keyArr.forEach((n) => {
			headConf[n] = {
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

		mockArr = randArray(mockArr);

		for (let j = 0; j < param.num; j++) {
			let obj = {};
			for (let i = 0; i < keyArr.length; i++) {
				let mockTmp = mockArr[i] || '@ctitle(3, 5)'
				obj[keyArr[i]] = Mock.mock(mockTmp);
			};

			bodyArr.push(obj);

		};
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
		/*controllerAs: 'vm',*/
		//bindToController: true,
		scope: {
			/*'headConf':'@',
			'tbodyArr':'@',
			'tableFilter':'@'*/
		},
		link: linkFunc
	};

	return directive;

	function linkFunc(scope, el, attr, vm) {
		scope.$watch(() => attr.theadConf, n => {
			if (n !== undefined) {
				scope.tableData.theadConf = JSON.parse(n);
			}
		});

		scope.$watch(() => attr.tbodyArr, n => {
			if (n !== undefined) {
				scope.tableData.tbodyArr = JSON.parse(n);
			}
		})

		scope.$watch(() => attr.tableFilter, n => {
			if (n !== undefined) {
				scope.tableData.tableFilter = JSON.parse(n);
			}
		})

		scope.tableData.elm = el;
	}

}
/**
 *
 * $scope.$emit('tbalePageParamChange',{'curNum',val});
 */
class tableZcsController {
	constructor($scope,$document) {
		'ngInject';

		$scope.tableData = Object.assign({},TABLE_BASE);

		$scope.$watch('tableData.tableFilter', n => {

			if (n === undefined) return;

			n.forEach((n) => {
				$scope.tableData.theadConf[n].checked = true;
				$scope.tableData.theadConf[n].width = GetLength($scope.tableData.theadConf[n].value) * 8
			})

		})

		let autoWidth = 10;

		$scope.tableStyle = {
			'overflow-x':'hidden',
			'width':'100%',
			'overflow-y':'hidden'
		}

		$scope.$watch('tableData.tbodyArr', n => {

			if (n === undefined) return;
			

			//根据类容更新对应字段宽度
			n.forEach((i) => {
				$scope.tableData.tableFilter.forEach(n => {
					let newW = GetLength(i[n]) * 8
					newW = newW > 200 ? 200 : newW;

					if(newW > $scope.tableData.theadConf[n].width){
						$scope.tableData.theadConf[n].width = newW
					}
				})
			});

			//表格X轴滚动判断,
			autoWidth = 10;

			for(let i in $scope.tableData.theadConf){
				if($scope.tableData.theadConf[i].checked){
					autoWidth+=$scope.tableData.theadConf[i].width
				}
			}

			var tableStyle = {}

			if(autoWidth>$scope.tableData.elm.width()){
				tableStyle = {
					'width':autoWidth,
					'overflow-x':'scroll'
				}
			}else{
				tableStyle = {
					'width':'100%',
					'overflow-x':'hidden'
				}
			}

			if(n.length*24>$scope.tableData.elm.find('ul.table-body').height()){
				tableStyle = Object.assign({},tableStyle,{
					'overflow-y':'scroll'
				});
			}else{
				tableStyle = Object.assign({},tableStyle,{
					'overflow-y':'hidden'
				});
			}

			$scope.tableStyle=Object.assign({},$scope.tableStyle,tableStyle);
		});

		$scope.setCurNum = val=>{
			TABLE_BASE.curNum = val;
			$scope.tableData = Object.assign($scope.tableData,TABLE_BASE);
			$scope.$emit('tbalePageParamChange',{'curNum':val});
		}

		$scope.setCurIndex = val=>{
			TABLE_BASE.curIndex = val;
			$scope.tableData = Object.assign($scope.tableData,TABLE_BASE);
			$scope.$emit('tbalePageParamChange',{'curIndex':val});
		}


		let GetLength = function(str) {
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
		$scope.tableData = Object.assign($scope.tableData,TABLE_BASE);
	}

	setcurIndex(val){
		TABLE_BASE.curIndex = val;
		$scope.tableData = Object.assign($scope.tableData,TABLE_BASE);
	}*/
}