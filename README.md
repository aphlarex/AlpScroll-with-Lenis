## Introduction

This is smooth scroll with [Lenis](https://github.com/studio-freight/lenis)

## Installing

```js
import { Alpscroll } from "/dist/Alpscroll.js";
```

## Setup

Example Setup:

```js
let alp = new Alpscroll();
// init(lerp, duration, infinite, smoothTouch, wrapper)
alp.init(0.1, 1, false, false, "body");
// parallax(elm, limit, friction_y, friction_x)
alp.parallax(".par-1", 0, 0.1, 0.1);
alp.parallax(".par-2", 1, 0.1, 0.1);
alp.parallax(".par-3", 2, 0.1, 0.1);
// sticky(elm, limit, friction_y, friction_x, parent_elm)
alp.sticky(".sticky-1", 1, 0.1, 0.1);
alp.sticky(".sticky-2", 1, 0.1, 0.1, ".sticky-elm-wrapper");
alp.sticky(".sticky-3", 1, 0.1, 0.1, ".sticky-elm-wrapper");
// sticky_child(elm, limit)
alp.sticky_child(".sticky-wrap-child", 0);
// reach(elm, offset_y, offset_x)
alp.reach(".Scroll-element > div", 0, 0);
// mouse(elm, limit, friction_y, friction_x, outside)
alp.mouse(".mos-1", 0, 0.1, 0.1, 1);
alp.mouse(".mos-2", 1, 0.1, 0.1, 0);
alp.mouse(".mos-3", "300", 0.1, 0.1, 0);
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
  $(".par-1").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(0px, ${$this.attr("data-pl_y") * -0.5}px, 0px)`);
  });
  $(".par-2").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(0px, ${$this.attr("data-pl_y") * 0.3}px, 0px)`);
  });
  $(".par-3").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(0px, ${$this.attr("data-pl_y") * 0.3}px, 0px)`);
  });

  // Sticky effect
  $(".sticky-1").each(function () {
    let $this = $(this);
    // Sticky note
    $this.find("[data-raf]").text($this.attr("data-st_pg"));
  });
  $(".sticky-2").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(${$this.attr("data-st_xm") * 1}px, 0px, 0px)`);
    // Sticky note
    $this.find("[data-raf]").text($this.attr("data-st_pg"));
    $this.find(".sticky-note").css("transform", `translate3d(${$this.attr("data-st_xm") * -0.96}px, 0px, 0px)`);
  });
  // Sticky elm's Children Parallax effect
  $(".sticky-2 .sticky-wrap-child").each(function () {
    let $this = $(this);
    let $parent = $this.parent();
    $this.find("span").css("transform", `translate3d(${(parseFloat($this.attr("data-stc_x")) + parseFloat($parent.attr("data-st_xm"))) * 0.1}px, 0px, 0px)`);
  });

  // Sticky with Fixed style
  $(".sticky-3").each(function () {
    let $this = $(this);
    let $child = $this.children();
    $child.css("transform", `translate3d(${$this.attr("data-st_xm") * 1}px, 0px, 0px)`);
    // Sticky note
    $this.find("[data-raf]").text($this.attr("data-st_pg"));
    $this.find(".sticky-note").css("transform", `translate3d(${$this.attr("data-st_xm") * -0.96}px, 0px, 0px)`);
  });
  // Sticky elm's Children Parallax effect
  $(".sticky-3 .sticky-wrap-child").each(function () {
    let $this = $(this);
    let $parent = $this.parents(".sticky-element");
    $this.find("span").css("transform", `translate3d(${(parseFloat($this.attr("data-stc_x")) + parseFloat($parent.attr("data-st_xm"))) * 0.1}px, 0px, 0px)`);
  });

  // Mouse effect
  $(".mos-1").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(${$this.attr("data-mxx") * 1}px, ${$this.attr("data-myy") * 1}px, 0px)`);
  });
  $(".mos-2").each(function () {
    let $this = $(this);
    $this.css("transform", `translate3d(${$this.attr("data-mxx") * 1}px, ${$this.attr("data-myy") * 1}px, 0px)`);
  });
  $(".mos-3").each(function () {
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
