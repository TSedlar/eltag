/* retrieved from https://www.w3schools.com/tags/ */
const ELTAG_ELEMENT_TAGS = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont',
  'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code',
  'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1',
  'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
  'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noframes', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp',
  'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong',
  'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
];

/* retrieved from https://www.w3schools.com/jsref/dom_obj_event.asp */
const ELTAG_ELEMENT_TRIGGERS = [
  'onabort', 'onafterprint', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onbeforeprint',
  'onbeforeunload', 'onblur', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'oncontextmenu', 'oncopy',
  'oncut', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart',
  'ondrop', 'ondurationchange', 'onended', 'onerror', 'onfocus', 'onfocusin', 'onfocusout', 'onfullscreenchange',
  'onfullscreenerror', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload',
  'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave',
  'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onopen',
  'onpagehide', 'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying', 'onpopstate', 'onprogress',
  'onratechange', 'onresize', 'onreset', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onshow',
  'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontouchcancel', 'ontouchend',
  'ontouchmove', 'ontouchstart', 'ontransitionend', 'onunload', 'onvolumechange', 'onwaiting', 'onwheel'
];

/* retrieved from https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements */
const INLINE_ELEMENTS = [
  'a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button', 'canvas', 'cite', 'code', 'data',
  'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map', 'mark',
  'meter', 'noscript', 'object', 'output', 'picture', 'progress', 'q', 'ruby', 's', 'samp', 'script', 'select',
  'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'tt', 'var',
  'video', 'wbr'
]

const PROPERTY_MAP = new Map();
const STATE_MAP = new Map();
const INIT_LIST = [];

const _visitTree = (element, fn) => {
  if (fn(element)) {
    for (let child of element.children) {
      _visitTree(child, fn);
    }
  }
};

const _updateVisibility = (e) => {
  const props = PROPERTY_MAP.get(e);
  let state = null;
  if (props) {
    state = STATE_MAP.get(props.ctx);
    if (state) {
      if (props.condition) {
        e.style.display = _runInContext(props.condition, state) ? _disp(e.tagName) : 'none';
      }
    }
  }
  let visible = e.style.display !== 'none' && e.style.display !== 'hidden';
  if (props && state && visible && !props.initialized) {
    if (props.oninit) {
      props.initialized = true;
      _runInContext(props.oninit, state);
    }
  }
  return visible;
}

const _renderTree = (element) => _visitTree(element, (e) => {
  if (e.style.display === 'none' || e.style.display === 'hidden') {
    if (!_updateVisibility(e)) {
      return false;
    }
  }
  _rerender(e);
  return true;
});

const _createContextProxy = (element, ctx, owner = null) => {
  const proxy = new Proxy(ctx, {
    get: (target, property) => {
      if (property == 'parent') {
        const parent = _findParentContext(element);
        if (parent) {
          return STATE_MAP.get(parent);
        }
      }
      return owner ? (owner[property] ? owner[property] : target[property]) : target[property];
    },

    set: (target, property, value) => {
      if (owner) {
        owner[property] = value;
      } else {
        target[property] = value;
      }
      return value;
    }
  });

  proxy.setState = (updated) => {
    if (proxy.state) {
      for (let key in proxy.state) {
        if (!(key in updated)) {
          updated[key] = proxy.state[key];
        }
      }
    }
    proxy.state = updated;
    const props = PROPERTY_MAP.get(element);
    if (props && props.ctx) {
      _renderTree(props.ctx);
    }
  };

  return proxy;
};

const _rerender = (element) => {
  if (element.style.display === 'none' || element.style.display === 'hidden') {
    return;
  }
  const props = PROPERTY_MAP.get(element);
  if (props && props.ctx) {
    const state = STATE_MAP.get(props.ctx);
    if (state) {
      if (props.condition) {
        if (!_runInContext(props.condition, state)) {
          element.style.display = 'none';
          return;
        } else {
          element.style.display = _disp(element.tagName);
        }
      }
      if (props.render) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        element.style.display = _disp(element.tagName);
        const render = _runInContext(props.render, state);
        element.appendChild(document.createTextNode(render));
        if (props.onrender) {
          _runInContext(props.onrender, state);
        }
      }
    }
  }
};

const _findParentContext = (element) => {
  let current = element;
  while (current.parentElement) {
    current = current.parentElement;
    const parent = PROPERTY_MAP.get(current);
    if (parent && parent.ctx) {
      return parent.ctx;
      break;
    }
  }
  return null;
}

