import ValidatorFactory from '../../utils/util';
const getLen = function(str) {
    if (str === null) return 0;
    if (typeof str != 'string') str += '';
    return str.replace(/[^\x00-\xff]/g, '01').length;
};
class BasicCtrl{
    /* @ngInject */
    constructor(localStorageService) {
        let localBasic = localStorageService.get('basic');
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
        console.log(msg);
    };


    vertifyInputNum() {
        if(getLen(this.basic.name.trim()) > 20) {
            this.basic.name = this.basic.name.slice(0, 10);
        }
    }


    vertifyInfo() {
        var validatorIns = new ValidatorFactory();
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
        var res = validatorIns.startVal(this.showMsg.bind(this));
        if(!res) return false;

        console.log(res)

        // applicationCustomerFactory
        //     .saveBasicInfo(vm.basic).then(function(res){
        //         ErrorHandler(res, function(result) {
        //             localStorageService.set('basic', vm.basic);
        //             localStorageService.set('orderNum', result.data.orderNum);
        //             $rootScope.$isStudent = vm.basic.isStudent == 1 ? true : false;

        //             // remove the needless localStorage item.
        //             var removeKey = $rootScope.$isStudent ? 'job' : 'student';
        //             localStorageService.remove(removeKey);

        //             $state.go('applicationForm.loan');
        //         });
        //     }, function(res) {
        //         vm.showMsg('请检查输入！');
        //     })
    }
}

export default BasicCtrl;