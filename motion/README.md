## motion.js

### 能够学到什么？
1. 要实现什么东西，解决什么问题，解决问题的思路，多看别人是怎么实现的，有哪些是值得借鉴和学习的地方。
2。 怎么从解决的问题入手，然后思考api怎么设计, 哪些是暴露出去的，哪些是内部实现的。思考整个代码的结构，用哪些方法来实现这个api,整个项目的代码的生命周期是怎样的。
3。 怎么把思路转化为实际的代码，代码的组织封装，设计模式，代码抽象模块化，具体的优化细节。
4。 优化。

### 具体到这个项目

#### 1. 实现什么，解决什么问题？

#### 2. 思路：
怎么实现：
dom 动画的本质是什么？ JS_DOM动画的实现原理？怎么让一个元素动起来。
学习和借鉴velocity.js , anime.js

#### 3. API设计和实现

- 参考其他api设计，参考css动画概念，参考各种easing-function的实现和使用，设计各种回调。
- 怎么获取所有可以动的dom节点。
- 怎么将一个属性对象转换成易于在代码中使用的结构，能够拿到起点和终点。
- 怎么同时让多个元素运动而不互相影响和冲突，怎么让多个实例同时拥有自己的运动进程。
- 哪些接口是暴露出去的，哪些是内部实现的。
- 怎么实现各种setting里面的配置方法。
- 怎么将一个元素的运动过程 转换成 人类易于理解的，从而转换为代码过程，一次元素运动的生命周期是怎样的。
- 各种细节，怎么区分css和svg和transform,怎么使用easing-function,怎么使用requstAnimation.
-（参考jquery的queue或者ES6的generator）来设计动画队列
- 怎么支持transform动画、颜色过渡,svg动画过渡

#### 4. 具体代码编写

- 怎么搭建文件目录结构，哪里是主文件入口，哪里是辅助函数，哪里是抽离配置，哪些东西可以独立写成一个类和文件，
  模块化的前提下保持一个文件的代码行数不要超过100行，超过100行的代码就会比较难以阅读和维护。
- 怎么搭建代码整体架构，哪些是要暴露出去的，先把一个个要实现的方法函数名写好，不要急于去填充细节。
- 尽量思考哪些东西可以聚合成一个类，让其逻辑尽量在内部实现，然后对外暴露接口，尽量用面向对象的方式开发。
- 思考可以用到哪些设计模式，让代码可读性，可维护性，抽象性更强。

1. 策略模式来实现easing-function,缓动函数。
2. 迭代器模式来实现动画数组进行迭代，可以同时进行多个动画的循环进行。
3. 发布-订阅者模式可以实现动画回调，通知动画队列的作用。
4. 命令模式可以用来实现动画队列。

#### 5. 优化和测试


### **(version: 0.1.0)**
(知识体系： EventEmitter, Promise, queue, generator等)
(设计模式：迭代器模式、外观模式、策略模式、命令模式等)

## API
----

#### **1.主函数**

```javascript
motion(target, properties, options);

```
**explain:**

- target: css Selector, dom, NodeList; (wait: object, array)
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



## velocity.js分析学习

### jQuery-shim

### Helper Function

* requestAnimationFrame shim
* nodeList => slice.call() not working in IE < 9, so it can only use 'for' to traversal the NodeList to Array
* Type check methods (variable.nodeType can check a variable is or isn't a Node)

### Dependencies

### Constant

### Velocity State











































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