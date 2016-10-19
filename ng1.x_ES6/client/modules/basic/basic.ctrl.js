import ValidatorFactory from '../../utils/util';

/**
 * 获取字符串长度，中文为２，英文和数字为１
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
const getLen = function(str) {
    if (str === null) return 0;
    if (typeof str != 'string') str += '';
    return str.replace(/[^\x00-\xff]/g, '01').length;
};
let state;
let localStorage;
class BasicCtrl{
    /* @ngInject */
    constructor(localStorageService, $scope, $rootScope, $state) {
        let localBasic = localStorageService.get('basic');
        state = $state;
        localStorage = localStorageService;
        let basic = {
            name: '',
            phone: '',
            idNum: '',
            qq: '',
            email: '',
            isStudent: '0'
        };
        this.basic = localBasic || basic;

        /**
         * 提示信息弹出层
         * @type {Boolean}
         */
        this.isShow = false;
        this.msg = '';
    }


    showMsg(msg) {
        this.isShow = true;
        this.msg = msg;
    }


    vertifyInputNum() {
        if(getLen(this.basic.name.trim()) > 20) {
            this.basic.name = this.basic.name.slice(0, 10);
        }
    }


    vertifyInfo() {
        let validatorIns = new ValidatorFactory();
        validatorIns
            .addRule(this.basic.name, [
                {rule: 'isEmpty', errMsg: '请输入姓名!'},
                {rule: 'isMaxLength:20', errMsg: '姓名不能超过10个字!'}])
            .addRule(this.basic.phone, [{rule: 'isIegalPhone', errMsg: '请输入正确的手机号'}])
            .addRule(this.basic.idNum, [{rule: 'isIegalID', errMsg: '请输入正确的身份证号码'}]);
        if(this.basic.qq) {
            validatorIns
            .addRule(this.basic.qq, [{rule: 'isNumber', errMsg: '请输入正确的qq号'}]);
        }
        if(this.basic.email) {
            validatorIns
            .addRule(this.basic.email, [{rule: 'isIegalEmail', errMsg: '请输入正确的邮箱'}]);
        }
        let res = validatorIns.startVal(this.showMsg.bind(this));
        if(!res) return false;
        localStorage.set('basic', this.basic);
        state.go('applicationForm.loan');
    }
}

export default BasicCtrl;