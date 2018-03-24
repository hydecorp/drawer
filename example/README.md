# Examples
The example below will render on [webcomponents.org](https://www.webcomponents.org/element/qwtel/hy-drawer):

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
<hy-drawer id="drawer" align="left" mouse-events>
 <aside>
   <p>Arbitrary content here.</p>
 </aside>
</hy-drawer>

<a onclick="window.drawer.toggle()">☰</a>
```

When viewing this document on GitHub, npm, or elsewhere, you can check out the standalone examples:

* [WebComponent Example](https://qwtel.com/hy-drawer/example/webcomponent/){:.external}
* [jQuery Example](https://qwtel.com/hy-drawer/example/jquery/){:.external}
* [Vanilla JS Example](https://qwtel.com/hy-drawer/example/vanilla/){:.external}
* [Mixin Example](https://qwtel.com/hy-drawer/example/mixin/){:.external}
