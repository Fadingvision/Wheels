import {DEFAULT_ANI_CONFIG} from './config';


function getAnimatablesFromTargets() {
	
}




export default class Motion {
	// set motionInstance by params
	constructor(target, properties, setting = {}) {
		this.config = this.init(target, properties, setting);
	}

	init(target, properties, setting) {
		const animationCofig = Object.assign({}, DEFAULT_ANI_CONFIG, setting);
		return { target, properties, animationCofig}
	}

	tick() {
		const {config} = this;

	}

	play() {
		this.raf = window.requestAnimationFrame(this.tick);
	}
}