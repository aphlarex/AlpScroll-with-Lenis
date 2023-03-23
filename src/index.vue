<style scoped></style>

<template>
  <div class="mouse-1 mos-1"></div>
  <div class="Scroll-element">
    <div class="mouse-wrap">
      <div class="desc">mouse move limit in container</div>
      <div class="mouse-1 mos-2"></div>
    </div>
    <div class="mouse-wrap">
      <div class="desc">mouse move limit in '300px'</div>
      <div class="mouse-1 mos-3"></div>
    </div>
    <div>
      <div class="palallax-wrap">
        <div class="palallax-elm par-1">parallax limit:0</div>
      </div>
    </div>
    <div>
      <div class="palallax-wrap">
        <div class="palallax-elm par-2">parallax limit:1</div>
      </div>
    </div>
    <div>
      <div class="palallax-wrap">
        <div class="palallax-elm par-3">parallax limit:2</div>
      </div>
    </div>

    <div>
      <div class="sticky-elm-wrapper">
        <div class="sticky-elm sticky-1" css3-sticky>
          <div>
            sticky width position:sticky<br />
            Progress:<span data-raf></span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="sticky-elm-wrapper">
        <div class="sticky-wrap-parent" css3-sticky>
          <div class="sticky-wrap sticky-2">
            <div class="sticky-note">
              <div>
                sticky with position:sticky and horizonal scroll effect<br />
                Progress:<span data-raf></span>
              </div>
            </div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
            <div class="sticky-wrap-child">sticky child<span></span></div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="sticky-elm-wrapper overflow-hidden">
        <div class="sticky-wrap-parent-2">
          <div class="sticky-wrap2 sticky-3" fixed-sticky>
            <div class="sticky-fixed-wrapper" fixed-sticky-el>
              <div class="sticky-note">
                <div>
                  sticky with position:Fixed and horizonal scroll effect<br />
                  Progress:<span data-raf></span>
                </div>
              </div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
              <div class="sticky-wrap-child">sticky child<span></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script setup>
import $ from "jquery";
import { Alpscroll } from "/src/index.js";
alp = new Alpscroll();
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
// log

alp.lenis.on("scroll", (e) => {});

// pre set fixed style for sticky elm
function PreSet() {}

let updataRafAnim = "";
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
  updataRafAnim = requestAnimationFrame(rafAnimation);
}

window.addEventListener("load", () => {
  PreSet();
  updataRafAnim = requestAnimationFrame(rafAnimation);
  console.log(alp);
});
</script>
