import {validTransforms} from './config';

// type checking
export const is = {
    string: s => typeof s === 'string',
    node: s => s.nodeType > 0, // eslint-disable-line
    array: s => Array.isArray(s),
    number: s => typeof s === 'number',
    nodeList: s => s instanceof NodeList || s instanceof HTMLCollection, // only works in modern browser such as IE9+, chrome, firefox etc.
}

// Array methods
export const flattenArray = arr =>
    arr.reduce((a, b) => a.concat(is.array(b) ? flattenArray(b) : b), []);

export const toArray = arrayLike => [].slice.call(arrayLike);

// dom manipulate
export const select = str => document.querySelectorAll(str);

// get value


const value = {
    /**
     * getComputedStyle(element, null).float，it shoule be cssFloat/styleFloat.
     * so we use getPropertyValue instead of dot to get the property Value
     * only works in modern browser such as IE9+, chrome, firefox etc.
     */
    css: function getCssValue(node, propName) {
        return window.getComputedStyle(node, null).getPropertyValue(propName);
    },

    /**
     *
     * unfortunately getting the initial transforms values with getComputedStyle is tricky
     * It will return a transform matrix,
     * and the code needed to decode and extract the values from the matrix will double the size of the library!
     *
     * so if you're not specify the initial transform value of inline-style,
     * we'll set the transform value as if it has no transform value.
     *
     *
     * @return {number}         the transform value of the specific node
     */
    transform: function getTransformValue(node, property) {
        var transformStr = node.style.transform;
        /**
         * ** Chrome on Android has a bug in which scaled elements blur if their initial scale
         * value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
         * and ensure that its first value is always 1. **
         */
        var defaultVal = property.indexOf('scale') > -1 ? 1 : 0;
        if(!transformStr) return defaultVal;

        var values = transformStr.split(")");

        for (var key in values) {
            var val = values[key];
            var prop = val.split("(");
            if (prop[0].trim() == property) return prop[1];
        }
        return false;
    }

    // attribute: getAttribute(target, prop) {
    //     return target.getAttribute(prop);
    // }
}

export function getAnimationType(node, prop) {

    if(validTransforms.indexOf(prop) > -1) return 'transform';
    if(prop !== 'transform' && value.css(node, prop)) return 'css';
    if(node.getAttribute(prop)) return 'attribute';
    return 'object';
}

function getUnit(property) {
    if (/^(rotate|skew)/i.test(property)) {
        return "deg";
    } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
        /* The above properties are unitless. */
        return "";
    } else {
        /* Default to px for all other properties. */
        return "px";
    }
}

function splitUnit(prop, propType) {
    if(propType === 'transform') {
        return [`${prop}(`, `${getUnit(prop)})`]
    } else if(propType === 'css') {
        return ['', `${getUnit(prop)}`]
    }
}

// TO_DO: get the value by different style types
export const getOriginValue = (node, prop, propType) => {
    let originValue = value[propType](node, prop);
    return {
        number: parseInt(originValue),
        unit: splitUnit(prop, propType), // FIX_ME
    }
}

export const decomposeValue = prop => {
    let number = parseFloat(prop.value);
    return {
        number,
        unit: getUnit(prop.name),
    }
}