const _initProps = () => {
  for (let element of INIT_LIST) {
    const props = PROPERTY_MAP.get(element);
    if (props && !props.ctx) {
      const ctx = _findParentContext(element);
      if (ctx) {
        props.ctx = ctx;
      }
    }
  }
  for (let element of INIT_LIST) {
    _updateVisibility(element);
  }
  INIT_LIST.length = 0;
};

const _disp = (tag) => INLINE_ELEMENTS.includes(tag.toLowerCase()) ? 'inline' : 'block';

const _runInContext = (fn, context, ...args) => {
  let fx = fn.hasOwnProperty('prototype') ? fn : function () { return eval('(' + fn + ')').apply(context, args); }
  return fx.apply(context, args);
};

const ElTag = {

  renderElement: (target, element, initFn) => {
    _initProps();
    _renderTree(element);

    target.appendChild(element);

    const props = PROPERTY_MAP.get(element);
    if (props) {
      const state = STATE_MAP.get(props.ctx);
      if (state) {
        _runInContext(initFn, state);
      }
    }
  },

  el: (tag, properties = {}, children = []) => {

    const realProperties = Array.isArray(properties) ? {} : properties;
    let realChildren = Array.isArray(properties) ? properties : (children || []);

    const element = document.createElement(tag);
    INIT_LIST.push(element);

    if (typeof properties === 'string') {
      realChildren = properties;
    }

    let props = {
      condition: realProperties.condition,
      initialized: false,
      render: realProperties.render,
      oninit: realProperties.oninit,
      onrender: realProperties.onrender,
      displayType: realProperties.style ? (realProperties.style.display || _disp(tag)) : _disp(tag)
    };

    if (realProperties.state) {
      PROPERTY_MAP.set(element, { ctx: element, ...props });

      for (let actionKey in realProperties.actions) {
        const action = realProperties.actions[actionKey];
        realProperties.actions[actionKey] = (...args) => {
          const context = STATE_MAP.get(PROPERTY_MAP.get(element).ctx);
          _runInContext(action, context, args);
        };
      }

      STATE_MAP.set(element, _createContextProxy(element, { state: realProperties.state, actions: realProperties.actions }));
    } else {
      PROPERTY_MAP.set(element, props);
    }

    if (realProperties.every) {
      for (let delay in realProperties.every) {
        setInterval(() => {
          let delayActions = realProperties.every[delay];
          if (!Array.isArray(delayActions)) {
            delayActions = [delayActions];
          }
          const context = STATE_MAP.get(PROPERTY_MAP.get(element).ctx);
          for (let action of delayActions) {
            _runInContext(action, _createContextProxy(element, { ref: element }, context));
          }
        }, delay);
      }
    }

    if (!realProperties.style) {
      realProperties.style = {};
    }

    for (let trigger of ELTAG_ELEMENT_TRIGGERS) {
      if (realProperties[trigger]) {
        const fn = realProperties[trigger];
        realProperties[trigger] = (...args) => {
          const context = STATE_MAP.get(PROPERTY_MAP.get(element).ctx);
          _runInContext(fn, _createContextProxy(element, { ref: element }, context), args);
        };
      }
    }

    for (let property in realProperties) {
      if (property === 'style' && Object.keys(realProperties.style).length == 0) {
        continue;
      }
      element[property] = realProperties[property];
    }

    if (realProperties.class) {
      element.className = realProperties.class;
    }

    for (let styleAttr in realProperties.style) {
      element.style[styleAttr] = realProperties.style[styleAttr];
    }

    if (Array.isArray(realChildren)) {
      for (let child of realChildren) {
        if (child) {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else {
            element.appendChild(child);
          }
        }
      }
    } else if (realChildren) {
      element.appendChild(document.createTextNode(realChildren));
    }

    return element
  },

  app: (properties = {}, children = []) => ElTag.el('div', properties, children),

  range: (startInclusive, endExclusive, resolver) => {
    let elements = [];
    for (let i = startInclusive; i < endExclusive; i++) {
      elements.push(resolver(i));
    }
    return elements;
  }
};

for (let tag of ELTAG_ELEMENT_TAGS) {
  ElTag[tag] = (properties = {}, children = []) => ElTag.el(tag, properties, children);
}
