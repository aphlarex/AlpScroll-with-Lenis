function x(n, t, a) {
  return Math.max(n, Math.min(t, a));
}
class W {
  advance(t) {
    var a;
    if (!this.isRunning)
      return;
    let i = !1;
    if (this.lerp)
      this.value = (1 - (s = this.lerp)) * this.value + s * this.to, Math.round(this.value) === this.to && (this.value = this.to, i = !0);
    else {
      this.currentTime += t;
      const l = x(0, this.currentTime / this.duration, 1);
      i = l >= 1;
      const r = i ? 1 : this.easing(l);
      this.value = this.from + (this.to - this.from) * r;
    }
    var s;
    (a = this.onUpdate) == null || a.call(this, this.value, { completed: i }), i && this.stop();
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(t, a, { lerp: i = 0.1, duration: s = 1, easing: l = (o) => o, onUpdate: r }) {
    this.from = this.value = t, this.to = a, this.lerp = i, this.duration = s, this.easing = l, this.currentTime = 0, this.isRunning = !0, this.onUpdate = r;
  }
}
let M = () => ({ events: {}, emit(n, ...t) {
  let a = this.events[n] || [];
  for (let i = 0, s = a.length; i < s; i++)
    a[i](...t);
}, on(n, t) {
  var a;
  return (a = this.events[n]) != null && a.push(t) || (this.events[n] = [t]), () => {
    var i;
    this.events[n] = (i = this.events[n]) == null ? void 0 : i.filter((s) => t !== s);
  };
} });
class T {
  constructor(t) {
    this.onResize = ([a]) => {
      if (a) {
        const { width: i, height: s } = a.contentRect;
        this.width = i, this.height = s;
      }
    }, this.onWindowResize = () => {
      this.width = window.innerWidth, this.height = window.innerHeight;
    }, this.element = t, t === window ? (window.addEventListener("resize", this.onWindowResize), this.onWindowResize()) : (this.width = this.element.offsetWidth, this.height = this.element.offsetHeight, this.resizeObserver = new ResizeObserver(this.onResize), this.resizeObserver.observe(this.element));
  }
  destroy() {
    window.removeEventListener("resize", this.onWindowResize), this.resizeObserver.disconnect();
  }
}
class z {
  constructor(t, { wheelMultiplier: a = 1, touchMultiplier: i = 2, normalizeWheel: s = !1 }) {
    this.onTouchStart = (l) => {
      const { pageX: r, pageY: o } = l.targetTouches ? l.targetTouches[0] : l;
      this.touchStart.x = r, this.touchStart.y = o;
    }, this.onTouchMove = (l) => {
      const { pageX: r, pageY: o } = l.targetTouches ? l.targetTouches[0] : l, h = -(r - this.touchStart.x) * this.touchMultiplier, _ = -(o - this.touchStart.y) * this.touchMultiplier;
      this.touchStart.x = r, this.touchStart.y = o, this.emitter.emit("scroll", { type: "touch", deltaX: h, deltaY: _, event: l });
    }, this.onWheel = (l) => {
      let { deltaX: r, deltaY: o } = l;
      this.normalizeWheel && (r = x(-100, r, 100), o = x(-100, o, 100)), r *= this.wheelMultiplier, o *= this.wheelMultiplier, this.emitter.emit("scroll", { type: "wheel", deltaX: r, deltaY: o, event: l });
    }, this.element = t, this.wheelMultiplier = a, this.touchMultiplier = i, this.normalizeWheel = s, this.touchStart = { x: null, y: null }, this.emitter = M(), this.element.addEventListener("wheel", this.onWheel, { passive: !1 }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: !1 }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: !1 });
  }
  on(t, a) {
    return this.emitter.on(t, a);
  }
  destroy() {
    this.emitter.events = {}, this.element.removeEventListener("wheel", this.onWheel, { passive: !1 }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: !1 }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: !1 });
  }
}
class q {
  constructor({ direction: t, gestureDirection: a, mouseMultiplier: i, smooth: s, wrapper: l = window, content: r = document.documentElement, smoothWheel: o = s == null || s, smoothTouch: h = !1, duration: _, easing: d = (u) => Math.min(1, 1.001 - Math.pow(2, -10 * u)), lerp: p = _ ? null : 0.1, infinite: c = !1, orientation: m = t ?? "vertical", gestureOrientation: y = a ?? "vertical", touchMultiplier: v = 2, wheelMultiplier: E = i ?? 1, normalizeWheel: L = !0 } = {}) {
    this.onVirtualScroll = ({ type: u, deltaX: f, deltaY: g, event: k }) => {
      if (k.ctrlKey || this.options.gestureOrientation === "vertical" && g === 0 || this.options.gestureOrientation === "horizontal" && f === 0 || k.composedPath().find((S) => S == null || S.hasAttribute == null ? void 0 : S.hasAttribute("data-lenis-prevent")))
        return;
      if (this.isStopped || this.isLocked)
        return void k.preventDefault();
      if (this.isSmooth = this.options.smoothTouch && u === "touch" || this.options.smoothWheel && u === "wheel", !this.isSmooth)
        return this.isScrolling = !1, void this.animate.stop();
      k.preventDefault();
      let w = g;
      this.options.gestureOrientation === "both" ? w = Math.abs(g) > Math.abs(f) ? g : f : this.options.gestureOrientation === "horizontal" && (w = f), this.scrollTo(this.targetScroll + w, { programmatic: !1 });
    }, this.onScroll = () => {
      if (!this.isScrolling) {
        const u = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - u), this.emit();
      }
    }, t && console.warn("Lenis: `direction` option is deprecated, use `orientation` instead"), a && console.warn("Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead"), i && console.warn("Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead"), s && console.warn("Lenis: `smooth` option is deprecated, use `smoothWheel` instead"), window.lenisVersion = "1.0.3", l !== document.documentElement && l !== document.body || (l = window), this.options = { wrapper: l, content: r, smoothWheel: o, smoothTouch: h, duration: _, easing: d, lerp: p, infinite: c, gestureOrientation: y, orientation: m, touchMultiplier: v, wheelMultiplier: E, normalizeWheel: L }, this.wrapper = new T(l), this.content = new T(r), this.rootElement.classList.add("lenis"), this.velocity = 0, this.isStopped = !1, this.isSmooth = o || h, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, this.animate = new W(), this.emitter = M(), this.wrapper.element.addEventListener("scroll", this.onScroll, { passive: !1 }), this.virtualScroll = new z(l, { touchMultiplier: v, wheelMultiplier: E, normalizeWheel: L }), this.virtualScroll.on("scroll", this.onVirtualScroll);
  }
  destroy() {
    this.emitter.events = {}, this.wrapper.element.removeEventListener("scroll", this.onScroll, { passive: !1 }), this.virtualScroll.destroy();
  }
  on(t, a) {
    return this.emitter.on(t, a);
  }
  off(t, a) {
    var i;
    this.emitter.events[t] = (i = this.emitter.events[t]) == null ? void 0 : i.filter((s) => a !== s);
  }
  setScroll(t) {
    this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t;
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    this.isLocked = !1, this.isScrolling = !1, this.velocity = 0;
  }
  start() {
    this.isStopped = !1, this.reset();
  }
  stop() {
    this.isStopped = !0, this.animate.stop(), this.reset();
  }
  raf(t) {
    const a = t - (this.time || t);
    this.time = t, this.animate.advance(1e-3 * a);
  }
  scrollTo(t, { offset: a = 0, immediate: i = !1, lock: s = !1, duration: l = this.options.duration, easing: r = this.options.easing, lerp: o = !l && this.options.lerp, onComplete: h = null, force: _ = !1, programmatic: d = !0 } = {}) {
    if (!this.isStopped || _) {
      if (["top", "left", "start"].includes(t))
        t = 0;
      else if (["bottom", "right", "end"].includes(t))
        t = this.limit;
      else {
        var p;
        let c;
        if (typeof t == "string" ? c = document.querySelector(t) : (p = t) != null && p.nodeType && (c = t), c) {
          if (this.wrapper.element !== window) {
            const y = this.wrapper.element.getBoundingClientRect();
            a -= this.isHorizontal ? y.left : y.top;
          }
          const m = c.getBoundingClientRect();
          t = (this.isHorizontal ? m.left : m.top) + this.animatedScroll;
        }
      }
      if (typeof t == "number") {
        if (t += a, t = Math.round(t), this.options.infinite ? d && (this.targetScroll = this.animatedScroll = this.scroll) : t = x(0, t, this.limit), i)
          return this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.animate.stop(), this.reset(), this.emit(), void (h == null || h());
        d || (this.targetScroll = t), this.animate.fromTo(this.animatedScroll, t, { duration: l, easing: r, lerp: o, onUpdate: (c, { completed: m }) => {
          s && (this.isLocked = !0), this.isScrolling = !0, this.velocity = c - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = c, this.setScroll(this.scroll), d && (this.targetScroll = c), m && (s && (this.isLocked = !1), requestAnimationFrame(() => {
            this.isScrolling = !1;
          }), this.velocity = 0, h == null || h()), this.emit();
        } });
      }
    }
  }
  get rootElement() {
    return this.wrapper.element === window ? this.content.element : this.wrapper.element;
  }
  get limit() {
    return Math.round(this.isHorizontal ? this.content.width - this.wrapper.width : this.content.height - this.wrapper.height);
  }
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  get actualScroll() {
    return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite ? function(t, a) {
      let i = t % a;
      return (a > 0 && i < 0 || a < 0 && i > 0) && (i += a), i;
    }(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  get progress() {
    return this.scroll / this.limit;
  }
  get isSmooth() {
    return this.__isSmooth;
  }
  set isSmooth(t) {
    this.__isSmooth !== t && (this.rootElement.classList.toggle("lenis-smooth", t), this.__isSmooth = t);
  }
  get isScrolling() {
    return this.__isScrolling;
  }
  set isScrolling(t) {
    this.__isScrolling !== t && (this.rootElement.classList.toggle("lenis-scrolling", t), this.__isScrolling = t);
  }
  get isStopped() {
    return this.__isStopped;
  }
  set isStopped(t) {
    this.__isStopped !== t && (this.rootElement.classList.toggle("lenis-stopped", t), this.__isStopped = t);
  }
}
const e = {
  parallax: [],
  parallax_data: [],
  sticky: [],
  sticky_data: [],
  sticky_child: [],
  sticky_child_data: [],
  reach: [],
  reach_data: [],
  mouse: [],
  mouse_data: []
}, H = class {
  constructor() {
    this.data = {
      wrapper: "body",
      scroll_y: 0,
      scroll_x: 0,
      wrapper_height: 0,
      wrapper_width: 0,
      scroll_height: 0,
      scroll_width: 0,
      page_x: 0,
      page_y: 0,
      // parallax: [],
      // parallax_data: [],
      // sticky: [],
      // sticky_data: [],
      // sticky_child: [],
      // sticky_child_data: [],
      // reach: [],
      // reach_data: [],
      // mouse: [],
      // mouse_data: [],
      size_h: 0,
      size_w: 0,
      init: !1
    }, this.lenis = "", this.raf = this.raf.bind(this), this.animationUpdate = this.animationUpdate.bind(this), this.updateAnim = "";
  }
  init(t, a, i, s, l) {
    let r = {
      lerp: t || 0.1,
      duration: a || 1.2,
      infinite: i || !1,
      smoothTouch: s || !1,
      wrapper: l || "body"
    };
    this.data.wrapper = r.wrapper, this.lenis = new q({
      smoothWheel: !0,
      smoothTouch: r.smoothTouch,
      touchMultiplier: 3,
      lerp: r.lerp,
      duration: r.duration,
      infinite: r.infinite
    }), this.GoInit(), this.data.init = !0, console.log("AlpScroll Inited With Lenis");
  }
  // Get Size
  getSize() {
    (this.data.size_h != document.querySelector(this.data.wrapper).clientHeight || this.data.size_w != document.querySelector(this.data.wrapper).clientWidth) && (this.data.wrapper_height = document.querySelector(this.data.wrapper).parentElement.clientHeight, this.data.wrapper_width = document.querySelector(this.data.wrapper).parentElement.clientWidth, this.data.scroll_height = document.querySelector(this.data.wrapper).clientHeight, this.data.scroll_width = document.querySelector(this.data.wrapper).clientWidth, this.data.size_h = this.data.scroll_height, this.data.size_w = this.data.scroll_width, this.ResetData());
  }
  RePushData() {
    this.parallax_push(), this.sticky_push(), this.sticky_child_push(), this.reach_push(), this.mouse_push();
  }
  ResetData() {
    this.parallax_data_update(), this.sticky_data_update(), this.sticky_child_data_update(), this.reach_data_update(), this.mouse_data_update();
  }
  ClearData() {
    e.parallax_data.length = 0, e.sticky_data.length = 0, e.sticky_child_data.length = 0, e.reach_data.length = 0, e.mouse_data.length = 0;
  }
  // Update animation
  animationUpdate() {
    this.parallax_run(), this.sticky_run(), this.sticky_child_run(), this.reach_run(), this.mouse_run(), this.updateAnim = requestAnimationFrame(this.animationUpdate);
  }
  GoInit() {
    cancelAnimationFrame(this.updateAnim), this.RePushData(), this.getMousePosition(), requestAnimationFrame(this.raf), this.updateAnim = requestAnimationFrame(this.animationUpdate), document.querySelector(this.data.wrapper).classList.add("Alpscroll");
  }
  // 循环循环循环
  raf(t) {
    this.lenis.raf(t), this.getSize(), this.data.scroll_y = document.querySelector(this.data.wrapper).parentElement.scrollTop, this.data.scroll_x = document.querySelector(this.data.wrapper).parentElement.scrollLeft, requestAnimationFrame(this.raf);
  }
  // 获取鼠标位置
  getMousePosition() {
    document.addEventListener("mousemove", (t) => {
      this.data.page_x = t.pageX - document.querySelector(this.data.wrapper).parentElement.scrollLeft, this.data.page_y = t.pageY - document.querySelector(this.data.wrapper).parentElement.scrollTop;
    });
  }
  // 获取元素到顶部的距离
  getElementTop(t) {
    if (t == null)
      return 0;
    for (var a = t.offsetTop, i = t.offsetParent; i !== null; )
      a += i.offsetTop, i = i.offsetParent;
    return a - document.querySelector(this.data.wrapper).parentElement.offsetTop;
  }
  // 获取元素到左边的距离
  getElementLeft(t) {
    if (t == null)
      return 0;
    for (var a = t.offsetLeft, i = t.offsetParent; i !== null; )
      a += i.offsetLeft, i = i.offsetParent;
    return a - document.querySelector(this.data.wrapper).parentElement.offsetLeft;
  }
  // 数组数据去重
  uniqueData(t) {
    return Array.from(new Set(t.map((a) => JSON.stringify(a)))).map((a) => JSON.parse(a));
  }
  // 视差
  // palallax
  parallax(t, a, i, s) {
    t && (e.parallax.push({
      elm: t,
      limit: a || 0,
      friction_y: i || 0.1,
      friction_x: s || 0.1
    }), e.parallax = this.uniqueData(e.parallax), this.parallax_push());
  }
  parallax_push() {
    e.parallax_data.length = 0;
    for (let t = 0; t < e.parallax.length; t++)
      this.parallax_data(e.parallax[t]);
  }
  parallax_data(t) {
    let a = document.querySelectorAll(t.elm);
    for (let i = 0; i < a.length; i++) {
      let s = this.getElementTop(a[i]), l = this.getElementLeft(a[i]);
      a[i].dataset.of_top = s, a[i].dataset.of_left = l;
      let r = a[i].clientHeight, o = a[i].clientWidth;
      e.parallax_data.push({
        elm: a[i],
        limit: t.limit,
        friction_y: t.friction_y,
        friction_x: t.friction_x,
        top: s,
        left: l,
        height: r,
        width: o,
        center_y: 0,
        center_y_friction: 0,
        center_x: 0,
        center_x_friction: 0
      });
    }
  }
  parallax_run() {
    for (let t = 0; t < e.parallax_data.length; t++) {
      let a = e.parallax_data[t].top - this.data.wrapper_height / 2 + e.parallax_data[t].height / 2 - this.data.scroll_y;
      e.parallax_data[t].center_y = a;
      let i = e.parallax_data[t].left - this.data.wrapper_width / 2 + e.parallax_data[t].width / 2 - this.data.scroll_x;
      e.parallax_data[t].center_x = i;
      let s = 0, l = 0, r = this.data.wrapper_height + e.parallax_data[t].height * 1, o = (this.data.wrapper_height + e.parallax_data[t].height * 1) * -1, h = this.data.wrapper_width + e.parallax_data[t].width, _ = (this.data.wrapper_width + e.parallax_data[t].width) * -1;
      e.parallax_data[t].limit == 0 ? (e.parallax_data[t].center_y < r && e.parallax_data[t].center_y > o ? s = e.parallax_data[t].center_y : e.parallax_data[t].center_y > r ? s = r : e.parallax_data[t].center_y < o && (s = o), e.parallax_data[t].center_x < h && e.parallax_data[t].center_x > _ ? l = e.parallax_data[t].center_x : e.parallax_data[t].center_x > h ? l = h : e.parallax_data[t].center_x < _ && (l = _)) : e.parallax_data[t].limit == 1 ? (e.parallax_data[t].center_y > 0 && e.parallax_data[t].center_y < r ? s = e.parallax_data[t].center_y : s = 0, e.parallax_data[t].center_x > 0 ? l = e.parallax_data[t].center_x : l = 0) : e.parallax_data[t].limit == 2 && (e.parallax_data[t].center_y < 0 && e.parallax_data[t].center_y > o ? s = e.parallax_data[t].center_y : s = 0, e.parallax_data[t].center_x < 0 ? l = e.parallax_data[t].center_x : l = 0), e.parallax_data[t].center_y_friction = Math.round((e.parallax_data[t].center_y_friction + (s - e.parallax_data[t].center_y_friction) * e.parallax_data[t].friction_y) * 100) / 100, e.parallax_data[t].center_x_friction = Math.round((e.parallax_data[t].center_x_friction + (l - e.parallax_data[t].center_x_friction) * e.parallax_data[t].friction_x) * 100) / 100;
      let d = 1 - s / (this.data.wrapper_height / 2), p = 1 - l / (this.data.wrapper_width / 2), c = 1 - e.parallax_data[t].center_y_friction / (this.data.wrapper_height / 2), m = 1 - e.parallax_data[t].center_x_friction / (this.data.wrapper_width / 2);
      e.parallax_data[t].elm.dataset.pl_y = s, e.parallax_data[t].elm.dataset.pl_ym = e.parallax_data[t].center_y_friction, e.parallax_data[t].elm.dataset.pl_x = l, e.parallax_data[t].elm.dataset.pl_xm = e.parallax_data[t].center_x_friction, e.parallax_data[t].elm.dataset.pl_pg_y = d, e.parallax_data[t].elm.dataset.pl_pg_ym = c, e.parallax_data[t].elm.dataset.pl_pg_x = p, e.parallax_data[t].elm.dataset.pl_pg_xm = m;
    }
  }
  parallax_data_update() {
    for (let t = 0; t < e.parallax_data.length; t++)
      e.parallax_data[t].top = this.getElementTop(e.parallax_data[t].elm), e.parallax_data[t].left = this.getElementLeft(e.parallax_data[t].elm), e.parallax_data[t].height = e.parallax_data[t].elm.clientHeight, e.parallax_data[t].width = e.parallax_data[t].elm.clientWidth, e.parallax_data[t].elm.dataset.of_top = e.parallax_data[t].top, e.parallax_data[t].elm.dataset.of_left = e.parallax_data[t].left;
  }
  // 固定
  // Sticky
  sticky(t, a, i, s, l) {
    t && (e.sticky.push({
      elm: t,
      limit: a || 0,
      friction_y: i || 1,
      friction_x: s || 1,
      parent_elm: l || null
    }), e.sticky = this.uniqueData(e.sticky), this.sticky_push());
  }
  sticky_push() {
    e.sticky_data.length = 0;
    for (let t = 0; t < e.sticky.length; t++)
      this.sticky_data(e.sticky[t]);
  }
  sticky_data(t) {
    let a = document.querySelectorAll(t.elm);
    for (let i = 0; i < a.length; i++) {
      a[i].classList.add("sticky-element");
      let s = a[i].clientHeight, l = a[i].clientWidth, r = 0, o = 0;
      t.parent_elm ? (r = a[i].closest(t.parent_elm).clientHeight, o = a[i].closest(t.parent_elm).clientWidth) : (r = a[i].parentElement.clientHeight, o = a[i].parentElement.clientWidth);
      let h = this.getElementTop(a[i]), _ = this.getElementLeft(a[i]), d = this.getElementTop(a[i].parentElement), p = this.getElementLeft(a[i].parentElement);
      t.parent_elm && (d = this.getElementTop(a[i].closest(t.parent_elm)), p = this.getElementLeft(a[i].closest(t.parent_elm))), a[i].dataset.of_top = h, a[i].dataset.of_left = _, a[i].style.setProperty("--st_top", h - d), a[i].style.setProperty("--st_left", _), a[i].style.setProperty("--st_parent_width", o), a[i].style.setProperty("--st_parent_height", r), a[i].style.setProperty("--st_width", l), a[i].style.setProperty("--st_height", s), e.sticky_data.push({
        elm: a[i],
        limit: t.limit,
        friction_y: t.friction_y,
        friction_x: t.friction_x,
        top: h,
        left: _,
        height: s,
        width: l,
        parent_height: r,
        parent_width: o,
        parent_top: d,
        parent_left: p,
        progress: 0,
        progress_friction: 0,
        stick_y: 0,
        stick_y_friction: 0,
        stick_x: 0,
        stick_x_friction: 0,
        parent_elm: t.parent_elm ? t.parent_elm : null
      });
    }
  }
  sticky_run() {
    for (let t = 0; t < e.sticky_data.length; t++) {
      if (e.sticky_data[t].limit == 0)
        e.sticky_data[t].progress = this.data.scroll_y / (this.data.scroll_height - this.data.wrapper_height), e.sticky_data[t].stick_y = this.data.scroll_y;
      else if (e.sticky_data[t].limit == 1) {
        let a = e.sticky_data[t].top - this.data.scroll_y, i = e.sticky_data[t].parent_top + e.sticky_data[t].parent_height - this.data.scroll_y, s = a / (e.sticky_data[t].parent_height - e.sticky_data[t].height - (e.sticky_data[t].top - e.sticky_data[t].parent_top)) * (e.sticky_data[t].width - e.sticky_data[t].parent_width);
        a <= 0 && i >= e.sticky_data[t].height ? (e.sticky_data[t].stick_y = a, e.sticky_data[t].stick_x = s, e.sticky_data[t].progress = a / (e.sticky_data[t].height - e.sticky_data[t].parent_height + (e.sticky_data[t].top - e.sticky_data[t].parent_top)), e.sticky_data[t].elm.dataset.stickin = "1", e.sticky_data[t].elm.dataset.stickout = "0", e.sticky_data[t].elm.dataset.fixedlength = "0", e.sticky_data[t].elm.dataset.pre_progress = 1, e.sticky_data[t].elm.dataset.after_progress = 0) : a > 0 ? (e.sticky_data[t].stick_y = 0, e.sticky_data[t].stick_x = 0, e.sticky_data[t].progress = 0, e.sticky_data[t].elm.dataset.stickin = "0", e.sticky_data[t].elm.dataset.stickout = "0", e.sticky_data[t].elm.dataset.fixedlength = "0", e.sticky_data[t].elm.dataset.pre_progress = (this.data.scroll_y + this.data.wrapper_height - e.sticky_data[t].top) / this.data.wrapper_height) : (e.sticky_data[t].stick_y = e.sticky_data[t].height - e.sticky_data[t].parent_height + (e.sticky_data[t].top - e.sticky_data[t].parent_top), e.sticky_data[t].stick_x = e.sticky_data[t].parent_width - e.sticky_data[t].width, e.sticky_data[t].progress = 1, e.sticky_data[t].elm.dataset.stickout = "1", e.sticky_data[t].elm.dataset.stickin = "0", e.sticky_data[t].elm.dataset.fixedlength = e.sticky_data[t].stick_y, e.sticky_data[t].elm.dataset.after_progress = (this.data.scroll_y - e.sticky_data[t].top - e.sticky_data[t].parent_height + e.sticky_data[t].height) / this.data.wrapper_height);
      }
      e.sticky_data[t].stick_y_friction = Math.round((e.sticky_data[t].stick_y_friction + (e.sticky_data[t].stick_y - e.sticky_data[t].stick_y_friction) * e.sticky_data[t].friction_y) * 100) / 100, e.sticky_data[t].stick_x_friction = Math.round((e.sticky_data[t].stick_x_friction + (e.sticky_data[t].stick_x - e.sticky_data[t].stick_x_friction) * e.sticky_data[t].friction_x) * 100) / 100, e.sticky_data[t].progress_friction = Math.round((e.sticky_data[t].progress_friction + (e.sticky_data[t].progress - e.sticky_data[t].progress_friction) * e.sticky_data[t].friction_x) * 1e6) / 1e6, e.sticky_data[t].elm.dataset.st_y = e.sticky_data[t].stick_y, e.sticky_data[t].elm.dataset.st_ym = e.sticky_data[t].stick_y_friction, e.sticky_data[t].elm.dataset.st_x = e.sticky_data[t].stick_x, e.sticky_data[t].elm.dataset.st_xm = e.sticky_data[t].stick_x_friction, e.sticky_data[t].elm.dataset.st_pg = e.sticky_data[t].progress, e.sticky_data[t].elm.dataset.st_pgm = e.sticky_data[t].progress_friction;
    }
  }
  sticky_data_update() {
    for (let t = 0; t < e.sticky_data.length; t++)
      e.sticky_data[t].elm.classList.contains("sticky") ? (e.sticky_data[t].top = this.getElementTop(e.sticky_data[t].elm.parentElement), e.sticky_data[t].left = this.getElementLeft(e.sticky_data[t].elm.parentElement)) : (e.sticky_data[t].top = this.getElementTop(e.sticky_data[t].elm), e.sticky_data[t].left = this.getElementLeft(e.sticky_data[t].elm)), e.sticky_data[t].parent_top = this.getElementTop(e.sticky_data[t].elm.parentElement), e.sticky_data[t].parent_left = this.getElementLeft(e.sticky_data[t].elm.parentElement), e.sticky_data[t].width = e.sticky_data[t].elm.clientWidth, e.sticky_data[t].parent_width = e.sticky_data[t].elm.parentElement.clientWidth, e.sticky_data[t].height = e.sticky_data[t].elm.clientHeight, e.sticky_data[t].parent_height = e.sticky_data[t].elm.parentElement.clientHeight, e.sticky_data[t].elm.dataset.of_top = e.sticky_data[t].top, e.sticky_data[t].elm.dataset.of_left = e.sticky_data[t].left, e.sticky_data[t].parent_elm && (e.sticky_data[t].parent_top = this.getElementTop(e.sticky_data[t].elm.closest(e.sticky_data[t].parent_elm)), e.sticky_data[t].parent_left = this.getElementLeft(e.sticky_data[t].elm.closest(e.sticky_data[t].parent_elm)), e.sticky_data[t].parent_width = e.sticky_data[t].elm.closest(e.sticky_data[t].parent_elm).clientWidth, e.sticky_data[t].parent_height = e.sticky_data[t].elm.closest(e.sticky_data[t].parent_elm).clientHeight);
  }
  // Sticky Child
  sticky_child(t, a) {
    t && (e.sticky_child.push({
      elm: t,
      limit: a || 0
    }), e.sticky_child = this.uniqueData(e.sticky_child), this.sticky_child_push());
  }
  sticky_child_push() {
    e.sticky_child_data.length = 0;
    for (let t = 0; t < e.sticky_child.length; t++)
      this.sticky_child_data(e.sticky_child[t]);
  }
  sticky_child_data(t) {
    let a = document.querySelectorAll(t.elm);
    for (let i = 0; i < a.length; i++) {
      let s = a[i].clientHeight, l = a[i].clientWidth, r = this.getElementTop(a[i]), o = this.getElementLeft(a[i]), h = this.getElementTop(a[i].parentElement), _ = this.getElementLeft(a[i].parentElement);
      a[i].dataset.of_top = r, a[i].dataset.of_left = o, a[i].dataset.of_parent_top = h, a[i].dataset.of_parent_left = _, e.sticky_child_data.push({
        elm: a[i],
        limit: t.limit,
        set_var: t.set_var,
        top: r,
        parent_top: h,
        left: o,
        parent_left: _,
        height: s,
        width: l,
        center_x: 0,
        center_y: 0
      });
    }
  }
  sticky_child_run() {
    for (let t = 0; t < e.sticky_child_data.length; t++) {
      let a = e.sticky_child_data[t].top - this.data.wrapper_height / 2 + e.sticky_child_data[t].height / 2 - this.data.scroll_y, i = e.sticky_child_data[t].left - this.data.wrapper_width / 2 + e.sticky_child_data[t].width / 2 - this.data.scroll_x;
      e.sticky_child_data[t].center_x = i, e.sticky_child_data[t].center_y = a, e.sticky_child_data[t].elm.dataset.stc_x = i, e.sticky_child_data[t].elm.dataset.stc_y = a;
    }
  }
  sticky_child_data_update() {
    for (let t = 0; t < e.sticky_child_data.length; t++)
      e.sticky_child_data[t].top = this.getElementTop(e.sticky_child_data[t].elm), e.sticky_child_data[t].parent_top = this.getElementTop(e.sticky_child_data[t].elm.parentElement), e.sticky_child_data[t].left = this.getElementLeft(e.sticky_child_data[t].elm), e.sticky_child_data[t].parent_left = this.getElementLeft(e.sticky_child_data[t].elm.parentElement), e.sticky_child_data[t].height = e.sticky_child_data[t].elm.clientHeight, e.sticky_child_data[t].width = e.sticky_child_data[t].elm.clientWidth, e.sticky_child_data[t].elm.dataset.of_top = e.sticky_child_data[t].top, e.sticky_child_data[t].elm.dataset.of_parent_top = e.sticky_child_data[t].parent_top, e.sticky_child_data[t].elm.dataset.of_left = e.sticky_child_data[t].left, e.sticky_child_data[t].elm.dataset.of_parent_left = e.sticky_child_data[t].parent_left;
  }
  // reach element
  reach(t, a, i) {
    t && (e.reach.push({
      elm: t,
      offset_y: a || 0,
      offset_x: i || 0
    }), e.reach = this.uniqueData(e.reach), this.reach_push());
  }
  reach_push() {
    e.reach_data.length = 0;
    for (let t = 0; t < e.reach.length; t++)
      this.reach_data(e.reach[t]);
  }
  reach_data(t) {
    let a = document.querySelectorAll(t.elm);
    for (let i = 0; i < a.length; i++) {
      let s = this.getElementTop(a[i]), l = this.getElementLeft(a[i]);
      a[i].dataset.of_top = s, a[i].dataset.of_left = l;
      let r = a[i].clientHeight, o = a[i].clientWidth;
      e.reach_data.push({
        elm: a[i],
        top: s,
        left: l,
        height: r,
        width: o,
        center_y: 0,
        center_x: 0,
        offset_y: t.offset_y,
        offset_x: t.offset_x
      });
    }
  }
  reach_run() {
    for (let t = 0; t < e.reach_data.length; t++) {
      let a = e.reach_data[t].top - this.data.wrapper_height / 2 - this.data.scroll_y;
      e.reach_data[t].center_y = a;
      let i = e.reach_data[t].left - this.data.wrapper_width / 2 - this.data.scroll_x;
      e.reach_data[t].center_x = i;
      let s = a - e.reach_data[t].offset_y * (this.data.wrapper_height / 2), l = i - e.reach_data[t].offset_x * (this.data.wrapper_width / 2);
      s < 0 ? e.reach_data[t].elm.dataset.active_y = 1 : e.reach_data[t].elm.dataset.active_y = 0, l < 0 ? e.reach_data[t].elm.dataset.active_x = 1 : e.reach_data[t].elm.dataset.active_x = 0;
    }
  }
  reach_data_update() {
    for (let t = 0; t < e.reach_data.length; t++)
      e.reach_data[t].top = this.getElementTop(e.reach_data[t].elm), e.reach_data[t].left = this.getElementLeft(e.reach_data[t].elm), e.reach_data[t].height = e.reach_data[t].elm.clientHeight, e.reach_data[t].width = e.reach_data[t].elm.clientWidth, e.reach_data[t].elm.dataset.of_top = e.reach_data[t].top, e.reach_data[t].elm.dataset.of_left = e.reach_data[t].left;
  }
  // mouse
  mouse(t, a, i, s, l) {
    t && (e.mouse.push({
      elm: t,
      limit: a || 0,
      friction_y: i || 0.1,
      friction_x: s || 0.1,
      outside: l || 0
    }), e.mouse = this.uniqueData(e.mouse), this.mouse_push());
  }
  mouse_push() {
    e.mouse_data.length = 0;
    for (let t = 0; t < e.mouse.length; t++)
      this.mouse_data(e.mouse[t]);
  }
  mouse_data(t) {
    let a = document.querySelectorAll(t.elm);
    for (let i = 0; i < a.length; i++) {
      let s = a[i].clientHeight, l = a[i].clientWidth, r = a[i].parentElement.clientHeight, o = a[i].parentElement.clientWidth, h = this.getElementTop(a[i]), _ = this.getElementTop(a[i].parentElement), d = this.getElementLeft(a[i]), p = this.getElementLeft(a[i].parentElement);
      e.mouse_data.push({
        elm: a[i],
        limit: t.limit,
        friction_y: t.friction_y,
        friction_x: t.friction_x,
        top: h,
        left: d,
        height: s,
        width: l,
        parent_height: r,
        parent_width: o,
        parent_top: _,
        parent_left: p,
        mouse_y: 0,
        mouse_y_friction: 0,
        mouse_x: 0,
        mouse_x_friction: 0,
        outside: t.outside
      });
    }
  }
  mouse_run() {
    for (let t = 0; t < e.mouse_data.length; t++) {
      let a = this.data.page_x - (e.mouse_data[t].left + e.mouse_data[t].width / 2), i = this.data.page_y - (e.mouse_data[t].top + e.mouse_data[t].height / 2);
      if (e.mouse_data[t].outside == 0 && (a = a + this.data.scroll_x, i = i + this.data.scroll_y), e.mouse_data[t].limit == 0)
        e.mouse_data[t].mouse_x = a, e.mouse_data[t].mouse_y = i;
      else if (e.mouse_data[t].limit == 1)
        Math.abs(a) < e.mouse_data[t].parent_width / 2 && Math.abs(i) < e.mouse_data[t].parent_height / 2 ? (e.mouse_data[t].mouse_x = a, e.mouse_data[t].mouse_y = i) : (e.mouse_data[t].mouse_x = 0, e.mouse_data[t].mouse_y = 0);
      else if (parseFloat(e.mouse_data[t].limit) !== NaN) {
        let s = parseFloat(e.mouse_data[t].limit);
        Math.abs(a) < s && Math.abs(i) < s ? (e.mouse_data[t].mouse_x = a, e.mouse_data[t].mouse_y = i) : (e.mouse_data[t].mouse_x = 0, e.mouse_data[t].mouse_y = 0);
      }
      e.mouse_data[t].mouse_x_friction = Math.round((e.mouse_data[t].mouse_x_friction + (e.mouse_data[t].mouse_x - e.mouse_data[t].mouse_x_friction) * e.mouse_data[t].friction_x) * 100) / 100, e.mouse_data[t].mouse_y_friction = Math.round((e.mouse_data[t].mouse_y_friction + (e.mouse_data[t].mouse_y - e.mouse_data[t].mouse_y_friction) * e.mouse_data[t].friction_y) * 100) / 100, e.mouse_data[t].elm.dataset.mxx = Math.round(e.mouse_data[t].mouse_x_friction * 100) / 100, e.mouse_data[t].elm.dataset.myy = Math.round(e.mouse_data[t].mouse_y_friction * 100) / 100;
    }
  }
  mouse_data_update() {
    for (let t = 0; t < e.mouse_data.length; t++)
      e.mouse_data[t].top = this.getElementTop(e.mouse_data[t].elm), e.mouse_data[t].parent_top = this.getElementTop(e.mouse_data[t].elm.parentElement), e.mouse_data[t].left = this.getElementLeft(e.mouse_data[t].elm), e.mouse_data[t].parent_left = this.getElementLeft(e.mouse_data[t].elm.parentElement), e.mouse_data[t].width = e.mouse_data[t].elm.clientWidth, e.mouse_data[t].parent_width = e.mouse_data[t].elm.parentElement.clientWidth, e.mouse_data[t].height = e.mouse_data[t].elm.clientHeight, e.mouse_data[t].parent_height = e.mouse_data[t].elm.parentElement.clientHeight;
  }
};
export {
  e as AlpData,
  H as Alpscroll
};
