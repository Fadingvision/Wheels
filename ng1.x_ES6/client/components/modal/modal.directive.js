import template from './modal.html';
import modalStyle from './modal.less';

let link = (scope) => {
    scope.delay || (scope.delay = 3000);
    var timer = null;
    scope.$watch('isShow', (newVal) => {
        if (newVal === true) {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                scope.isShow = false;
                scope.action && scope.action();
                scope.$apply();
            }, scope.delay);
        }
    })
};
let alertDirec = () => {
    const ddo = {
        restrict: 'E',
        link,
        template,
        // replace: true,
        scope: {
            // 必须传
            msg: '=',
            isShow: '=',
            // 选传
            action: '&',
            delay: '@'
        },
    };
    return ddo;
}

export default alertDirec;


