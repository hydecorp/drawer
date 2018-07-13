# Examples
When viewing this page on [webcomponents.org][wcorg], the example below will render as an interactive demo. Otherwise, find the standalone examples below.

[wcorg]: https://www.webcomponents.org/element/qwtel/hy-drawer

<!--
```
<custom-element-demo height="250">
  <template>
    <script src="https://unpkg.com/@webcomponents/webcomponentsjs@1.1.0"></script>
    <link rel="import" href="https://unpkg.com/hy-drawer/dist/webcomponent/hy-drawer.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<hy-drawer id="drawer" align="left" touch-events mouse-events>
  <p>Arbitrary content here.</p>
</hy-drawer>

<a onclick="window.drawer.toggle()">☰</a>
```

When viewing this document on GitHub, npm, or elsewhere, you can check out the standalone examples:

* [WebComponent Example](https://qwtel.com/hy-drawer/example/webcomponent/){:.external}
* [jQuery Example](https://qwtel.com/hy-drawer/example/jquery/){:.external}
* [Vanilla JS Example](https://qwtel.com/hy-drawer/example/vanilla/){:.external}
* [Mixin Example](https://qwtel.com/hy-drawer/example/mixin/){:.external}
