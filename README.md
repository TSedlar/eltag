# ElTag

[![](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![](https://img.shields.io/badge/donate-patreon-orange.svg)](https://www.patreon.com/bePatron?c=954360)
[![](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/TSedlar)

[![](https://data.jsdelivr.com/v1/package/gh/TSedlar/eltag/badge)](https://www.jsdelivr.com/package/gh/TSedlar/eltag)

An HTML Tag Component Micro-framework

### Retrieving

JSDelivr kindly hosts this script [here](https://www.jsdelivr.com/package/gh/TSedlar/eltag)

```html
<script type='text/javascript' src='https://cdn.jsdelivr.net/gh/TSedlar/eltag@1.0.0/eltag.js'>
```

### Example usage:

[codepen](https://codepen.io/tsedlar/pen/https://codepen.io/tsedlar/pen/MLzyPE?editors=1000)

```html
<script>
  const { renderElement, app, range, p, span, button } = ElTag;

  const main = app({
    state: { ctr: 1 }
  }, [
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