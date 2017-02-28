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
3. easing function: string;(wait: function)
4. loop: number;(可以重複動畫多少次)
5. direction: 'reverse';(从后往前播放动画)
6. autoPlay: false, (是否自动执行动画)

7: callbacks:

begin: (动画开始的时候执行)
run: (动画每帧的时候执行一次)
done: (动画结束的时候执行一次)



#### **动画队列: sequence**　(参考jquery的queue或者ES6的generator)

```javascript
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

