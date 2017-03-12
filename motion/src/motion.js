import {DEFAULT_ANI_CONFIG} from './config';
import {is, flattenArray, toArray, select, getOriginValue, decomposeValue} from './util'; // eslint-disable-line
import tween from './tween';

class Motion {
	// set motionInstance by params
	constructor(target, properties, setting) {
        this.init(target, properties, setting);
        if(this.setting.autoPlay) this.play();
	}

    init(target, properties, setting) {
        this.targets = this.getTargets(target);
        this.properties = this.getproperties(properties);
        this.setting = Object.assign({}, DEFAULT_ANI_CONFIG, setting);
        this.animatables = this.getAnimatables(this.targets, this.properties, this.setting);
        this.totalDuration = this.setting.duration + this.setting.delay;

        this.time = 0; // 开始运动后的时间
        this.percent = 0; // 运动进程百分比
        this.running = false; // 是否正在运动
        this.ended = false; // 运动是否已经结束

        this.progress = {}; // 记录运动声明周期中的各种参数
    }

    // resolve targets from params
    getTargets(tarParam) {
        let tar = is.string(tarParam) ? select(tarParam) : tarParam;
        tar = toArray(tar);
        return tar.map((target, id) => ({target, id}))
    }

    getproperties(p) {
        return Object.keys(p).map(key => ({name: key, value: p[key]}));
    }

    getAnimatables(targets, properties, setting) {
        let animatables = [];
        // 因为每个元素的起始属性位置不一样，因此需要每个元素都生成一个数组
        targets.forEach((tarObj) => {
            let {target} = tarObj;

            properties.forEach((prop) => {
                let obj = Object.assign({}, prop, setting);
                // TO_DO: 先只考虑普通css类型的运动
                obj.target = target;
                obj.from = getOriginValue(target, prop.name);
                obj.to = decomposeValue(prop.value);

                animatables.push(obj);
            })
        })
        // return this.getTweens(animatables);
        return animatables;
    }

    // TO_DO: 应该运动过程相同的元素提出来，减少循环量，提高性能
    getTweens(animatables)　{} // eslint-disable-line



    /**
     * 根据当前的时间比例，起始值和终点值算出当前值
     * @param  {[type]} anim [description]
     * @param  {[type]} currentTime [description]
     * @return {[type]}      [description]
     */
    getCurrentValue(anim, currentTime) {
        const {setting} = this;
        let runningTime = Math.max(currentTime - anim.delay, 0);
        let passed = Math.min(runningTime, setting.duration);
        let percent = passed / setting.duration;

        let eased = tween[setting.easing](percent, setting.elasticity);

        let start = anim.from.number;
        let end = anim.to.number;
        let currentValue = start + eased * (end - start);

        return currentValue + anim.to.string;
    }

    setAnimationProgress(currentTime) {

        this.time = Math.min(currentTime, this.totalDuration); // 不能让动画时间超过定义的过渡时间
        this.percent = (this.time / this.totalDuration) * 100;
        this.animatables.forEach((anim) => {
            anim.currentValue = this.getCurrentValue(anim, currentTime);
            let {currentValue} = anim;

            anim.target.style[anim.name] = currentValue;
        })
        if (this.setting.update) this.setting.update(this);
    }

    // 启动动画声明周期
	play() {
        const zero = 0;
        this.stop();
        this.running = true;

        this.progress.start = Date.now();
        // 用于保存暂停后重新启动的时候，暂停之前运动持续的时间
        this.progress.last = this.ended ? zero : this.time;

        let tick = this.tick.bind(this);
		this.raf = window.requestAnimationFrame(tick);
	}

    // 动画生命周期
    tick() {
        const {setting: s, progress} = this;
        if(!this.running) return;

        this.ended = false;
        progress.now = Date.now();
        progress.current = progress.last + progress.now - progress.start;

        // 真正对元素进行设置值，让元素产生动画
        this.setAnimationProgress(progress.current);

        if(s.begin && progress.current >= s.delay ) {
            s.begin(this);
            s.begin = null;
        }
        // 如果动画持续时间已经大于过渡时间，则停止动画
        if(progress.current >= this.totalDuration) {
            this.stop();
            this.ended = true;
            s.complete && s.conplete(this);
        } else { // 继续执行动画
            this.raf = window.requestAnimationFrame(() => this.tick());
        }
    }

    stop() {
        this.running = false; // 暂停不代表结束
        this.raf && window.cancelAnimationFrame(this.raf);
    }
}

/**
 * main export
 * @param  {[type]} target     [description]
 * @param  {[type]} properties [description]
 * @param  {Object} setting    [description]
 * @return {[type]}            [description]
 */
function motion(target, properties, setting = {}) {
    return new Motion(target, properties, setting);
}

module.exports = motion;

