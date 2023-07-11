// import css
import "/src/Alpscroll.css";

import Lenis from "@studio-freight/lenis";

export const AlpData = {
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
};

export const Alpscroll = class Alpscroll {
  constructor() {
    this.data = {
      wrapper: "body",
      Wrapper_Parent_EL: window,
      Lenis_Wrapper_Parent: window,
      wheelEventsTarget: window,
      scroll_y: 0,
      scroll_x: 0,
      wrapper_height: 0,
      wrapper_width: 0,
      scroll_height: 0,
      scroll_width: 0,
      page_x: 0,
      page_y: 0,
      size_h: 0,
      size_w: 0,
      init: false,
    };
    this.lenis = "";
    this.raf = this.raf.bind(this);
    this.animationUpdate = this.animationUpdate.bind(this);
    this.updateAnim = "";
  }
  init(lerp, duration, infinite, smoothTouch, wrapper, wrapper_parent, wheelEventsTarget) {
    let Value = {
      lerp: lerp ? lerp : 0.1,
      duration: duration ? duration : 1.2,
      infinite: infinite ? infinite : false,
      smoothTouch: smoothTouch ? smoothTouch : false,
      wrapper: wrapper ? wrapper : "body",
      wrapper_parent: wrapper_parent ? wrapper_parent : window,
      wheelEventsTarget: wheelEventsTarget ? wheelEventsTarget : window,
    };
    this.data.wrapper = Value.wrapper;
    // define wrapper_parent
    this.data.Wrapper_Parent_EL = wrapper_parent;
    this.data.Lenis_Wrapper_Parent = wrapper_parent;
    if (wrapper_parent == window) {
      this.data.Wrapper_Parent_EL = document.querySelector("html");
    } else {
      this.data.Wrapper_Parent_EL = document.querySelector(wrapper_parent);
      this.data.Lenis_Wrapper_Parent = document.querySelector(wrapper_parent);
    }
    // define wheelEventsTarget
    if (wheelEventsTarget == window) {
      this.data.wheelEventsTarget = window;
    } else {
      this.data.wheelEventsTarget = document.querySelector(wheelEventsTarget);
    }
    this.lenis = new Lenis({
      wrapper: this.data.Lenis_Wrapper_Parent,
      content: document.querySelector(this.data.wrapper),
      // wheelEventsTarget: this.data.wheelEventsTarget,
      smoothWheel: true,
      smoothTouch: Value.smoothTouch,
      touchMultiplier: 3,
      lerp: Value.lerp,
      duration: Value.duration,
      infinite: Value.infinite,
    });
    this.GoInit();
    this.data.init = true;
    console.log("AlpScroll Inited With Lenis");
  }
  // Get Size
  getSize() {
    if (this.data.size_h != document.querySelector(this.data.wrapper).clientHeight || this.data.size_w != document.querySelector(this.data.wrapper).clientWidth) {
      this.data.wrapper_height = this.data.Wrapper_Parent_EL.clientHeight;
      this.data.wrapper_width = this.data.Wrapper_Parent_EL.clientWidth;
      this.data.scroll_height = document.querySelector(this.data.wrapper).clientHeight;
      this.data.scroll_width = document.querySelector(this.data.wrapper).clientWidth;
      //
      this.data.size_h = this.data.scroll_height;
      this.data.size_w = this.data.scroll_width;
      this.ResetData();
    }
  }
  RePushData() {
    this.parallax_push();
    this.sticky_push();
    this.sticky_child_push();
    this.reach_push();
    this.mouse_push();
  }
  ResetData() {
    this.parallax_data_update();
    this.sticky_data_update();
    this.sticky_child_data_update();
    this.reach_data_update();
    this.mouse_data_update();
    // console.log(this.data);
  }
  ClearData() {
    AlpData.parallax_data.length = 0;
    AlpData.sticky_data.length = 0;
    AlpData.sticky_child_data.length = 0;
    AlpData.reach_data.length = 0;
    AlpData.mouse_data.length = 0;
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
  GoInit() {
    // init immediately
    cancelAnimationFrame(this.updateAnim);
    this.RePushData();
    this.getMousePosition();
    requestAnimationFrame(this.raf);
    this.updateAnim = requestAnimationFrame(this.animationUpdate);
    document.querySelector(this.data.wrapper).classList.add("Alpscroll");
  }
  // 循环循环循环
  raf(time) {
    this.lenis.raf(time);
    this.getSize();
    if (this.data.Lenis_Wrapper_Parent == window) {
      this.data.scroll_y = this.data.Lenis_Wrapper_Parent.scrollY;
      this.data.scroll_x = this.data.Lenis_Wrapper_Parent.scrollX;
    } else {
      this.data.scroll_y = this.data.Wrapper_Parent_EL.scrollTop;
      this.data.scroll_x = this.data.Wrapper_Parent_EL.scrollLeft;
    }
    requestAnimationFrame(this.raf);
  }
  // 获取鼠标位置
  getMousePosition() {
    document.addEventListener("mousemove", (e) => {
      if (this.data.Lenis_Wrapper_Parent == window) {
        this.data.page_x = e.pageX - this.data.Lenis_Wrapper_Parent.scrollX;
        this.data.page_y = e.pageY - this.data.Lenis_Wrapper_Parent.scrollY;
      } else {
        this.data.page_x = e.pageX;
        this.data.page_y = e.pageY;
      }
    });
  }
  // 获取元素到顶部的距离
  getElementTop(element) {
    // console.log(element);
    if (element == null) {
      return 0;
    }
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop - this.data.Wrapper_Parent_EL.offsetTop;
  }
  // 获取元素到左边的距离
  getElementLeft(element) {
    // console.log(element);
    if (element == null) {
      return 0;
    }
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    return actualLeft - this.data.Wrapper_Parent_EL.offsetLeft;
  }
  // 数组数据去重
  uniqueData(array) {
    return Array.from(new Set(array.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));
  }
  // 视差
  // palallax
  parallax(elm, limit, friction_y, friction_x) {
    if (elm) {
      // push
      AlpData.parallax.push({
        elm: elm,
        limit: limit ? limit : 0,
        friction_y: friction_y ? friction_y : 0.1,
        friction_x: friction_x ? friction_x : 0.1,
      });
      AlpData.parallax = this.uniqueData(AlpData.parallax);
      this.parallax_push();
    }
  }
  parallax_push() {
    // reset and update
    AlpData.parallax_data.length = 0;
    for (let i = 0; i < AlpData.parallax.length; i++) {
      this.parallax_data(AlpData.parallax[i]);
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
      AlpData.parallax_data.push({
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
    // this.parallax_run();
  }
  parallax_run() {
    for (let i = 0; i < AlpData.parallax_data.length; i++) {
      // y
      let center_y_init = AlpData.parallax_data[i].top - this.data.wrapper_height / 2 + AlpData.parallax_data[i].height / 2 - this.data.scroll_y;
      AlpData.parallax_data[i].center_y = center_y_init;
      // x
      let center_x_init = AlpData.parallax_data[i].left - this.data.wrapper_width / 2 + AlpData.parallax_data[i].width / 2 - this.data.scroll_x;
      AlpData.parallax_data[i].center_x = center_x_init;
      // set value
      let center_y = 0;
      let center_x = 0;
      // 范围内生效
      let lenght_y_bottom = this.data.wrapper_height + AlpData.parallax_data[i].height * 1;
      let lenght_y_top = (this.data.wrapper_height + AlpData.parallax_data[i].height * 1) * -1;
      let lenght_x_right = this.data.wrapper_width + AlpData.parallax_data[i].width;
      let lenght_x_left = (this.data.wrapper_width + AlpData.parallax_data[i].width) * -1;

      // 无限制移动
      if (AlpData.parallax_data[i].limit == 0) {
        if (AlpData.parallax_data[i].center_y < lenght_y_bottom && AlpData.parallax_data[i].center_y > lenght_y_top) {
          center_y = AlpData.parallax_data[i].center_y;
        } else if (AlpData.parallax_data[i].center_y > lenght_y_bottom) {
          center_y = lenght_y_bottom;
        } else if (AlpData.parallax_data[i].center_y < lenght_y_top) {
          center_y = lenght_y_top;
        }

        if (AlpData.parallax_data[i].center_x < lenght_x_right && AlpData.parallax_data[i].center_x > lenght_x_left) {
          center_x = AlpData.parallax_data[i].center_x;
        } else if (AlpData.parallax_data[i].center_x > lenght_x_right) {
          center_x = lenght_x_right;
        } else if (AlpData.parallax_data[i].center_x < lenght_x_left) {
          center_x = lenght_x_left;
        }
      }
      //
      // 限制从底到中心
      else if (AlpData.parallax_data[i].limit == 1) {
        if (AlpData.parallax_data[i].center_y > 0 && AlpData.parallax_data[i].center_y < lenght_y_bottom) {
          center_y = AlpData.parallax_data[i].center_y;
        } else {
          center_y = 0;
        }
        if (AlpData.parallax_data[i].center_x > 0) {
          center_x = AlpData.parallax_data[i].center_x;
        } else {
          center_x = 0;
        }
      }
      // 限制从中心到顶
      else if (AlpData.parallax_data[i].limit == 2) {
        if (AlpData.parallax_data[i].center_y < 0 && AlpData.parallax_data[i].center_y > lenght_y_top) {
          center_y = AlpData.parallax_data[i].center_y;
        } else {
          center_y = 0;
        }
        if (AlpData.parallax_data[i].center_x < 0) {
          center_x = AlpData.parallax_data[i].center_x;
        } else {
          center_x = 0;
        }
      }
      // 缓动计算
      AlpData.parallax_data[i].center_y_friction =
        Math.round((AlpData.parallax_data[i].center_y_friction + (center_y - AlpData.parallax_data[i].center_y_friction) * AlpData.parallax_data[i].friction_y) * 100) / 100;
      AlpData.parallax_data[i].center_x_friction =
        Math.round((AlpData.parallax_data[i].center_x_friction + (center_x - AlpData.parallax_data[i].center_x_friction) * AlpData.parallax_data[i].friction_x) * 100) / 100;

      let progerss_y = 1 - center_y / (this.data.wrapper_height / 2);
      let progerss_x = 1 - center_x / (this.data.wrapper_width / 2);
      let progerss_yf = 1 - AlpData.parallax_data[i].center_y_friction / (this.data.wrapper_height / 2);
      let progerss_xf = 1 - AlpData.parallax_data[i].center_x_friction / (this.data.wrapper_width / 2);

      // 设置元素data值
      AlpData.parallax_data[i].elm.dataset.pl_y = center_y;
      AlpData.parallax_data[i].elm.dataset.pl_ym = AlpData.parallax_data[i].center_y_friction;
      AlpData.parallax_data[i].elm.dataset.pl_x = center_x;
      AlpData.parallax_data[i].elm.dataset.pl_xm = AlpData.parallax_data[i].center_x_friction;
      AlpData.parallax_data[i].elm.dataset.pl_pg_y = progerss_y;
      AlpData.parallax_data[i].elm.dataset.pl_pg_ym = progerss_yf;
      AlpData.parallax_data[i].elm.dataset.pl_pg_x = progerss_x;
      AlpData.parallax_data[i].elm.dataset.pl_pg_xm = progerss_xf;
    }
  }
  parallax_data_update() {
    for (let i = 0; i < AlpData.parallax_data.length; i++) {
      AlpData.parallax_data[i].top = this.getElementTop(AlpData.parallax_data[i].elm);
      AlpData.parallax_data[i].left = this.getElementLeft(AlpData.parallax_data[i].elm);
      AlpData.parallax_data[i].height = AlpData.parallax_data[i].elm.clientHeight;
      AlpData.parallax_data[i].width = AlpData.parallax_data[i].elm.clientWidth;
      //
      AlpData.parallax_data[i].elm.dataset.of_top = AlpData.parallax_data[i].top;
      AlpData.parallax_data[i].elm.dataset.of_left = AlpData.parallax_data[i].left;
    }
  }
  // 固定
  // Sticky
  sticky(elm, limit, friction_y, friction_x, parent_elm) {
    if (elm) {
      // push
      AlpData.sticky.push({
        elm: elm,
        limit: limit ? limit : 0,
        friction_y: friction_y ? friction_y : 1,
        friction_x: friction_x ? friction_x : 1,
        parent_elm: parent_elm ? parent_elm : null,
      });
      AlpData.sticky = this.uniqueData(AlpData.sticky);
      this.sticky_push();
    }
  }
  sticky_push() {
    // reset and update
    AlpData.sticky_data.length = 0;
    for (let i = 0; i < AlpData.sticky.length; i++) {
      this.sticky_data(AlpData.sticky[i]);
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

      AlpData.sticky_data.push({
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
    // this.sticky_run();
  }
  sticky_run() {
    for (let i = 0; i < AlpData.sticky_data.length; i++) {
      // no-limit
      if (AlpData.sticky_data[i].limit == 0) {
        // update data
        AlpData.sticky_data[i].progress = this.data.scroll_y / (this.data.scroll_height - this.data.wrapper_height);
        AlpData.sticky_data[i].stick_y = this.data.scroll_y;
      }
      // limit-in-container
      else if (AlpData.sticky_data[i].limit == 1) {
        let stick_top = AlpData.sticky_data[i].top - this.data.scroll_y;
        let stick_bottom = AlpData.sticky_data[i].parent_top + AlpData.sticky_data[i].parent_height - this.data.scroll_y;
        let stick_x_distence =
          (stick_top / (AlpData.sticky_data[i].parent_height - AlpData.sticky_data[i].height - (AlpData.sticky_data[i].top - AlpData.sticky_data[i].parent_top))) *
          (AlpData.sticky_data[i].width - AlpData.sticky_data[i].parent_width);
        if (stick_top <= 0 && stick_bottom >= AlpData.sticky_data[i].height) {
          AlpData.sticky_data[i].stick_y = stick_top;
          AlpData.sticky_data[i].stick_x = stick_x_distence;
          AlpData.sticky_data[i].progress =
            stick_top / (AlpData.sticky_data[i].height - AlpData.sticky_data[i].parent_height + (AlpData.sticky_data[i].top - AlpData.sticky_data[i].parent_top));
          AlpData.sticky_data[i].elm.dataset.stickin = "1";
          AlpData.sticky_data[i].elm.dataset.stickout = "0";
          AlpData.sticky_data[i].elm.dataset.fixedlength = "0";
          AlpData.sticky_data[i].elm.dataset.pre_progress = 1;
          AlpData.sticky_data[i].elm.dataset.after_progress = 0;
        } else if (stick_top > 0) {
          AlpData.sticky_data[i].stick_y = 0;
          AlpData.sticky_data[i].stick_x = 0;
          AlpData.sticky_data[i].progress = 0;
          AlpData.sticky_data[i].elm.dataset.stickin = "0";
          AlpData.sticky_data[i].elm.dataset.stickout = "0";
          AlpData.sticky_data[i].elm.dataset.fixedlength = "0";
          AlpData.sticky_data[i].elm.dataset.pre_progress = (this.data.scroll_y + this.data.wrapper_height - AlpData.sticky_data[i].top) / this.data.wrapper_height;
        } else {
          AlpData.sticky_data[i].stick_y = AlpData.sticky_data[i].height - AlpData.sticky_data[i].parent_height + (AlpData.sticky_data[i].top - AlpData.sticky_data[i].parent_top);
          AlpData.sticky_data[i].stick_x = AlpData.sticky_data[i].parent_width - AlpData.sticky_data[i].width;
          AlpData.sticky_data[i].progress = 1;
          AlpData.sticky_data[i].elm.dataset.stickout = "1";
          AlpData.sticky_data[i].elm.dataset.stickin = "0";
          AlpData.sticky_data[i].elm.dataset.fixedlength = AlpData.sticky_data[i].stick_y;
          AlpData.sticky_data[i].elm.dataset.after_progress =
            (this.data.scroll_y - AlpData.sticky_data[i].top - AlpData.sticky_data[i].parent_height + AlpData.sticky_data[i].height) / this.data.wrapper_height;
        }
      }
      // friction data
      AlpData.sticky_data[i].stick_y_friction =
        Math.round(
          (AlpData.sticky_data[i].stick_y_friction + (AlpData.sticky_data[i].stick_y - AlpData.sticky_data[i].stick_y_friction) * AlpData.sticky_data[i].friction_y) * 100
        ) / 100;
      AlpData.sticky_data[i].stick_x_friction =
        Math.round(
          (AlpData.sticky_data[i].stick_x_friction + (AlpData.sticky_data[i].stick_x - AlpData.sticky_data[i].stick_x_friction) * AlpData.sticky_data[i].friction_x) * 100
        ) / 100;
      AlpData.sticky_data[i].progress_friction =
        Math.round(
          (AlpData.sticky_data[i].progress_friction + (AlpData.sticky_data[i].progress - AlpData.sticky_data[i].progress_friction) * AlpData.sticky_data[i].friction_x) * 1000000
        ) / 1000000;

      // set data
      AlpData.sticky_data[i].elm.dataset.st_y = AlpData.sticky_data[i].stick_y;
      AlpData.sticky_data[i].elm.dataset.st_ym = AlpData.sticky_data[i].stick_y_friction;
      AlpData.sticky_data[i].elm.dataset.st_x = AlpData.sticky_data[i].stick_x;
      AlpData.sticky_data[i].elm.dataset.st_xm = AlpData.sticky_data[i].stick_x_friction;
      AlpData.sticky_data[i].elm.dataset.st_pg = AlpData.sticky_data[i].progress;
      AlpData.sticky_data[i].elm.dataset.st_pgm = AlpData.sticky_data[i].progress_friction;
    }
  }
  sticky_data_update() {
    for (let i = 0; i < AlpData.sticky_data.length; i++) {
      // let style = window.getComputedStyle(AlpData.sticky_data[i].elm);
      // let position = style.getPropertyValue("position");
      let sticky_class = AlpData.sticky_data[i].elm.classList.contains("sticky");
      if (sticky_class) {
        AlpData.sticky_data[i].top = this.getElementTop(AlpData.sticky_data[i].elm.parentElement);
        AlpData.sticky_data[i].left = this.getElementLeft(AlpData.sticky_data[i].elm.parentElement);
      } else {
        AlpData.sticky_data[i].top = this.getElementTop(AlpData.sticky_data[i].elm);
        AlpData.sticky_data[i].left = this.getElementLeft(AlpData.sticky_data[i].elm);
      }
      AlpData.sticky_data[i].parent_top = this.getElementTop(AlpData.sticky_data[i].elm.parentElement);
      AlpData.sticky_data[i].parent_left = this.getElementLeft(AlpData.sticky_data[i].elm.parentElement);
      AlpData.sticky_data[i].width = AlpData.sticky_data[i].elm.clientWidth;
      AlpData.sticky_data[i].parent_width = AlpData.sticky_data[i].elm.parentElement.clientWidth;
      AlpData.sticky_data[i].height = AlpData.sticky_data[i].elm.clientHeight;
      AlpData.sticky_data[i].parent_height = AlpData.sticky_data[i].elm.parentElement.clientHeight;
      AlpData.sticky_data[i].elm.dataset.of_top = AlpData.sticky_data[i].top;
      AlpData.sticky_data[i].elm.dataset.of_left = AlpData.sticky_data[i].left;
      if (AlpData.sticky_data[i].parent_elm) {
        AlpData.sticky_data[i].parent_top = this.getElementTop(AlpData.sticky_data[i].elm.closest(AlpData.sticky_data[i].parent_elm));
        AlpData.sticky_data[i].parent_left = this.getElementLeft(AlpData.sticky_data[i].elm.closest(AlpData.sticky_data[i].parent_elm));
        AlpData.sticky_data[i].parent_width = AlpData.sticky_data[i].elm.closest(AlpData.sticky_data[i].parent_elm).clientWidth;
        AlpData.sticky_data[i].parent_height = AlpData.sticky_data[i].elm.closest(AlpData.sticky_data[i].parent_elm).clientHeight;
      }
    }
  }
  // Sticky Child
  sticky_child(elm, limit) {
    if (elm) {
      // push
      AlpData.sticky_child.push({
        elm: elm,
        limit: limit ? limit : 0,
      });
      AlpData.sticky_child = this.uniqueData(AlpData.sticky_child);
      this.sticky_child_push();
    }
  }
  sticky_child_push() {
    // reset and update
    AlpData.sticky_child_data.length = 0;
    for (let i = 0; i < AlpData.sticky_child.length; i++) {
      this.sticky_child_data(AlpData.sticky_child[i]);
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

      AlpData.sticky_child_data.push({
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
    // this.sticky_child_run();
  }
  sticky_child_run() {
    for (let i = 0; i < AlpData.sticky_child_data.length; i++) {
      let center_y_init = AlpData.sticky_child_data[i].top - this.data.wrapper_height / 2 + AlpData.sticky_child_data[i].height / 2 - this.data.scroll_y;
      let center_x_init = AlpData.sticky_child_data[i].left - this.data.wrapper_width / 2 + AlpData.sticky_child_data[i].width / 2 - this.data.scroll_x;
      AlpData.sticky_child_data[i].center_x = center_x_init;
      AlpData.sticky_child_data[i].center_y = center_y_init;
      // set data
      AlpData.sticky_child_data[i].elm.dataset.stc_x = center_x_init;
      AlpData.sticky_child_data[i].elm.dataset.stc_y = center_y_init;
    }
  }
  sticky_child_data_update() {
    for (let i = 0; i < AlpData.sticky_child_data.length; i++) {
      AlpData.sticky_child_data[i].top = this.getElementTop(AlpData.sticky_child_data[i].elm);
      AlpData.sticky_child_data[i].parent_top = this.getElementTop(AlpData.sticky_child_data[i].elm.parentElement);
      AlpData.sticky_child_data[i].left = this.getElementLeft(AlpData.sticky_child_data[i].elm);
      AlpData.sticky_child_data[i].parent_left = this.getElementLeft(AlpData.sticky_child_data[i].elm.parentElement);
      AlpData.sticky_child_data[i].height = AlpData.sticky_child_data[i].elm.clientHeight;
      AlpData.sticky_child_data[i].width = AlpData.sticky_child_data[i].elm.clientWidth;
      //
      AlpData.sticky_child_data[i].elm.dataset.of_top = AlpData.sticky_child_data[i].top;
      AlpData.sticky_child_data[i].elm.dataset.of_parent_top = AlpData.sticky_child_data[i].parent_top;
      AlpData.sticky_child_data[i].elm.dataset.of_left = AlpData.sticky_child_data[i].left;
      AlpData.sticky_child_data[i].elm.dataset.of_parent_left = AlpData.sticky_child_data[i].parent_left;
    }
  }

  // reach element
  reach(elm, offset_y, offset_x) {
    if (elm) {
      // push
      AlpData.reach.push({
        elm: elm,
        offset_y: offset_y ? offset_y : 0,
        offset_x: offset_x ? offset_x : 0,
      });
      AlpData.reach = this.uniqueData(AlpData.reach);
      this.reach_push();
    }
  }
  reach_push() {
    // reset and update
    AlpData.reach_data.length = 0;
    for (let i = 0; i < AlpData.reach.length; i++) {
      this.reach_data(AlpData.reach[i]);
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
      AlpData.reach_data.push({
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
    // this.reach_run();
  }
  reach_run() {
    for (let i = 0; i < AlpData.reach_data.length; i++) {
      // y
      let center_y_init = AlpData.reach_data[i].top - this.data.wrapper_height / 2 - this.data.scroll_y;
      AlpData.reach_data[i].center_y = center_y_init;
      // x
      let center_x_init = AlpData.reach_data[i].left - this.data.wrapper_width / 2 - this.data.scroll_x;
      AlpData.reach_data[i].center_x = center_x_init;

      let reach_y = center_y_init - AlpData.reach_data[i].offset_y * (this.data.wrapper_height / 2);
      let reach_x = center_x_init - AlpData.reach_data[i].offset_x * (this.data.wrapper_width / 2);

      if (reach_y < 0) {
        AlpData.reach_data[i].elm.dataset.active_y = 1;
      } else {
        AlpData.reach_data[i].elm.dataset.active_y = 0;
      }
      if (reach_x < 0) {
        AlpData.reach_data[i].elm.dataset.active_x = 1;
      } else {
        AlpData.reach_data[i].elm.dataset.active_x = 0;
      }
    }
  }
  reach_data_update() {
    for (let i = 0; i < AlpData.reach_data.length; i++) {
      AlpData.reach_data[i].top = this.getElementTop(AlpData.reach_data[i].elm);
      AlpData.reach_data[i].left = this.getElementLeft(AlpData.reach_data[i].elm);
      AlpData.reach_data[i].height = AlpData.reach_data[i].elm.clientHeight;
      AlpData.reach_data[i].width = AlpData.reach_data[i].elm.clientWidth;
      //
      AlpData.reach_data[i].elm.dataset.of_top = AlpData.reach_data[i].top;
      AlpData.reach_data[i].elm.dataset.of_left = AlpData.reach_data[i].left;
    }
  }

  // mouse
  mouse(elm, limit, friction_y, friction_x, outside) {
    if (elm) {
      // push
      AlpData.mouse.push({
        elm: elm,
        limit: limit ? limit : 0,
        friction_y: friction_y ? friction_y : 0.1,
        friction_x: friction_x ? friction_x : 0.1,
        outside: outside ? outside : 0,
      });
      AlpData.mouse = this.uniqueData(AlpData.mouse);
      this.mouse_push();
    }
  }
  mouse_push() {
    // reset and update
    AlpData.mouse_data.length = 0;
    for (let i = 0; i < AlpData.mouse.length; i++) {
      this.mouse_data(AlpData.mouse[i]);
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

      AlpData.mouse_data.push({
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
    // this.mouse_run();
  }
  mouse_run() {
    for (let i = 0; i < AlpData.mouse_data.length; i++) {
      let center_x = this.data.page_x - (AlpData.mouse_data[i].left + AlpData.mouse_data[i].width / 2);
      let center_y = this.data.page_y - (AlpData.mouse_data[i].top + AlpData.mouse_data[i].height / 2);
      if (AlpData.mouse_data[i].outside == 0) {
        center_x = center_x + this.data.scroll_x;
        center_y = center_y + this.data.scroll_y;
      }
      // limit = 0
      if (AlpData.mouse_data[i].limit == 0) {
        AlpData.mouse_data[i].mouse_x = center_x;
        AlpData.mouse_data[i].mouse_y = center_y;
      }
      // limit = 1
      else if (AlpData.mouse_data[i].limit == 1) {
        if (Math.abs(center_x) < AlpData.mouse_data[i].parent_width / 2 && Math.abs(center_y) < AlpData.mouse_data[i].parent_height / 2) {
          AlpData.mouse_data[i].mouse_x = center_x;
          AlpData.mouse_data[i].mouse_y = center_y;
        } else {
          AlpData.mouse_data[i].mouse_x = 0;
          AlpData.mouse_data[i].mouse_y = 0;
        }
      }
      // limit = "num"
      else if (parseFloat(AlpData.mouse_data[i].limit) !== NaN) {
        let limit = parseFloat(AlpData.mouse_data[i].limit);
        if (Math.abs(center_x) < limit && Math.abs(center_y) < limit) {
          AlpData.mouse_data[i].mouse_x = center_x;
          AlpData.mouse_data[i].mouse_y = center_y;
        } else {
          AlpData.mouse_data[i].mouse_x = 0;
          AlpData.mouse_data[i].mouse_y = 0;
        }
      }
      // updata friction data
      AlpData.mouse_data[i].mouse_x_friction =
        Math.round((AlpData.mouse_data[i].mouse_x_friction + (AlpData.mouse_data[i].mouse_x - AlpData.mouse_data[i].mouse_x_friction) * AlpData.mouse_data[i].friction_x) * 100) /
        100;
      AlpData.mouse_data[i].mouse_y_friction =
        Math.round((AlpData.mouse_data[i].mouse_y_friction + (AlpData.mouse_data[i].mouse_y - AlpData.mouse_data[i].mouse_y_friction) * AlpData.mouse_data[i].friction_y) * 100) /
        100;

      AlpData.mouse_data[i].elm.dataset.mxx = Math.round(AlpData.mouse_data[i].mouse_x_friction * 100) / 100;
      AlpData.mouse_data[i].elm.dataset.myy = Math.round(AlpData.mouse_data[i].mouse_y_friction * 100) / 100;
    }
  }
  mouse_data_update() {
    for (let i = 0; i < AlpData.mouse_data.length; i++) {
      AlpData.mouse_data[i].top = this.getElementTop(AlpData.mouse_data[i].elm);
      AlpData.mouse_data[i].parent_top = this.getElementTop(AlpData.mouse_data[i].elm.parentElement);
      AlpData.mouse_data[i].left = this.getElementLeft(AlpData.mouse_data[i].elm);
      AlpData.mouse_data[i].parent_left = this.getElementLeft(AlpData.mouse_data[i].elm.parentElement);
      AlpData.mouse_data[i].width = AlpData.mouse_data[i].elm.clientWidth;
      AlpData.mouse_data[i].parent_width = AlpData.mouse_data[i].elm.parentElement.clientWidth;
      AlpData.mouse_data[i].height = AlpData.mouse_data[i].elm.clientHeight;
      AlpData.mouse_data[i].parent_height = AlpData.mouse_data[i].elm.parentElement.clientHeight;
    }
  }
};
