## Introduction

This is smooth scroll with [Lenis](https://github.com/studio-freight/lenis)

## Installing

```js
import { Alpscroll } from "/dist/Alpscroll.js";
```

## Setup

Example Setup:

Init

```js
let alp = new Alpscroll();
// init(lerp, duration, infinite, smoothTouch, wrapper)
alp.init(0.1, 1, false, false, "body");
```

Parallax

```js
// parallax(elm, limit, friction_y, friction_x)
// limit:0 | no limit scroll
// limit:1 | scroll bottom to center
// limit:2 | scroll center to top
alp.parallax(".parallax-el", 0, 0.1, 0.1);
```

Sticky

```js
// sticky(elm, limit, friction_y, friction_x, parent_elm)
// limit:0 | no limit scroll
// limit:1 | limited to parent container
// parent_elm | if null Default nearest parent element
alp.sticky(".sticky-el", 1, 0.1, 0.1, ".sticky-el-wrapper");
```

Sticky

```js
// sticky_child(elm)
// Allows child elements to parallax scroll within the parent Sticky element
alp.sticky_child(".sticky-el-children");
```

Reach

```js
// reach(elm, offset_y, offset_x)
// trigger element while it in the center viewport
// offset_y: num*window.innerHeight/2 | For example 0.5
// offset_x: num*window.innerWidth/2 | For example 0.5
alp.reach(".el", 0, 0);
```

Mouse

```js
// mouse(elm, limit, friction_y, friction_x, outside)
// limit:0 | no limit movement
// limit:1 | limited to parent container
// limit:'300' | limited to 300px range
// outside: 0 | outside the scroll container
// outside: 1 | inside the scroll container
alp.mouse(".mouse-point", 0, 0.1, 0.1, 0);
```

## Loop the Animation

Example:

```js
let updataRafAnim = "";
function updateAnim() {
  rafAnimation();
  updataRafAnim = requestAnimationFrame(updateAnim);
}

function rafAnimation() {
  // Parallax effect
  $(".parallax-el").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(0px, ${$this.attr("data-pl_y") * 0.3}px, 0px)`);
  });
  // Sticky effect
  $(".sticky-el").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(${$this.attr("data-st_xm") * 1}px, 0px, 0px)`);
  });
  // Sticky elm's Children Parallax effect
  $(".sticky-el .sticky-el-children").each(function () {
    let $this = $(this);
    let $parent = $this.parent();
    $this.find("span").css("transform", `translate3d(${(parseFloat($this.attr("data-stc_x")) + parseFloat($parent.attr("data-st_xm"))) * 0.1}px, 0px, 0px)`);
  });
  // Sticky with Fixed style
  $(".sticky-el").each(function () {
    let $this = $(this);
    let $child = $this.children();
    $child.css("transform", `translate3d(${$this.attr("data-st_xm") * 1}px, 0px, 0px)`);
  });
  // Mouse effect
  $(".mouse-point").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(${$this.attr("data-mxx") * 1}px, ${$this.attr("data-myy") * 1}px, 0px)`);
  });
}

window.addEventListener("load", () => {
  updataRafAnim = requestAnimationFrame(updateAnim);
});
```

## Some HTML Preset

```html
<!-- Example Sticky Wrapper -->
<div class="el-wrapper">
  <div fixed-sticky>
    <div fixed-sticky-el>
      <div>...</div>
    </div>
  </div>
</div>
```

## Some CSS Preset

```css
.lenis.lenis-smooth {
  scroll-behavior: auto;
}
html.lenis {
  height: auto;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.sticky-element[fixed-sticky][data-stickin="1"] > [fixed-sticky-el] {
  position: fixed !important;
  left: 0;
  top: 0;
  z-index: 10;
}
.sticky-element[fixed-sticky][data-stickout="1"] {
  transform: translate3d(0, calc((var(--st_parent_height) - var(--st_height) - var(--st_top)) * 1px), 0);
}
.Alpscroll [css3-sticky] {
  position: sticky;
  top: 0;
  z-index: 10;
}
```
