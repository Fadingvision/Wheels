import ValidatorFactory from '../../utils/util';
import {productCat} from '../../consts/const.js';

/**
 * 计算每月还款数量
 * 计算规则 ==================>>>>
 * 选择保险：
 * 月还款金额=借款金额*（月利率+月服务费+月账户管理费率）*（1+月利率+月服务费+月账户管理费率）^期数/（（1+月利率+月服务费+月账户管理费率）^期数-1）
 * 不选择保险：
 * 月还款金额=借款金额*（月利率+月服务费+月账户管理费率+月保险手续费率）*（1+月利率+月服务费+月账户管理费率+月保险手续费率）^期数/（（1+月利率+月服务费+月账户管理费率+月保险手续费率）^期数-1）
 * 还款随心包=20元/月
 * @param  {[type]} totalLoan [description]
 * @return {[type]}           [description]
 */
function calculateMonthLoan(totalLoan) {
    totalLoan = parseInt(totalLoan, 10);
    var monthService = 0,
        monthRate = 0.015,
        monthManage = 0,
        stage = +this.loan.stage,
        monthEnsurance = this.loan.ensurance ?  0.006 : 0,
        packages = this.loan.package ?  20 : 0;

    var numerator = totalLoan * (monthEnsurance + monthManage + monthRate + monthService) * (Math.pow(1 + monthEnsurance + monthManage + monthRate + monthService, stage));
    var denominator = Math.pow(1 + monthEnsurance + monthManage + monthRate + monthService, stage) - 1;
    // 随心包改成+20 ---- 2016.9.30
    var res = Math.round(numerator / denominator) + packages;
    if(res !== res || res === Infinity ||　res < 0) res = 0;
    return res;
}

let localStorage;

// 这里应该把controller的函数体都写入constructor,
// 因为controller是个单例的函数，只会实例化一次，同时也不需要继承和被继承，
// 因此可以不用把函数体挂在原型上．

class LoanCtrl{

    /*@ngInject*/
    constructor(localStorageService, $scope, $rootScope, $state) {
        let basicInfo = localStorageService.get('basic');
        if(!basicInfo) $state.go('applicationForm.basic');
        localStorage = localStorageService;

        let loan = {
            productCat: '0',
            stage : '',
            ensurance : true,
            package : true,
            productName: '',
            productPrice: '',
            loanMoney: '',
            instalments: '0',
            bankNum: '',
            accountName: ''
        };
        // 贷款数据
        this.loan = localStorageService.get('loan') || loan;
        this.loan.orderNum = localStorageService.get('orderNum');

        this.productCat = productCat;

        /**
         * 提示信息弹出层
         * @type {Boolean}
         */
        this.isShow = false;
        this.msg = '';

        $scope.$watch('vm.loan.loanMoney', () => {
            this.loan.instalments = calculateMonthLoan.call(this, this.loan.loanMoney);
        });

        $scope.$watch('vm.loan.ensurance', () => {
            this.loan.instalments = calculateMonthLoan.call(this, this.loan.loanMoney);
        });

        $scope.$watch('vm.loan.package', () => {
            this.loan.instalments = calculateMonthLoan.call(this, this.loan.loanMoney);
        });

        $scope.$watch('vm.loan.stage', () => {
            this.loan.instalments = calculateMonthLoan.call(this, this.loan.loanMoney);
        });
    }

    init() {

    }



    showMsg(msg) {
        this.isShow = true;
        this.msg = msg;
        console.log(msg);
    };


    vertifyInfo() {
        let basicInfo = localStorage.get('basic');
        let validatorIns = new ValidatorFactory();
        validatorIns
            .addRule(this.loan.productCat, [{rule: 'isEmpty', errMsg: '请输入产品类别!'}])
            .addRule(this.loan.productName, [
                {rule: 'isEmpty', errMsg: '请输入产品名称!'},
                {rule: 'isMaxLength:40', errMsg: '产品名称不得超过20字!'}])
            .addRule(this.loan.productPrice, [{rule: 'isNumber', errMsg: '请输入正确的产品金额'}])
            .addRule(this.loan.loanMoney, [{rule: 'isNumber', errMsg: '请输入正确的借款金额'}])
            .addRule(this.loan.stage, [{rule: 'isNumber', errMsg: '请勾选分期期数'}])
            .addRule(this.loan.bankNum, [{rule: 'isNumber', errMsg: '请输入正确的银行卡号'}])
            .addRule(this.loan.accountName, [{rule: 'isEmpty', errMsg: '请输入账户名'}]);

        let res = validatorIns.startVal(this.showMsg.bind(this));
        let isEqual = (this.loan.accountName == basicInfo.name);
        if(res && !isEqual) this.showMsg('账户名与申请人姓名必须一致！');
        console.log('success submit');
    }
}

export default LoanCtrl;