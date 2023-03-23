requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;

import "/src/Alpscroll.css";
import Lenis from "@studio-freight/lenis";
export const Alpscroll = class Alpscroll {
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
      parallax: [],
      parallax_data: [],
      sticky: [],
      sticky_data: [],
      sticky_child: [],
      sticky_child_data: [],
      reach: [],
      reach_data: [],
      mouse: [],
      mouse_data: [],
      size_h: 0,
      size_w: 0,
    };
    this.lenis = "";
    this.raf = this.raf.bind(this);
    this.animationUpdate = this.animationUpdate.bind(this);
    this.updateAnim = "";
    this.getMousePosition();
  }
  init(lerp, duration, infinite, smoothTouch, wrapper) {
    let Value = {
      lerp: lerp ? lerp : 0.1,
      duration: duration ? duration : 1.2,
      infinite: infinite ? infinite : false,
      smoothTouch: smoothTouch ? smoothTouch : false,
      wrapper: wrapper ? wrapper : "body",
    };
    this.data.wrapper = Value.wrapper;
    this.lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: Value.smoothTouch,
      touchMultiplier: 3,
      lerp: Value.lerp,
      duration: Value.duration,
      infinite: Value.infinite,
    });
    this.lenis.on("scroll", (e) => {});
    this.onLoad();
    console.log("AlpScroll Inited With Lenis");
  }
  // Get Size
  getSize() {
    if (this.data.size_h != document.querySelector(this.data.wrapper).clientHeight || this.data.size_w != document.querySelector(this.data.wrapper).clientWidth) {
      this.data.wrapper_height = window.innerHeight;
      this.data.wrapper_width = window.innerWidth;
      this.data.scroll_height = document.querySelector(this.data.wrapper).clientHeight;
      this.data.scroll_width = document.querySelector(this.data.wrapper).clientWidth;
      //
      this.data.size_h = this.data.scroll_height;
      this.data.size_w = this.data.scroll_width;
      this.ResetData();
    }
  }
  ResetData() {
    this.parallax_data_update();
    this.sticky_data_update();
    this.sticky_child_data_update();
    this.reach_data_update();
    this.mouse_data_update();
  }
  // Update animation
  animationUpdate() {
    this.parallax_run();
    this.sticky_run();
    this.sticky_child_run();
    this.reach_run();
    this.mouse_run();
    this.updateAnim = requestAnimationFrame(this.animationUpdate);
  }
  onLoad() {
    window.addEventListener("load", () => {
      requestAnimationFrame(this.raf);
      this.updateAnim = requestAnimationFrame(this.animationUpdate);
      document.querySelector(this.data.wrapper).classList.add("Alpscroll");
    });
  }
  // 循环循环循环
  raf(time) {
    this.lenis.raf(time);
    this.getSize();
    this.data.scroll_y = document.documentElement.scrollTop || document.body.scrollTop;
    this.data.scroll_x = document.documentElement.scrollLeft || document.body.scrollLeft;
    requestAnimationFrame(this.raf);
  }
  // 获取鼠标位置
  getMousePosition() {
    window.addEventListener("mousemove", (e) => {
      this.data.page_x = e.pageX - window.scrollX;
      this.data.page_y = e.pageY - window.scrollY;
    });
  }
  // 获取元素到顶部的距离
  getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop;
  }
  // 获取元素到左边的距离
  getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft;
  }
  // 视差
  // palallax
  parallax(elm, limit, friction_y, friction_x) {
    if (elm) {
      // push
      this.data.parallax.push({
        elm: elm,
        limit: limit ? limit : 0,
        friction_y: friction_y ? friction_y : 0.1,
        friction_x: friction_x ? friction_x : 0.1,
      });
      window.addEventListener("load", () => {
        this.parallax_push();
      });
    }
  }
  parallax_push() {
    // reset and update
    this.data.parallax_data.length = 0;
    for (let i = 0; i < this.data.parallax.length; i++) {
      this.parallax_data(this.data.parallax[i]);
    }
  }
  parallax_data(elms) {
    // push all elm data
    let the_elms = document.querySelectorAll(elms.elm);
    for (let i = 0; i < the_elms.length; i++) {
      let offset_top = this.getElementTop(the_elms[i]);
      let offset_left = this.getElementLeft(the_elms[i]);
      the_elms[i].dataset.of_top = offset_top;
      the_elms[i].dataset.of_left = offset_left;
      let the_elms_height = the_elms[i].clientHeight;
      let the_elms_width = the_elms[i].clientWidth;
      this.data.parallax_data.push({
        elm: the_elms[i],
        limit: elms.limit,
        friction_y: elms.friction_y,
        friction_x: elms.friction_x,
        top: offset_top,
        left: offset_left,
        height: the_elms_height,
        width: the_elms_width,
        center_y: 0,
        center_y_friction: 0,
        center_x: 0,
        center_x_friction: 0,
      });
    }
    this.parallax_run();
  }
  parallax_run() {
    for (let i = 0; i < this.data.parallax_data.length; i++) {
      // y
      let center_y_init = this.data.parallax_data[i].top - this.data.wrapper_height / 2 + this.data.parallax_data[i].height / 2 - this.data.scroll_y;
      this.data.parallax_data[i].center_y = center_y_init;
      // x
      let center_x_init = this.data.parallax_data[i].left - this.data.wrapper_width / 2 + this.data.parallax_data[i].width / 2 - this.data.scroll_x;
      this.data.parallax_data[i].center_x = center_x_init;
      // set value
      let center_y = 0;
      let center_x = 0;
      // 范围内生效
      let lenght_y_bottom = this.data.wrapper_height + this.data.parallax_data[i].height * 1;
      let lenght_y_top = (this.data.wrapper_height + this.data.parallax_data[i].height * 1) * -1;
      let lenght_x_right = this.data.wrapper_width + this.data.parallax_data[i].width;
      let lenght_x_left = (this.data.wrapper_width + this.data.parallax_data[i].width) * -1;

      // 无限制移动
      if (this.data.parallax_data[i].limit == 0) {
        if (this.data.parallax_data[i].center_y < lenght_y_bottom && this.data.parallax_data[i].center_y > lenght_y_top) {
          center_y = this.data.parallax_data[i].center_y;
        } else if (this.data.parallax_data[i].center_y > lenght_y_bottom) {
          center_y = lenght_y_bottom;
        } else if (this.data.parallax_data[i].center_y < lenght_y_top) {
          center_y = lenght_y_top;
        }

        if (this.data.parallax_data[i].center_x < lenght_x_right && this.data.parallax_data[i].center_x > lenght_x_left) {
          center_x = this.data.parallax_data[i].center_x;
        } else if (this.data.parallax_data[i].center_x > lenght_x_right) {
          center_x = lenght_x_right;
        } else if (this.data.parallax_data[i].center_x < lenght_x_left) {
          center_x = lenght_x_left;
        }
      }
      //
      // 限制从底到中心
      else if (this.data.parallax_data[i].limit == 1) {
        if (this.data.parallax_data[i].center_y > 0 && this.data.parallax_data[i].center_y < lenght_y_bottom) {
          center_y = this.data.parallax_data[i].center_y;
        } else {
          center_y = 0;
        }
        if (this.data.parallax_data[i].center_x > 0) {
          center_x = this.data.parallax_data[i].center_x;
        } else {
          center_x = 0;
        }
      }
      // 限制从中心到顶
      else if (this.data.parallax_data[i].limit == 2) {
        if (this.data.parallax_data[i].center_y < 0 && this.data.parallax_data[i].center_y > lenght_y_top) {
          center_y = this.data.parallax_data[i].center_y;
        } else {
          center_y = 0;
        }
        if (this.data.parallax_data[i].center_x < 0) {
          center_x = this.data.parallax_data[i].center_x;
        } else {
          center_x = 0;
        }
      }
      // 缓动计算
      this.data.parallax_data[i].center_y_friction = Math.round((this.data.parallax_data[i].center_y_friction + (center_y - this.data.parallax_data[i].center_y_friction) * this.data.parallax_data[i].friction_y) * 100) / 100;
      this.data.parallax_data[i].center_x_friction = Math.round((this.data.parallax_data[i].center_x_friction + (center_x - this.data.parallax_data[i].center_x_friction) * this.data.parallax_data[i].friction_x) * 100) / 100;

      let progerss_y = 1 - center_y / (this.data.wrapper_height / 2);
      let progerss_x = 1 - center_x / (this.data.wrapper_width / 2);
      let progerss_yf = 1 - this.data.parallax_data[i].center_y_friction / (this.data.wrapper_height / 2);
      let progerss_xf = 1 - this.data.parallax_data[i].center_x_friction / (this.data.wrapper_width / 2);

      // 设置元素data值
      this.data.parallax_data[i].elm.dataset.pl_y = center_y;
      this.data.parallax_data[i].elm.dataset.pl_ym = this.data.parallax_data[i].center_y_friction;
      this.data.parallax_data[i].elm.dataset.pl_x = center_x;
      this.data.parallax_data[i].elm.dataset.pl_xm = this.data.parallax_data[i].center_x_friction;
      this.data.parallax_data[i].elm.dataset.pl_pg_y = progerss_y;
      this.data.parallax_data[i].elm.dataset.pl_pg_ym = progerss_yf;
      this.data.parallax_data[i].elm.dataset.pl_pg_x = progerss_x;
      this.data.parallax_data[i].elm.dataset.pl_pg_xm = progerss_xf;
    }
  }
  parallax_data_update() {
    for (let i = 0; i < this.data.parallax_data.length; i++) {
      this.data.parallax_data[i].top = this.getElementTop(this.data.parallax_data[i].elm);
      this.data.parallax_data[i].left = this.getElementLeft(this.data.parallax_data[i].elm);
      this.data.parallax_data[i].height = this.data.parallax_data[i].elm.clientHeight;
      this.data.parallax_data[i].width = this.data.parallax_data[i].elm.clientWidth;
      //
      this.data.parallax_data[i].elm.dataset.of_top = this.data.parallax_data[i].top;
      this.data.parallax_data[i].elm.dataset.of_left = this.data.parallax_data[i].left;
    }
  }
  // 固定
  // Sticky
  sticky(elm, limit, friction_y, friction_x, parent_elm) {
    if (elm) {
      // push
      this.data.sticky.push({
        elm: elm,
        limit: limit ? limit : 0,
        friction_y: friction_y ? friction_y : 1,
        friction_x: friction_x ? friction_x : 1,
        parent_elm: parent_elm ? parent_elm : null,
      });
      window.addEventListener("load", () => {
        this.sticky_push();
      });
    }
  }
  sticky_push() {
    // reset and update
    this.data.sticky_data.length = 0;
    for (let i = 0; i < this.data.sticky.length; i++) {
      this.sticky_data(this.data.sticky[i]);
    }
  }
  sticky_data(elms) {
    // push all elm data
    let the_elms = document.querySelectorAll(elms.elm);
    for (let i = 0; i < the_elms.length; i++) {
      the_elms[i].classList.add("sticky-element");
      let the_elms_height = the_elms[i].clientHeight;
      let the_elms_width = the_elms[i].clientWidth;
      let parent_height = 0;
      let parent_width = 0;
      if (elms.parent_elm) {
        parent_height = the_elms[i].closest(elms.parent_elm).clientHeight;
        parent_width = the_elms[i].closest(elms.parent_elm).clientWidth;
      } else {
        parent_height = the_elms[i].parentElement.clientHeight;
        parent_width = the_elms[i].parentElement.clientWidth;
      }
      // set parent height
      // if (the_elms_width > parent_width) {
      //   the_elms[i].parentElement.style.setProperty("height", `${the_elms_width}px`);
      // }
      // parent_height = the_elms[i].parentElement.clientHeight;

      let offset_top = this.getElementTop(the_elms[i]);
      let offset_left = this.getElementLeft(the_elms[i]);
      let parent_offset_top = this.getElementTop(the_elms[i].parentElement);
      let parent_offset_left = this.getElementLeft(the_elms[i].parentElement);
      if (elms.parent_elm) {
        parent_offset_top = this.getElementTop(the_elms[i].closest(elms.parent_elm));
        parent_offset_left = this.getElementLeft(the_elms[i].closest(elms.parent_elm));
      }

      the_elms[i].dataset.of_top = offset_top;
      the_elms[i].dataset.of_left = offset_left;

      the_elms[i].style.setProperty("--st_top", offset_top - parent_offset_top);
      the_elms[i].style.setProperty("--st_left", offset_left);
      the_elms[i].style.setProperty("--st_parent_width", parent_width);
      the_elms[i].style.setProperty("--st_parent_height", parent_height);
      the_elms[i].style.setProperty("--st_width", the_elms_width);
      the_elms[i].style.setProperty("--st_height", the_elms_height);

      this.data.sticky_data.push({
        elm: the_elms[i],
        limit: elms.limit,
        friction_y: elms.friction_y,
        friction_x: elms.friction_x,
        top: offset_top,
        left: offset_left,
        height: the_elms_height,
        width: the_elms_width,
        parent_height: parent_height,
        parent_width: parent_width,
        parent_top: parent_offset_top,
        parent_left: parent_offset_left,
        progress: 0,
        progress_friction: 0,
        stick_y: 0,
        stick_y_friction: 0,
        stick_x: 0,
        stick_x_friction: 0,
        parent_elm: elms.parent_elm ? elms.parent_elm : null,
      });
    }
    this.sticky_run();
  }
  sticky_run() {
    for (let i = 0; i < this.data.sticky_data.length; i++) {
      // no-limit
      if (this.data.sticky_data[i].limit == 0) {
        // update data
        this.data.sticky_data[i].progress = this.data.scroll_y / (this.data.scroll_height - this.data.wrapper_height);
        this.data.sticky_data[i].stick_y = this.data.scroll_y;
      }
      // limit-in-container
      else if (this.data.sticky_data[i].limit == 1) {
        let stick_top = this.data.sticky_data[i].top - this.data.scroll_y;
        let stick_bottom = this.data.sticky_data[i].parent_top + this.data.sticky_data[i].parent_height - this.data.scroll_y;
        let stick_x_distence = (stick_top / (this.data.sticky_data[i].parent_height - this.data.sticky_data[i].height - (this.data.sticky_data[i].top - this.data.sticky_data[i].parent_top))) * (this.data.sticky_data[i].width - this.data.sticky_data[i].parent_width);
        if (stick_top <= 0 && stick_bottom >= this.data.sticky_data[i].height) {
          this.data.sticky_data[i].stick_y = stick_top;
          this.data.sticky_data[i].stick_x = stick_x_distence;
          this.data.sticky_data[i].progress = stick_top / (this.data.sticky_data[i].height - this.data.sticky_data[i].parent_height + (this.data.sticky_data[i].top - this.data.sticky_data[i].parent_top));
          this.data.sticky_data[i].elm.dataset.stickin = "1";
          this.data.sticky_data[i].elm.dataset.stickout = "0";
          this.data.sticky_data[i].elm.dataset.fixedlength = "0";
        } else if (stick_top > 0) {
          this.data.sticky_data[i].stick_y = 0;
          this.data.sticky_data[i].stick_x = 0;
          this.data.sticky_data[i].progress = 0;
          this.data.sticky_data[i].elm.dataset.stickin = "0";
          this.data.sticky_data[i].elm.dataset.stickout = "0";
          this.data.sticky_data[i].elm.dataset.fixedlength = "0";
        } else {
          this.data.sticky_data[i].stick_y = this.data.sticky_data[i].height - this.data.sticky_data[i].parent_height + (this.data.sticky_data[i].top - this.data.sticky_data[i].parent_top);
          this.data.sticky_data[i].stick_x = this.data.sticky_data[i].parent_width - this.data.sticky_data[i].width;
          this.data.sticky_data[i].progress = 1;
          this.data.sticky_data[i].elm.dataset.stickout = "1";
          this.data.sticky_data[i].elm.dataset.stickin = "0";
          this.data.sticky_data[i].elm.dataset.fixedlength = this.data.sticky_data[i].stick_y;
        }
      }
      // friction data
      this.data.sticky_data[i].stick_y_friction = Math.round((this.data.sticky_data[i].stick_y_friction + (this.data.sticky_data[i].stick_y - this.data.sticky_data[i].stick_y_friction) * this.data.sticky_data[i].friction_y) * 100) / 100;
      this.data.sticky_data[i].stick_x_friction = Math.round((this.data.sticky_data[i].stick_x_friction + (this.data.sticky_data[i].stick_x - this.data.sticky_data[i].stick_x_friction) * this.data.sticky_data[i].friction_x) * 100) / 100;
      this.data.sticky_data[i].progress_friction = Math.round((this.data.sticky_data[i].progress_friction + (this.data.sticky_data[i].progress - this.data.sticky_data[i].progress_friction) * this.data.sticky_data[i].friction_x) * 1000000) / 1000000;

      // set data
      this.data.sticky_data[i].elm.dataset.st_y = this.data.sticky_data[i].stick_y;
      this.data.sticky_data[i].elm.dataset.st_ym = this.data.sticky_data[i].stick_y_friction;
      this.data.sticky_data[i].elm.dataset.st_x = this.data.sticky_data[i].stick_x;
      this.data.sticky_data[i].elm.dataset.st_xm = this.data.sticky_data[i].stick_x_friction;
      this.data.sticky_data[i].elm.dataset.st_pg = this.data.sticky_data[i].progress;
      this.data.sticky_data[i].elm.dataset.st_pgm = this.data.sticky_data[i].progress_friction;
    }
  }
  sticky_data_update() {
    for (let i = 0; i < this.data.sticky_data.length; i++) {
      this.data.sticky_data[i].top = this.getElementTop(this.data.sticky_data[i].elm);
      this.data.sticky_data[i].parent_top = this.getElementTop(this.data.sticky_data[i].elm.parentElement);
      this.data.sticky_data[i].left = this.getElementLeft(this.data.sticky_data[i].elm);
      this.data.sticky_data[i].parent_left = this.getElementLeft(this.data.sticky_data[i].elm.parentElement);
      this.data.sticky_data[i].width = this.data.sticky_data[i].elm.clientWidth;
      this.data.sticky_data[i].parent_width = this.data.sticky_data[i].elm.parentElement.clientWidth;
      this.data.sticky_data[i].height = this.data.sticky_data[i].elm.clientHeight;
      this.data.sticky_data[i].parent_height = this.data.sticky_data[i].elm.parentElement.clientHeight;
      // if (this.data.sticky_data[i].width > this.data.sticky_data[i].parent_width) {
      //   this.data.sticky_data[i].parent_height = this.data.sticky_data[i].width;
      //   this.data.sticky_data[i].elm.parentElement.style.setProperty("height", `${this.data.sticky_data[i].parent_height}px`);
      // }
      //
      this.data.sticky_data[i].elm.dataset.of_top = this.data.sticky_data[i].top;
      this.data.sticky_data[i].elm.dataset.of_left = this.data.sticky_data[i].left;
      if (this.data.sticky_data[i].parent_elm) {
        this.data.sticky_data[i].parent_top = this.getElementTop(this.data.sticky_data[i].elm.closest(this.data.sticky_data[i].parent_elm));
        this.data.sticky_data[i].parent_left = this.getElementLeft(this.data.sticky_data[i].elm.closest(this.data.sticky_data[i].parent_elm));
        this.data.sticky_data[i].parent_width = this.data.sticky_data[i].elm.closest(this.data.sticky_data[i].parent_elm).clientWidth;
        this.data.sticky_data[i].parent_height = this.data.sticky_data[i].elm.closest(this.data.sticky_data[i].parent_elm).clientHeight;
      }
    }
  }
  // Sticky Child
  sticky_child(elm, limit) {
    if (elm) {
      // push
      this.data.sticky_child.push({
        elm: elm,
        limit: limit ? limit : 0,
      });
      window.addEventListener("load", () => {
        this.sticky_child_push();
      });
    }
  }
  sticky_child_push() {
    // reset and update
    this.data.sticky_child_data.length = 0;
    for (let i = 0; i < this.data.sticky_child.length; i++) {
      this.sticky_child_data(this.data.sticky_child[i]);
    }
  }
  sticky_child_data(elms) {
    // push all elm data
    let the_elms = document.querySelectorAll(elms.elm);
    for (let i = 0; i < the_elms.length; i++) {
      let the_elms_height = the_elms[i].clientHeight;
      let the_elms_width = the_elms[i].clientWidth;

      let offset_top = this.getElementTop(the_elms[i]);
      let offset_left = this.getElementLeft(the_elms[i]);
      let parent_offset_top = this.getElementTop(the_elms[i].parentElement);
      let parent_offset_left = this.getElementLeft(the_elms[i].parentElement);

      the_elms[i].dataset.of_top = offset_top;
      the_elms[i].dataset.of_left = offset_left;
      the_elms[i].dataset.of_parent_top = parent_offset_top;
      the_elms[i].dataset.of_parent_left = parent_offset_left;

      this.data.sticky_child_data.push({
        elm: the_elms[i],
        limit: elms.limit,
        set_var: elms.set_var,
        top: offset_top,
        parent_top: parent_offset_top,
        left: offset_left,
        parent_left: parent_offset_left,
        height: the_elms_height,
        width: the_elms_width,
        center_x: 0,
        center_y: 0,
      });
    }
    this.sticky_child_run();
  }
  sticky_child_run() {
    for (let i = 0; i < this.data.sticky_child_data.length; i++) {
      let center_y_init = this.data.sticky_child_data[i].top - this.data.wrapper_height / 2 + this.data.sticky_child_data[i].height / 2 - this.data.scroll_y;
      let center_x_init = this.data.sticky_child_data[i].left - this.data.wrapper_width / 2 + this.data.sticky_child_data[i].width / 2 - this.data.scroll_x;
      this.data.sticky_child_data[i].center_x = center_x_init;
      this.data.sticky_child_data[i].center_y = center_y_init;
      // set data
      this.data.sticky_child_data[i].elm.dataset.stc_x = center_x_init;
      this.data.sticky_child_data[i].elm.dataset.stc_y = center_y_init;
    }
  }
  sticky_child_data_update() {
    for (let i = 0; i < this.data.sticky_child_data.length; i++) {
      this.data.sticky_child_data[i].top = this.getElementTop(this.data.sticky_child_data[i].elm);
      this.data.sticky_child_data[i].parent_top = this.getElementTop(this.data.sticky_child_data[i].elm.parentElement);
      this.data.sticky_child_data[i].left = this.getElementLeft(this.data.sticky_child_data[i].elm);
      this.data.sticky_child_data[i].parent_left = this.getElementLeft(this.data.sticky_child_data[i].elm.parentElement);
      this.data.sticky_child_data[i].height = this.data.sticky_child_data[i].elm.clientHeight;
      this.data.sticky_child_data[i].width = this.data.sticky_child_data[i].elm.clientWidth;
      //
      this.data.sticky_child_data[i].elm.dataset.of_top = this.data.sticky_child_data[i].top;
      this.data.sticky_child_data[i].elm.dataset.of_parent_top = this.data.sticky_child_data[i].parent_top;
      this.data.sticky_child_data[i].elm.dataset.of_left = this.data.sticky_child_data[i].left;
      this.data.sticky_child_data[i].elm.dataset.of_parent_left = this.data.sticky_child_data[i].parent_left;
    }
  }

  // reach element
  reach(elm, offset_y, offset_x) {
    if (elm) {
      // push
      this.data.reach.push({
        elm: elm,
        offset_y: offset_y ? offset_y : 0,
        offset_x: offset_x ? offset_x : 0,
      });
      window.addEventListener("load", () => {
        this.reach_push();
      });
    }
  }
  reach_push() {
    // reset and update
    this.data.reach_data.length = 0;
    for (let i = 0; i < this.data.reach.length; i++) {
      this.reach_data(this.data.reach[i]);
    }
  }
  reach_data(elms) {
    // push all elm data
    let the_elms = document.querySelectorAll(elms.elm);
    for (let i = 0; i < the_elms.length; i++) {
      let offset_top = this.getElementTop(the_elms[i]);
      let offset_left = this.getElementLeft(the_elms[i]);
      the_elms[i].dataset.of_top = offset_top;
      the_elms[i].dataset.of_left = offset_left;
      let the_elms_height = the_elms[i].clientHeight;
      let the_elms_width = the_elms[i].clientWidth;
      this.data.reach_data.push({
        elm: the_elms[i],
        top: offset_top,
        left: offset_left,
        height: the_elms_height,
        width: the_elms_width,
        center_y: 0,
        center_x: 0,
        offset_y: elms.offset_y,
        offset_x: elms.offset_x,
      });
    }
    this.reach_run();
  }
  reach_run() {
    for (let i = 0; i < this.data.reach_data.length; i++) {
      // y
      let center_y_init = this.data.reach_data[i].top - this.data.wrapper_height / 2 - this.data.scroll_y;
      this.data.reach_data[i].center_y = center_y_init;
      // x
      let center_x_init = this.data.reach_data[i].left - this.data.wrapper_width / 2 - this.data.scroll_x;
      this.data.reach_data[i].center_x = center_x_init;

      let reach_y = center_y_init - this.data.reach_data[i].offset_y * (this.data.wrapper_height / 2);
      let reach_x = center_x_init - this.data.reach_data[i].offset_x * (this.data.wrapper_width / 2);

      if (reach_y < 0) {
        this.data.reach_data[i].elm.dataset.active_y = 1;
      } else {
        this.data.reach_data[i].elm.dataset.active_y = 0;
      }
      if (reach_x < 0) {
        this.data.reach_data[i].elm.dataset.active_x = 1;
      } else {
        this.data.reach_data[i].elm.dataset.active_x = 0;
      }
    }
  }
  reach_data_update() {
    for (let i = 0; i < this.data.reach_data.length; i++) {
      this.data.reach_data[i].top = this.getElementTop(this.data.reach_data[i].elm);
      this.data.reach_data[i].left = this.getElementLeft(this.data.reach_data[i].elm);
      this.data.reach_data[i].height = this.data.reach_data[i].elm.clientHeight;
      this.data.reach_data[i].width = this.data.reach_data[i].elm.clientWidth;
      //
      this.data.reach_data[i].elm.dataset.of_top = this.data.reach_data[i].top;
      this.data.reach_data[i].elm.dataset.of_left = this.data.reach_data[i].left;
    }
  }

  // mouse
  mouse(elm, limit, friction_y, friction_x, outside) {
    if (elm) {
      // push
      this.data.mouse.push({
        elm: elm,
        limit: limit ? limit : 0,
        friction_y: friction_y ? friction_y : 0.1,
        friction_x: friction_x ? friction_x : 0.1,
        outside: outside ? outside : 0,
      });
      window.addEventListener("load", () => {
        this.mouse_push();
      });
    }
  }
  mouse_push() {
    // reset and update
    this.data.mouse_data.length = 0;
    for (let i = 0; i < this.data.mouse.length; i++) {
      this.mouse_data(this.data.mouse[i]);
    }
  }
  mouse_data(elms) {
    // push all elm data
    let the_elms = document.querySelectorAll(elms.elm);
    for (let i = 0; i < the_elms.length; i++) {
      let the_elms_height = the_elms[i].clientHeight;
      let the_elms_width = the_elms[i].clientWidth;
      let parent_height = the_elms[i].parentElement.clientHeight;
      let parent_width = the_elms[i].parentElement.clientWidth;
      let offset_top = this.getElementTop(the_elms[i]);
      let parent_offset_top = this.getElementTop(the_elms[i].parentElement);
      let offset_left = this.getElementLeft(the_elms[i]);
      let parent_offset_left = this.getElementLeft(the_elms[i].parentElement);

      this.data.mouse_data.push({
        elm: the_elms[i],
        limit: elms.limit,
        friction_y: elms.friction_y,
        friction_x: elms.friction_x,
        top: offset_top,
        left: offset_left,
        height: the_elms_height,
        width: the_elms_width,
        parent_height: parent_height,
        parent_width: parent_width,
        parent_top: parent_offset_top,
        parent_left: parent_offset_left,
        mouse_y: 0,
        mouse_y_friction: 0,
        mouse_x: 0,
        mouse_x_friction: 0,
        outside: elms.outside,
      });
    }
    this.mouse_run();
  }
  mouse_run() {
    for (let i = 0; i < this.data.mouse_data.length; i++) {
      let center_x = this.data.page_x - (this.data.mouse_data[i].left + this.data.mouse_data[i].width / 2);
      let center_y = this.data.page_y - (this.data.mouse_data[i].top + this.data.mouse_data[i].height / 2);
      if (this.data.mouse_data[i].outside == 0) {
        center_x = center_x + this.data.scroll_x;
        center_y = center_y + this.data.scroll_y;
      }
      // limit = 0
      if (this.data.mouse_data[i].limit == 0) {
        this.data.mouse_data[i].mouse_x = center_x;
        this.data.mouse_data[i].mouse_y = center_y;
      }
      // limit = 1
      else if (this.data.mouse_data[i].limit == 1) {
        if (Math.abs(center_x) < this.data.mouse_data[i].parent_width / 2 && Math.abs(center_y) < this.data.mouse_data[i].parent_height / 2) {
          this.data.mouse_data[i].mouse_x = center_x;
          this.data.mouse_data[i].mouse_y = center_y;
        } else {
          this.data.mouse_data[i].mouse_x = 0;
          this.data.mouse_data[i].mouse_y = 0;
        }
      }
      // limit = "num"
      else if (parseFloat(this.data.mouse_data[i].limit) !== NaN) {
        let limit = parseFloat(this.data.mouse_data[i].limit);
        if (Math.abs(center_x) < limit && Math.abs(center_y) < limit) {
          this.data.mouse_data[i].mouse_x = center_x;
          this.data.mouse_data[i].mouse_y = center_y;
        } else {
          this.data.mouse_data[i].mouse_x = 0;
          this.data.mouse_data[i].mouse_y = 0;
        }
      }
      // updata friction data
      this.data.mouse_data[i].mouse_x_friction = Math.round((this.data.mouse_data[i].mouse_x_friction + (this.data.mouse_data[i].mouse_x - this.data.mouse_data[i].mouse_x_friction) * this.data.mouse_data[i].friction_x) * 100) / 100;
      this.data.mouse_data[i].mouse_y_friction = Math.round((this.data.mouse_data[i].mouse_y_friction + (this.data.mouse_data[i].mouse_y - this.data.mouse_data[i].mouse_y_friction) * this.data.mouse_data[i].friction_y) * 100) / 100;

      this.data.mouse_data[i].elm.dataset.mxx = Math.round(this.data.mouse_data[i].mouse_x_friction * 100) / 100;
      this.data.mouse_data[i].elm.dataset.myy = Math.round(this.data.mouse_data[i].mouse_y_friction * 100) / 100;
    }
  }
  mouse_data_update() {
    for (let i = 0; i < this.data.mouse_data.length; i++) {
      this.data.mouse_data[i].top = this.getElementTop(this.data.mouse_data[i].elm);
      this.data.mouse_data[i].parent_top = this.getElementTop(this.data.mouse_data[i].elm.parentElement);
      this.data.mouse_data[i].left = this.getElementLeft(this.data.mouse_data[i].elm);
      this.data.mouse_data[i].parent_left = this.getElementLeft(this.data.mouse_data[i].elm.parentElement);
      this.data.mouse_data[i].width = this.data.mouse_data[i].elm.clientWidth;
      this.data.mouse_data[i].parent_width = this.data.mouse_data[i].elm.parentElement.clientWidth;
      this.data.mouse_data[i].height = this.data.mouse_data[i].elm.clientHeight;
      this.data.mouse_data[i].parent_height = this.data.mouse_data[i].elm.parentElement.clientHeight;
    }
  }
};
