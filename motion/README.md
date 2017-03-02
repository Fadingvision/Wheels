## motion.js

#### **(version: 0.1.0)**
(知识体系： EventEmitter, Promise, queue, generator等)
(设计模式：迭代器模式、外观模式、策略模式、命令模式等)

## API
----

#### **1.主函数**

```javascript
motion(target, properties, options);

```
**explain:**

- target: css Selector, dom; (wait: NodeList, object, array)
- properties: css property object(include transform property, color transform)(wait: SVG, DOM, OBject properties)
- options:　object

1. duration: number; (wait: function)
2. delay: number;(wait: function)
3. easing: string;(wait: function)
4. loop: number;(可以重複動畫多少次)
5. direction: 'reverse';(从后往前播放动画)
6. autoPlay: false, (是否自动执行动画)

7: callbacks:

begin: (动画开始的时候执行)
run: (动画每帧的时候执行一次)
done: (动画结束的时候执行一次)



#### **动画队列: sequence**　(参考jquery的queue或者ES6的generator)

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






## anime.js学习分析


###  结构分析

#### Default Config
默认配置（实例，缓动函数，可以作为动画属性的transform属性）

#### Util工具函數

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


#### 获取运动元素的value值


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
#### 获取运动元素的所有课进行动画的属性

#### 获取运动元素的路径


#### 获取运动元素

normalizeTweens()该函数将所有的参数解析成一个运动对象配置。



#### 创建实例

createNewInstance(params) => return config object;


### **CORE MODULE**


#### 动画引擎engine
用于定义requestAnimationFrame来真正的形成动画效果。

#### 动画实例函数对象


































## 动画引擎所需知识点

### 1. 准确的获取元素的样式（包含普通样式，transform样式，颜色rgb值）

### 2. 熟悉常用的缓动函数（easeIn, easeOut, easeInOut, linear;)

- Sine表示由三角函数实现的缓动函数
- Quad 是二次方
- Cubic是三次方
- Quart是四次方
- Qunit是五次方
- Circ使用开平方恨的Math.sqit
- Expo使用开立方根
- Elastic是结合三角函数与开立三方根的初级弹簧效果
- Back是使用了一个1.70158的常数来计算的回退效果
- Bounce是高级弹簧效果

### 3. API设计

* 队列（数组）（insertFrame, deleteFrame, enterFrame）
* 补间动画
* 回调函数
* 分析关键帧(parseFrames)，每个关键帧包含样式名，缓动公式、开始值（默认计算）、结束值（用户传入）、单位和类型。
类型通常又分为颜色值变换，滚动变换，以及默认变换。

### 4. requestAnimationFrame

### 5. css3的一些动画知识