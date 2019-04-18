# ElTag

[![](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![](https://img.shields.io/badge/donate-patreon-orange.svg)](https://www.patreon.com/bePatron?c=954360)
[![](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/TSedlar)

[![](https://data.jsdelivr.com/v1/package/gh/TSedlar/eltag/badge)](https://www.jsdelivr.com/package/gh/TSedlar/eltag)

A blazing fast HTML Tag Component Micro-framework

Supports all of the below in ~6kb!:
- Component states
- Parent component states
- All style variables
- All event listeners

### Retrieving:

JSDelivr kindly hosts this script [here](https://www.jsdelivr.com/package/gh/TSedlar/eltag)

```html
<script type='text/javascript' src='https://cdn.jsdelivr.net/gh/TSedlar/eltag@1.1.5/eltag.min.js'>
```

### Example usage:

[codepen](https://codepen.io/tsedlar/pen/MLzyPE?editors=1000)

```html
<script>
  const { renderElement, app, range, p, span, button } = ElTag;

  const main = app({
    state: { ctr: 1 }
  }, [
    p({
      class: 'message',
      condition: () => new Date().getDay() == 5
    }, 'TGIF!'),
    p(range(0, 5, (idx, ctx) => span({ 
      class: 'counter',
      state: { offset: idx },
      render: () => this.parent.state.ctr + this.state.offset
    }))),
    button({
      onclick: () => this.setState({ ctr: Math.max(0, this.state.ctr - 1) })
    }, '-'),
    button({
      onclick: () => this.setState({ ctr: this.state.ctr + 1})
    }, '+')
  ]);

  renderElement(document.body, main);
</script>
```

### Example usage 2:

[codepen](https://codepen.io/tsedlar/pen/GzzWLy?editors=1000)

```html
<script>
  const { renderElement, app, p } = ElTag;

  const main = app([
    p({
      class: 'message',
      state: { ctr: 0 },
      every: {
        1000: () => this.setState({ ctr: this.state.ctr + 1 })
      },
      render: () => this.state.ctr,
      actions: {
        showCtr: () => alert(this.state.ctr)
      },
      onclick: () => this.actions.showCtr()
    })
  ]);

  renderElement(document.body, main);
</script>
```

Note: every can be an array! multiple separate functions can be executed from it.

```js
every: {
  1000: [fn1, fn2, () => { /* fn2 */ }]
}
```

### Other Methods:
- `oninit`
- `onrender`

### PageSpeed Results:

[Portfolio page source](https://github.com/TSedlar/tsedlar.github.io/blob/master/index.html)

![](test/pagespeed-sedlar.png)

[kr-hangul page source](https://github.com/TSedlar/tsedlar.github.io/blob/master/korean/hangul/index.html)

![](test/pagespeed-kr-hangul.png)

[IKJP page source](https://github.com/TSedlar/tsedlar.github.io/blob/master/ikjp/index.html)

![](test/pagespeed-ikjp.png)
