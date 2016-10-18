import template from './modal.html';
import modalStyle from './modal.less';

let link = (scope, element, attrs) => {
    scope.delay || (scope.delay = 3000);
    var timer = null;
    scope.$watch('isShow', (newVal, oldVal) => {
        if (newVal === true) {
            timer && clearTimeout(timer);
            timer = window.setTimeout(function() {
                scope.isShow = false;
                scope.action && scope.action();
                scope.$apply();
            }, scope.delay);
        }
    })
};

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

let alertDirec = function() {
    return ddo;
}

export default alertDirec;


