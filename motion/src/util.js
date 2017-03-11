// type checking
export const is = {
    string: s => typeof s === 'string',
    node: s => s.nodeType > 0, // eslint-disable-line
    array: s => Array.isArray(s),
}

// Array methods
export const flattenArray = arr =>
arr.reduce((a, b) => a.concat(is.array(b) ? flattenArray(b) : b), []);

export const toArray = arrayLike => [].slice.call(arrayLike);

// dom manipulate
export const select = str => document.querySelectorAll(str);


// prop and values
export const getCssValue = (node, propName) => {
    return window.getComputedStyle(node, null)[propName];
}

// TO_DO: get the value by different style types
export const getOriginValue = (node, propName) => {
    let originValue = getCssValue(node, propName);
    return {
        number: parseInt(originValue),
        string: 'px', // FIX_ME
    };
}

export const decomposeValue = value => {
    value = parseInt(value);
    return {
        number: number,
        string: 'px',
    }
}
