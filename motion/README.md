## motion.js

#### **(version: 0.1.0)**
(֪ʶ��ϵ�� EventEmitter, Promise, queue, generator��)
(���ģʽ��������ģʽ�����ģʽ������ģʽ������ģʽ��)

## API
----

#### **1.������**

```javascript
motion(target, properties, options);

```
**explain:**

- target: css Selector, dom; (wait: NodeList, object, array)
- properties: css property object(include transform property, color transform)(wait: SVG, DOM, OBject properties)
- options:��object

1. duration: number; (wait: function)
2. delay: number;(wait: function)
3. easing: string;(wait: function)
4. loop: number;(�������}�Ӯ����ٴ�)
5. direction: 'reverse';(�Ӻ���ǰ���Ŷ���)
6. autoPlay: false, (�Ƿ��Զ�ִ�ж���)

7: callbacks:

begin: (������ʼ��ʱ��ִ��)
run: (����ÿ֡��ʱ��ִ��һ��)
done: (����������ʱ��ִ��һ��)



#### **��������: sequence**��(�ο�jquery��queue����ES6��generator)

```
var mySequence = motion.sequence({
    diretion: ',',
    loop: 3,
    autoPlay: false,
})

mySequence.add({

}}
```


#### **play, pause, restart**

```javascript
var playPauseAnim = motion('div',{
    translateX: 250,
}, {
  direction: 'alternate',
  loop: true,
  autoPlay: false // prevent the instance from playing
});

playPauseAnim.play(); //  Manually play
playPauseAnim.pause(); //  Manually pause
playPauseAnim.finish(); //  Manually finish
playPauseAnim.restart(); // Restart the animation and reset the loop count / current direction
playPauseAnim.reverse(); // Change the animation direction

playPauseAnim.finished : //  returns a Promise object which will resolve once the animation has finished running.
```


#### easing Functions


Penner's equations:

| easeIn | easeOut | easeInOut
| --- | --- | ---
| easeInQuad | easeOutQuad | easeInOutQuad |
| easeInCubic | easeOutCubic | easeInOutCubic
| easeInQuart | easeOutQuart | easeInOutQuart
| easeInQuint | easeOutQuint | easeInOutQuint
| easeInSine | easeOutSine | easeInOutSine
| easeInExpo | easeOutExpo | easeInOutExpo
| easeInCirc | easeOutCirc | easeInOutCirc
| easeInBack | easeOutBack | easeInOutBack
| easeInElastic | easeOutElastic | easeInOutElastic






## anime.jsѧϰ����


###  �ṹ����

#### Default Config
Ĭ�����ã�ʵ��������������������Ϊ�������Ե�transform���ԣ�

#### Util���ߺ���

* includes,
* is,
* bezier_function,
* easing_function(['Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ', 'Back', 'Elastic']),
* string manipulate function
* arrays manipulate function
	- return array's length
	- flateen array
	- nodelist to array
	- array contains some element (using the es5 some function instead of array.indexOf)
* object manipulate function
	- for in
	- shallow clone object
	- object.has

* color => rgb (hex, hsl => rgb)

* get property Unit (20px,em, deg => px, em, deg)

* get property Unit (20px,em, deg => px, em, deg)


#### ��ȡ�˶�Ԫ�ص�valueֵ


* getAnimationType (normal css, transform, attribute(like scrollTop, scrollLeft))

* getOriginalTargetValue()

```javascript
getOriginalTargetValue => {
	case getAnimationType():
		css: return getCssValue()
		transform: return getTransformValue()
		attribute: return getAttribute()
}
```
#### ��ȡ�˶�Ԫ�ص����пν��ж���������

#### ��ȡ�˶�Ԫ�ص�·��


#### ��ȡ�˶�Ԫ��

normalizeTweens()�ú��������еĲ���������һ���˶��������á�



#### ����ʵ��

createNewInstance(params) => return config object;


### **CORE MODULE**


#### ��������engine
���ڶ���requestAnimationFrame���������γɶ���Ч����

#### ����ʵ����������


































## ������������֪ʶ��

### 1. ׼ȷ�Ļ�ȡԪ�ص���ʽ��������ͨ��ʽ��transform��ʽ����ɫrgbֵ��

### 2. ��Ϥ���õĻ���������easeIn, easeOut, easeInOut, linear;)

- Sine��ʾ�����Ǻ���ʵ�ֵĻ�������
- Quad �Ƕ��η�
- Cubic�����η�
- Quart���Ĵη�
- Qunit����η�
- Circʹ�ÿ�ƽ���޵�Math.sqit
- Expoʹ�ÿ�������
- Elastic�ǽ�����Ǻ����뿪���������ĳ�������Ч��
- Back��ʹ����һ��1.70158�ĳ���������Ļ���Ч��
- Bounce�Ǹ߼�����Ч��

### 3. API���

* ���У����飩��insertFrame, deleteFrame, enterFrame��
* ���䶯��
* �ص�����
* �����ؼ�֡(parseFrames)��ÿ���ؼ�֡������ʽ����������ʽ����ʼֵ��Ĭ�ϼ��㣩������ֵ���û����룩����λ�����͡�
����ͨ���ַ�Ϊ��ɫֵ�任�������任���Լ�Ĭ�ϱ任��

### 4. requestAnimationFrame

### 5. css3��һЩ����֪ʶ