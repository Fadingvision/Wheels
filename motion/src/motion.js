import {DEFAULT_ANI_CONFIG} from './config';
import {is, flattenArray, toArray, select, getOriginValue, decomposeValue} from './util'; // eslint-disable-line

export default class Motion {
	// set motionInstance by params
	constructor(target, properties, setting = {}) {
        this.init(target, properties, setting);
	}

    init(target, properties, setting) {
        this.targets = this.getTargets(target);
        this.properties = this.getproperties(properties);
        this.setting = Object.assign({}, DEFAULT_ANI_CONFIG, setting);
        this.animatables = this.getAnimatables(this.targets, this.properties, this.setting);

        if(this.setting.autoPlay) this.play();
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
        // loop the every property of every target
        targets.forEach((tarObj) => {
            let {target} = tarObj;

            properties.forEach((prop) => {
                let obj = Object.assign({}, prop, setting);
                // assume it always exist the animation type
                obj.target = target;
                obj.from = getOriginValue(target, prop.name);
                obj.to = decomposeValue(prop.value);

                animatables.push(obj);
            })
        })

        return animatables;
    }

	tick() {
		const {setting} = this;

	}

	play() {
		this.raf = window.requestAnimationFrame(this.tick);
	}
}