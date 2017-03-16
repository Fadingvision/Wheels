export const DEFAULT_ANI_CONFIG = {
	duration: 1000,
	delay: 0,
	easing: 'easeOutElastic',
	elasticity:	500,
	begin: undefined,
	update: undefined,
	complete: undefined,

	round: false,
	loop: 1,
	direction: 'normal',
	autoPlay: true,
};

export const validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];