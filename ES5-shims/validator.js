var validator = {
    // '', undefined, null, NaN, 0, false
    isEmpty: function(val) {
        if (typeof val === 'string') val = val.trim();
        return !val;
    },

    isPositiveInteger: function(val) {
        if (!this.isNumber(val)) return false;
        val = +val;
        return (val > 0 && Math.floor(val) === val);
    },

    isNumber: function(val) {
        return /^[0-9]*$/.test(val);
    },

    isPositiveNum: function(val) {
        return (this.isNumber(val) && +val > 0);
    },

    isChinese: function(val) {
        return /^[\\u4e00-\\u9fa5]{0,}$/.test(val);
    },

    isIegalPhone: function(val) {
        return /^1[3|4|5|8][0-9]\d{4,8}$/.test(val);
    },

    // bugFix
    isIegalID: function(val) {
        var reg15 = /^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$/,
            reg18 = /^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$/;
        return (reg15.test(val) || reg18.test(val));
    },

    isIegalEmail: function(val) {
        return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val);
    },
};


function upload(fileId, imgId) {
    var file,
        reader,
        fileEl = document.getElementById(fileId),
        pic = document.getElementById(imgId);

    fileEl.addEventListener('change', function(e) {
        file = fileEl.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件类型为图像类型");
            pic.src = fileEl.value = '';
            return false;
        }
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            pic.src = this.result;
        }

        return file;
    }, false);
}


// alertDirec
angular.directive('alertDirec', alertDirec);

alertDirec.$inject = [];
function alertDirec(){
    return{
        restrict: 'E',
        link: link,
        templateUrl: '',
        replace: true,
        scope: {
            msg: '@',
            isShow: '=',
            action: '&',
            delay: '@'
        },
        link: link

    };
    function link(scope, element, attrs) {
        scope.delay || (scope.delay = 3000);
        var timer = null;
        scope.watch('isShow', function(oldVal, newVal) {
            if(newVal === true) {
                timer && clearTimeout(timer);
                timer = setTimeout(function() {
                    scope.isShow = false;
                    scope.action && scope.action();
                }, scope.delay);
            }
        })     
    }
}