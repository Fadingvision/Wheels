## motion.js

### �ܹ�ѧ��ʲô��
1. Ҫʵ��ʲô���������ʲô���⣬��������˼·���࿴��������ôʵ�ֵģ�����Щ��ֵ�ý����ѧϰ�ĵط���
2�� ��ô�ӽ�����������֣�Ȼ��˼��api��ô���, ��Щ�Ǳ�¶��ȥ�ģ���Щ���ڲ�ʵ�ֵġ�˼����������Ľṹ������Щ������ʵ�����api,������Ŀ�Ĵ�������������������ġ�
3�� ��ô��˼·ת��Ϊʵ�ʵĴ��룬�������֯��װ�����ģʽ���������ģ�黯��������Ż�ϸ�ڡ�
4�� �Ż���

### ���嵽�����Ŀ

#### 1. ʵ��ʲô�����ʲô���⣿

#### 2. ˼·��
��ôʵ�֣�
dom �����ı�����ʲô�� JS_DOM������ʵ��ԭ����ô��һ��Ԫ�ض�������
ѧϰ�ͽ��velocity.js , anime.js

#### 3. API��ƺ�ʵ��

- �ο�����api��ƣ��ο�css��������ο�����easing-function��ʵ�ֺ�ʹ�ã���Ƹ��ֻص���
- ��ô��ȡ���п��Զ���dom�ڵ㡣
- ��ô��һ�����Զ���ת���������ڴ�����ʹ�õĽṹ���ܹ��õ������յ㡣
- ��ôͬʱ�ö��Ԫ���˶���������Ӱ��ͳ�ͻ����ô�ö��ʵ��ͬʱӵ���Լ����˶����̡�
- ��Щ�ӿ��Ǳ�¶��ȥ�ģ���Щ���ڲ�ʵ�ֵġ�
- ��ôʵ�ָ���setting��������÷�����
- ��ô��һ��Ԫ�ص��˶����� ת���� �����������ģ��Ӷ�ת��Ϊ������̣�һ��Ԫ���˶������������������ġ�
- ����ϸ�ڣ���ô����css��svg��transform,��ôʹ��easing-function,��ôʹ��requstAnimation.
-���ο�jquery��queue����ES6��generator������ƶ�������
- ��ô֧��transform��������ɫ����,svg��������

#### 4. ��������д

- ��ô��ļ�Ŀ¼�ṹ�����������ļ���ڣ������Ǹ��������������ǳ������ã���Щ�������Զ���д��һ������ļ���
  ģ�黯��ǰ���±���һ���ļ��Ĵ���������Ҫ����100�У�����100�еĴ���ͻ�Ƚ������Ķ���ά����
- ��ô���������ܹ�����Щ��Ҫ��¶��ȥ�ģ��Ȱ�һ����Ҫʵ�ֵķ���������д�ã���Ҫ����ȥ���ϸ�ڡ�
- ����˼����Щ�������Ծۺϳ�һ���࣬�����߼��������ڲ�ʵ�֣�Ȼ����Ⱪ¶�ӿڣ��������������ķ�ʽ������
- ˼�������õ���Щ���ģʽ���ô���ɶ��ԣ���ά���ԣ������Ը�ǿ��

1. ����ģʽ��ʵ��easing-function,����������
2. ������ģʽ��ʵ�ֶ���������е���������ͬʱ���ж��������ѭ�����С�
3. ����-������ģʽ����ʵ�ֶ����ص���֪ͨ�������е����á�
4. ����ģʽ��������ʵ�ֶ������С�

#### 5. �Ż��Ͳ���


### **(version: 0.1.0)**
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



## velocity.js����ѧϰ

### jQuery-shim

### Helper Function

* requestAnimationFrame shim
* nodeList => slice.call() not working in IE < 9, so it can only use 'for' to traversal the NodeList to Array
* Type check methods (variable.nodeType can check a variable is or isn't a Node)

### Dependencies

### Constant

### Velocity State











































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