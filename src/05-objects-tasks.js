/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => width * height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function MySelector() {
  this.el = '';
  this.idValue = '';
  this.cls = [];
  this.attrValue = [];
  this.psdCls = [];
  this.psdEl = '';
  this.order = 0;
}

function MyCombinedSelector(s1, c, s2) {
  this.s1 = s1;
  this.c = c;
  this.s2 = s2;
}

MySelector.prototype = {
  element(value) {
    this.check('el', 1);
    this.el = value;
    return this;
  },

  id(value) {
    this.check('idValue', 2);
    this.idValue = value;
    return this;
  },

  class(value) {
    this.check('cls', 3);
    this.cls.push(value);
    return this;
  },

  attr(value) {
    this.check('attrValue', 4);
    this.attrValue.push(value);
    return this;
  },

  pseudoClass(value) {
    this.check('psdCls', 5);
    this.psdCls.push(value);
    return this;
  },

  pseudoElement(value) {
    this.check('psdEl', 6);
    this.psdEl = value;
    return this;
  },

  check(val, ord) {
    if (typeof this[val] === 'string' && this[val].length > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (ord < this.order) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.order = ord;
  },

  transform(value, start, end) {
    const copy = (!value) ? [] : value;
    if (Array.isArray(copy)) {
      return copy.map((item) => start + item + end).join('');
    }
    return start + copy + end;
  },

  stringify() {
    const strEl = `${this.el}`;
    const res = `${strEl}${this.transform(this.idValue, '#', '')}${this.transform(this.cls, '.', '')}${this.transform(this.attrValue, '[', ']')}${this.transform(this.psdCls, ':', '')}${this.transform(this.psdEl, '::', '')}`;
    return res;
  },
};

MyCombinedSelector.prototype = {
  stringify() {
    return `${this.s1.stringify()} ${this.c} ${this.s2.stringify()}`;
  },
};

const cssSelectorBuilder = {
  element(value) {
    return new MySelector().element(value);
  },

  id(value) {
    return new MySelector().id(value);
  },

  class(value) {
    return new MySelector().class(value);
  },

  attr(value) {
    return new MySelector().attr(value);
  },

  pseudoClass(value) {
    return new MySelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MySelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MyCombinedSelector(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
