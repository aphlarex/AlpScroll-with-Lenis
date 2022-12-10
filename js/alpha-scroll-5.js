"use strict";

// 获取元素到根元素的 offsetLeft / offsetTop
function getElementTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}

function getElementLeft(element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

// start
var als = {
  init: false,
  wrapper: "body",
  fixed: 0,
  fixed_scroll: 0,
  ratio: 0.1,
  scroll_y: 0,
  scroll_x: 0,
  wrapper_width: 0,
  wrapper_height: 0,
  scroll_height: 0,
  scroll_width: 0,
  parallax: [],
  parallax_data: [],
  sticky: [],
  sticky_data: [],
  sticky_child: [],
  sticky_child_data: [],
  reach: [],
  reach_data: [],
  page_x: 0,
  page_y: 0,
  mouse: [],
  mouse_data: [],
  split: 0,
  split_data: [],
  split_data_detail: [],
  split_height: 0,
  mobile: 1,
  scrolling: false,
};

// use smooth-scrollbar.js
var als_Scrollbar = window.Scrollbar;
function init_scroll(elm, ratio, fixed, eventTarget, mobile) {
  als.mobile = mobile ? mobile : als.mobile;
  document.querySelector("body").style.setProperty("overflow", "hidden");
  // if is smooth-scrollbar.js
  if (als_Scrollbar) {
    als.ratio = ratio ? ratio : als.ratio;
    als.wrapper = elm ? elm : als.wrapper;
    document.querySelector(als.wrapper).classList.add("scrollbar-active");
    document.querySelector(als.wrapper).style.setProperty("height", `${window.innerHeight}px`);
    window.addEventListener("resize", function () {
      document.querySelector(als.wrapper).style.setProperty("height", `${window.innerHeight}px`);
    });
    let eventTg = document.querySelector(eventTarget ? eventTarget : null);
    let element = document.querySelector(als.wrapper);
    als_Scrollbar.init(element, {
      damping: ratio,
      renderByPixels: false,
      delegateTo: eventTg,
    });
    als.init = true;
    window.addEventListener("load", () => {
      requestAnimationFrame(animate_scroll);
    });
  }
  // use native fixed scroll
  else if (fixed == 1) {
    als.ratio = ratio ? ratio : als.ratio;
    als.wrapper = elm ? elm : als.wrapper;
    document.querySelector(als.wrapper).style.setProperty("height", "auto");
    document.querySelector(als.wrapper).style.setProperty("position", "fixed");
    document.querySelector(als.wrapper).style.setProperty("left", "0px");
    document.querySelector(als.wrapper).style.setProperty("right", "0px");
    document.querySelector(als.wrapper).style.setProperty("top", "0px");
    als.init = true;
    als.fixed = 1;
    window.addEventListener("load", () => {
      requestAnimationFrame(animate_scroll);
    });
  }
  // use native scroll
  else {
    als.ratio = ratio ? ratio : als.ratio;
    als.wrapper = elm ? elm : als.wrapper;
    document.querySelector(als.wrapper).style.setProperty("height", "auto");
    als.init = true;
    window.addEventListener("load", () => {
      requestAnimationFrame(animate_scroll);
    });
  }
}

function Als_get_size() {
  if (als_Scrollbar) {
    als.wrapper_height = als_Scrollbar.get(document.querySelector(als.wrapper)).size.container.height;
    als.scroll_width = als_Scrollbar.get(document.querySelector(als.wrapper)).size.content.width;
    if (als.split == 1) {
      als.wrapper_width = document.querySelector(".split-elm").parentElement.clientWidth;
      document.querySelector(`${als.wrapper} > div.scroll-content > div`).style.setProperty("height", `${als.split_height}px`);
      als.scroll_height = als.split_height;
    } else {
      als.scroll_height = als_Scrollbar.get(document.querySelector(als.wrapper)).size.content.height;
      als.wrapper_width = als_Scrollbar.get(document.querySelector(als.wrapper)).size.container.width;
    }
    document.querySelector("body").style.setProperty("height", `${als.scroll_height}px`);
  } else {
    als.wrapper_width = window.innerWidth;
    als.wrapper_height = window.innerHeight;
    als.scroll_height = document.querySelector(als.wrapper).clientHeight;
    als.scroll_width = document.querySelector(als.wrapper).clientWidth;
    if (als.fixed == 1) {
      if (als.split == 1) {
        als.scroll_height = als.split_height;
      }
      document.querySelector("body").style.setProperty("height", `${als.scroll_height}px`);
    } else {
      if (als.split == 1) {
        als.scroll_height = als.split_height;
        document.querySelector("body").style.setProperty("height", `${als.scroll_height}px`);
      }
    }
  }
}

function get_scroll() {
  Als_get_size();
  if (als_Scrollbar) {
    als.scroll_y = als_Scrollbar.get(document.querySelector(als.wrapper)).offset.y;
    als.scroll_x = als_Scrollbar.get(document.querySelector(als.wrapper)).offset.x;
    window.scrollTo(0, als.scroll_y);
  } else {
    if (als.fixed == 1) {
      als.scroll_y = Math.round((als.scroll_y + ((document.documentElement.scrollTop || document.body.scrollTop) - als.scroll_y) * als.ratio) * 100) / 100;
      fixed_scroll();
    } else {
      als.scroll_y = document.documentElement.scrollTop || document.body.scrollTop;
    }
  }
}

function fixed_scroll() {
  als.fixed_scroll = als.scroll_y;
  document.querySelector(als.wrapper).style.setProperty("--scroll-yy", als.fixed_scroll);
}

// split elm
function Als_split(elm, set_var, leng_h) {
  if (elm) {
    als.split = 1;
    //push
    als.split_data.push({
      elm: elm,
      set_var: set_var ? set_var : 0,
      leng_h: leng_h ? leng_h : 0,
    });
    Als_split_push();
  }
}

function Als_split_push() {
  als.split_data_detail.length = 0;
  for (let i = 0; i < als.split_data.length; i++) {
    Als_split_data(als.split_data[i]);
  }
}

function Als_split_data(elms) {
  let the_elms = document.querySelectorAll(elms.elm);
  als.split_height = 0;
  for (let i = 0; i < the_elms.length; i++) {
    // the_elms[i].classList.remove("split_elm");
    let offset_top = getElementTop(the_elms[i]);
    // update the real offset top
    let offset_left = getElementLeft(the_elms[i]);
    // update the real offset left
    the_elms[i].dataset.split_top = offset_top;
    the_elms[i].dataset.split_left = offset_left;

    let the_elms_height = the_elms[i].clientHeight;
    let the_elms_width = the_elms[i].clientWidth;

    als.split_height = the_elms[i].parentElement.clientHeight;
    als.split_data_detail.push({
      elm: the_elms[i],
      top: offset_top,
      left: offset_left,
      height: the_elms_height,
      width: the_elms_width,
      set_var: elms.set_var,
      leng_h: elms.leng_h,
    });
    the_elms[i].classList.add("split-elm");
  }
}

function Als_split_run() {
  for (let i = 0; i < als.split_data_detail.length; i++) {
    // als.split_data_detail[i].top = getElementTop(als.split_data_detail[i].elm);
    // als.split_data_detail[i].elm.dataset.split_top = als.split_data_detail[i].top;

    let leng_hh = als.split_data_detail[i].leng_h;
    let top_leng = als.scroll_y - als.split_data_detail[i].top + (leng_hh + als.wrapper_height);
    let bottom_leng = als.scroll_y - (als.split_data_detail[i].top + als.split_data_detail[i].height) - leng_hh;
    let trans_leng = 0;
    if (top_leng >= 0 && bottom_leng <= 0) {
      trans_leng = als.split_data_detail[i].top - als.scroll_y - als.split_data_detail[i].top;
      als.split_data_detail[i].elm.style.setProperty("pointer-events", "auto");
      als.split_data_detail[i].elm.style.setProperty("z-index", "2");
      if (als.split_data_detail[i].set_var == 1) {
        als.split_data_detail[i].elm.style.setProperty("--scroll-spl-y", trans_leng);
      } else {
        als.split_data_detail[i].elm.dataset.spl_yy = trans_leng;
      }
    } else if (top_leng < 0) {
      trans_leng = leng_hh + als.wrapper_height - als.split_data_detail[i].top;
      als.split_data_detail[i].elm.style.setProperty("pointer-events", "none");
      als.split_data_detail[i].elm.style.setProperty("z-index", "1");
      if (als.split_data_detail[i].set_var == 1) {
        als.split_data_detail[i].elm.style.setProperty("--scroll-spl-y", trans_leng);
      } else {
        als.split_data_detail[i].elm.dataset.spl_yy = trans_leng;
      }
    }
  }
}

// parallax
function Als_parallax(elm, limit, friction_y, friction_x, set_var) {
  if (elm) {
    // push
    als.parallax.push({
      elm: elm,
      limit: limit ? limit : 0,
      friction_y: friction_y ? friction_y : 1,
      friction_x: friction_x ? friction_x : 1,
      set_var: set_var ? set_var : 0,
    });
    Als_parallax_push();
  }
}
function Als_parallax_push() {
  // reset and update
  als.parallax_data.length = 0;
  for (let i = 0; i < als.parallax.length; i++) {
    Als_parallax_data(als.parallax[i]);
  }
}
function Als_parallax_data(elms) {
  // push all elm data
  let the_elms = document.querySelectorAll(elms.elm);
  for (let i = 0; i < the_elms.length; i++) {
    let offset_top = getElementTop(the_elms[i]);
    let offset_left = getElementLeft(the_elms[i]);
    the_elms[i].dataset.of_top = offset_top;
    the_elms[i].dataset.of_left = offset_left;
    let the_elms_height = the_elms[i].clientHeight;
    let the_elms_width = the_elms[i].clientWidth;
    als.parallax_data.push({
      elm: the_elms[i],
      limit: elms.limit,
      friction_y: elms.friction_y,
      friction_x: elms.friction_x,
      set_var: elms.set_var,
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
}
function Als_parallax_run() {
  for (let i = 0; i < als.parallax_data.length; i++) {
    // y
    let center_y_init = als.parallax_data[i].top - als.wrapper_height / 2 + als.parallax_data[i].height / 2 - als.scroll_y;
    als.parallax_data[i].center_y = center_y_init;

    // x
    let center_x_init = als.parallax_data[i].left - als.wrapper_width / 2 + als.parallax_data[i].width / 2 - als.scroll_x;
    als.parallax_data[i].center_x = center_x_init;

    // set value
    let center_y = 0;
    let center_x = 0;

    // no-limit

    let lenght_y_bottom = als.wrapper_height + als.parallax_data[i].height * 1;
    let lenght_y_top = (als.wrapper_height + als.parallax_data[i].height * 1) * -1;

    let lenght_x_right = als.wrapper_width + als.parallax_data[i].width;
    let lenght_x_left = (als.wrapper_width + als.parallax_data[i].width) * -1;

    if (als.parallax_data[i].limit == 0) {
      if (als.parallax_data[i].center_y < lenght_y_bottom && als.parallax_data[i].center_y > lenght_y_top) {
        center_y = als.parallax_data[i].center_y;
      } else if (als.parallax_data[i].center_y > lenght_y_bottom) {
        center_y = lenght_y_bottom;
      } else if (als.parallax_data[i].center_y < lenght_y_top) {
        center_y = lenght_y_top;
      }

      if (als.parallax_data[i].center_x < lenght_x_right && als.parallax_data[i].center_x > lenght_x_left) {
        center_x = als.parallax_data[i].center_x;
      } else if (als.parallax_data[i].center_x > lenght_x_right) {
        center_x = lenght_x_right;
      } else if (als.parallax_data[i].center_x < lenght_x_left) {
        center_x = lenght_x_left;
      }
    }
    // stop-at-center
    else if (als.parallax_data[i].limit == 1) {
      if (als.parallax_data[i].center_y > 0 && als.parallax_data[i].center_y < lenght_y_bottom) {
        center_y = als.parallax_data[i].center_y;
      } else {
        center_y = 0;
      }
      if (als.parallax_data[i].center_x > 0) {
        center_x = als.parallax_data[i].center_x;
      } else {
        center_x = 0;
      }
    } else if (als.parallax_data[i].limit == 2) {
      if (als.parallax_data[i].center_y < 0 && als.parallax_data[i].center_y > lenght_y_top) {
        center_y = als.parallax_data[i].center_y;
      } else {
        center_y = 0;
      }
      if (als.parallax_data[i].center_x < 0) {
        center_x = als.parallax_data[i].center_x;
      } else {
        center_x = 0;
      }
    }
    // friction data
    als.parallax_data[i].center_y_friction = Math.round((als.parallax_data[i].center_y_friction + (center_y - als.parallax_data[i].center_y_friction) * als.parallax_data[i].friction_y) * 100) / 100;
    als.parallax_data[i].center_x_friction = Math.round((als.parallax_data[i].center_x_friction + (center_x - als.parallax_data[i].center_x_friction) * als.parallax_data[i].friction_x) * 100) / 100;

    let progerss_y = 1 - center_y / (als.wrapper_height / 2);
    let progerss_x = 1 - center_x / (als.wrapper_width / 2);
    let progerss_yf = 1 - als.parallax_data[i].center_y_friction / (als.wrapper_height / 2);
    let progerss_xf = 1 - als.parallax_data[i].center_x_friction / (als.wrapper_width / 2);

    if (als.parallax_data[i].set_var == 1) {
      // set style
      als.parallax_data[i].elm.style.setProperty("--center-y", center_y);
      als.parallax_data[i].elm.style.setProperty("--center-y-friction", als.parallax_data[i].center_y_friction);
      als.parallax_data[i].elm.style.setProperty("--center-x", center_x);
      als.parallax_data[i].elm.style.setProperty("--center-x-friction", als.parallax_data[i].center_x_friction);
    } else {
      // set data
      als.parallax_data[i].elm.dataset.yy = center_y;
      als.parallax_data[i].elm.dataset.fy = als.parallax_data[i].center_y_friction;
      als.parallax_data[i].elm.dataset.xx = center_x;
      als.parallax_data[i].elm.dataset.fx = als.parallax_data[i].center_x_friction;
      als.parallax_data[i].elm.dataset.pg_y = progerss_y;
      als.parallax_data[i].elm.dataset.pg_yf = progerss_yf;
      als.parallax_data[i].elm.dataset.pg_x = progerss_x;
      als.parallax_data[i].elm.dataset.pg_xf = progerss_xf;
    }
  }
}

// sticky
function Als_sticky(elm, limit, friction_y, friction_x, set_var, set_fixed) {
  if (elm) {
    // push
    als.sticky.push({
      elm: elm,
      limit: limit ? limit : 0,
      friction_y: friction_y ? friction_y : 1,
      friction_x: friction_x ? friction_x : 1,
      set_var: set_var ? set_var : 0,
      set_fixed: set_fixed ? set_fixed : 0,
    });
    Als_sticky_push();
  }
}
function Als_sticky_push() {
  // reset and update
  als.sticky_data.length = 0;
  for (let i = 0; i < als.sticky.length; i++) {
    Als_sticky_data(als.sticky[i]);
  }
}
function Als_sticky_data(elms) {
  // push all elm data
  let the_elms = document.querySelectorAll(elms.elm);
  for (let i = 0; i < the_elms.length; i++) {
    the_elms[i].classList.add("sticky-elm");
    let the_elms_height = the_elms[i].clientHeight;
    let the_elms_width = the_elms[i].clientWidth;
    let parent_height = the_elms[i].parentElement.clientHeight;
    let parent_width = the_elms[i].parentElement.clientWidth;
    // set parent height
    if (the_elms_width > parent_width) {
      // parent_height = the_elms_width;
      the_elms[i].parentElement.style.setProperty("height", `${the_elms_width}px`);
    }
    parent_height = the_elms[i].parentElement.clientHeight;

    let offset_top = getElementTop(the_elms[i]);
    let parent_offset_top = getElementTop(the_elms[i].parentElement);
    let offset_left = getElementLeft(the_elms[i]);
    let parent_offset_left = getElementLeft(the_elms[i].parentElement);

    the_elms[i].dataset.of_top = offset_top;
    the_elms[i].dataset.of_left = offset_left;

    if (als_Scrollbar) {
      elms.set_fixed = 0;
    }

    als.sticky_data.push({
      elm: the_elms[i],
      limit: elms.limit,
      friction_y: elms.friction_y,
      friction_x: elms.friction_x,
      set_var: elms.set_var,
      set_fixed: elms.set_fixed,
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
    });
  }
}

function Als_sticky_run() {
  for (let i = 0; i < als.sticky_data.length; i++) {
    if (als.sticky_data[i].set_fixed == 1) {
      als.sticky_data[i].elm.classList.add("sticky-fixed");
    } else {
      als.sticky_data[i].elm.classList.remove("sticky-fixed");
    }
    // no-limit
    if (als.sticky_data[i].limit == 0) {
      // update data
      als.sticky_data[i].progress = als.scroll_y / (als.scroll_height - als.wrapper_height);
      als.sticky_data[i].stick_y = als.scroll_y;
    }
    // limit-in-container
    else if (als.sticky_data[i].limit == 1) {
      let stick_top = als.sticky_data[i].top - als.scroll_y;
      let stick_bottom = als.sticky_data[i].parent_top + als.sticky_data[i].parent_height - als.scroll_y;
      let stick_x_distence = (stick_top / (als.sticky_data[i].parent_height - als.sticky_data[i].height - (als.sticky_data[i].top - als.sticky_data[i].parent_top))) * (als.sticky_data[i].width - als.sticky_data[i].parent_width);
      if (stick_top <= 0 && stick_bottom >= als.sticky_data[i].height) {
        als.sticky_data[i].stick_y = stick_top;
        als.sticky_data[i].stick_x = stick_x_distence;
        als.sticky_data[i].progress = stick_top / (als.sticky_data[i].height - als.sticky_data[i].parent_height + (als.sticky_data[i].top - als.sticky_data[i].parent_top));
        if (als.sticky_data[i].set_fixed == 1) {
          als.sticky_data[i].elm.style.setProperty("transform", `translate(0px, 0px)`);
          als.sticky_data[i].elm.style.setProperty("position", `fixed`);
        }
        als.sticky_data[i].elm.classList.add("sticky-in");
        als.sticky_data[i].elm.classList.remove("sticky-out");
      } else if (stick_top > 0) {
        als.sticky_data[i].stick_y = 0;
        als.sticky_data[i].stick_x = 0;
        als.sticky_data[i].progress = 0;
        if (als.sticky_data[i].set_fixed == 1) {
          als.sticky_data[i].elm.style.setProperty("transform", `translate(0px, 0px)`);
          als.sticky_data[i].elm.style.setProperty("position", `relative`);
        }
        als.sticky_data[i].elm.classList.remove("sticky-in");
        als.sticky_data[i].elm.classList.remove("sticky-out");
      } else {
        als.sticky_data[i].stick_y = als.sticky_data[i].height - als.sticky_data[i].parent_height + (als.sticky_data[i].top - als.sticky_data[i].parent_top);
        als.sticky_data[i].stick_x = als.sticky_data[i].parent_width - als.sticky_data[i].width;
        als.sticky_data[i].progress = 1;
        if (als.sticky_data[i].set_fixed == 1) {
          als.sticky_data[i].elm.style.setProperty("transform", `translate(0px, ${0 - als.sticky_data[i].stick_y}px)`);
          als.sticky_data[i].elm.style.setProperty("position", `relative`);
        }
        als.sticky_data[i].elm.classList.add("sticky-out");
        als.sticky_data[i].elm.classList.remove("sticky-in");
      }
    }
    // friction data
    als.sticky_data[i].stick_y_friction = Math.round((als.sticky_data[i].stick_y_friction + (als.sticky_data[i].stick_y - als.sticky_data[i].stick_y_friction) * als.sticky_data[i].friction_y) * 100) / 100;
    als.sticky_data[i].stick_x_friction = Math.round((als.sticky_data[i].stick_x_friction + (als.sticky_data[i].stick_x - als.sticky_data[i].stick_x_friction) * als.sticky_data[i].friction_x) * 100) / 100;
    als.sticky_data[i].progress_friction = Math.round((als.sticky_data[i].progress_friction + (als.sticky_data[i].progress - als.sticky_data[i].progress_friction) * als.sticky_data[i].friction_x) * 1000000) / 1000000;

    if (als.sticky_data[i].set_var == 1) {
      // set style
      als.sticky_data[i].elm.style.setProperty("--progress", als.sticky_data[i].progress);
      als.sticky_data[i].elm.style.setProperty("--stick-y", als.sticky_data[i].stick_y);
      als.sticky_data[i].elm.style.setProperty("--stick-y-friction", als.sticky_data[i].stick_y_friction);
      als.sticky_data[i].elm.style.setProperty("--stick-x", als.sticky_data[i].stick_x);
      als.sticky_data[i].elm.style.setProperty("--stick-x-friction", als.sticky_data[i].stick_x_friction);
    } else {
      // set data
      als.sticky_data[i].elm.dataset.yy = als.sticky_data[i].stick_y;
      als.sticky_data[i].elm.dataset.fy = als.sticky_data[i].stick_y_friction;
      als.sticky_data[i].elm.dataset.xx = als.sticky_data[i].stick_x;
      als.sticky_data[i].elm.dataset.fx = als.sticky_data[i].stick_x_friction;
      als.sticky_data[i].elm.dataset.progress = als.sticky_data[i].progress;
      als.sticky_data[i].elm.dataset.progress_f = als.sticky_data[i].progress_friction;
    }
  }
}

// 2022-03-23
// sticky child
function Als_sticky_child(elm, limit, set_var) {
  if (elm) {
    // push
    als.sticky_child.push({
      elm: elm,
      limit: limit ? limit : 0,
      set_var: set_var ? set_var : 0,
    });
    Als_sticky_child_push();
  }
}
function Als_sticky_child_push() {
  // reset and update
  als.sticky_child_data.length = 0;
  for (let i = 0; i < als.sticky_child.length; i++) {
    Als_sticky_child_data(als.sticky_child[i]);
  }
}
function Als_sticky_child_data(elms) {
  // push all elm data
  let the_elms = document.querySelectorAll(elms.elm);
  for (let i = 0; i < the_elms.length; i++) {
    let the_elms_height = the_elms[i].clientHeight;
    let the_elms_width = the_elms[i].clientWidth;

    let offset_top = getElementTop(the_elms[i]);
    let offset_left = getElementLeft(the_elms[i]);
    let parent_offset_top = getElementTop(the_elms[i].parentElement);
    let parent_offset_left = getElementLeft(the_elms[i].parentElement);

    the_elms[i].dataset.of_top = offset_top;
    the_elms[i].dataset.of_left = offset_left;
    the_elms[i].dataset.of_parent_top = parent_offset_top;
    the_elms[i].dataset.of_parent_left = parent_offset_left;

    als.sticky_child_data.push({
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
}

function Als_sticky_child_run() {
  for (let i = 0; i < als.sticky_child_data.length; i++) {
    let center_y_init = als.sticky_child_data[i].top - als.wrapper_height / 2 + als.sticky_child_data[i].height / 2 - als.scroll_y;
    let center_x_init = als.sticky_child_data[i].left - als.wrapper_width / 2 + als.sticky_child_data[i].width / 2 - als.scroll_x;
    als.sticky_child_data[i].center_x = center_x_init;
    als.sticky_child_data[i].center_y = center_y_init;

    if (als.sticky_child_data[i].set_var == 1) {
      als.sticky_child_data[i].elm.style.setProperty("--sc-center-x", center_x_init);
      als.sticky_child_data[i].elm.style.setProperty("--sc-center-y", center_y_init);
    } else {
      // set data
      als.sticky_child_data[i].elm.dataset.xx = center_x_init;
      als.sticky_child_data[i].elm.dataset.yy = center_y_init;
    }
  }
}

// reach element
function Als_reach(elm, offset_y, offset_x, set_var) {
  if (elm) {
    // push
    als.reach.push({
      elm: elm,
      offset_y: offset_y ? offset_y : 0,
      offset_x: offset_x ? offset_x : 0,
      set_var: set_var ? set_var : 0,
    });
    Als_reach_push();
  }
}
function Als_reach_push() {
  // reset and update
  als.reach_data.length = 0;
  for (let i = 0; i < als.reach.length; i++) {
    Als_reach_data(als.reach[i]);
  }
}
function Als_reach_data(elms) {
  // push all elm data
  let the_elms = document.querySelectorAll(elms.elm);
  for (let i = 0; i < the_elms.length; i++) {
    let offset_top = getElementTop(the_elms[i]);
    let offset_left = getElementLeft(the_elms[i]);
    the_elms[i].dataset.of_top = offset_top;
    the_elms[i].dataset.of_left = offset_left;
    let the_elms_height = the_elms[i].clientHeight;
    let the_elms_width = the_elms[i].clientWidth;
    als.reach_data.push({
      elm: the_elms[i],
      top: offset_top,
      left: offset_left,
      height: the_elms_height,
      width: the_elms_width,
      center_y: 0,
      center_x: 0,
      offset_y: elms.offset_y,
      offset_x: elms.offset_x,
      set_var: elms.set_var,
    });
  }
}
function Als_reach_run() {
  for (let i = 0; i < als.reach_data.length; i++) {
    // y
    let center_y_init = als.reach_data[i].top - als.wrapper_height / 2 - als.scroll_y;
    als.reach_data[i].center_y = center_y_init;
    // x
    let center_x_init = als.reach_data[i].left - als.wrapper_width / 2 - als.scroll_x;
    als.reach_data[i].center_x = center_x_init;

    let reach_y = center_y_init - als.reach_data[i].offset_y * (als.wrapper_height / 2);
    let reach_x = center_x_init - als.reach_data[i].offset_x * (als.wrapper_width / 2);

    if (als.reach_data[i].set_var == 1) {
      if (reach_y < 0) {
        als.reach_data[i].elm.classList.add("scroll-y-active");
      } else {
        als.reach_data[i].elm.classList.remove("scroll-y-active");
      }
      if (reach_x < 0) {
        als.reach_data[i].elm.classList.add("scroll-x-active");
      } else {
        als.reach_data[i].elm.classList.remove("scroll-x-active");
      }
    } else {
      if (reach_y < 0) {
        als.reach_data[i].elm.dataset.active_y = 1;
      } else {
        als.reach_data[i].elm.dataset.active_y = 0;
      }
      if (reach_x < 0) {
        als.reach_data[i].elm.dataset.active_x = 1;
      } else {
        als.reach_data[i].elm.dataset.active_x = 0;
      }
    }
  }
}

// mouse
function Als_mouse(elm, limit, friction_y, friction_x, outside, set_var) {
  if (elm) {
    // push
    als.mouse.push({
      elm: elm,
      limit: limit ? limit : 0,
      friction_y: friction_y ? friction_y : 0.1,
      friction_x: friction_x ? friction_x : 0.1,
      outside: outside ? outside : 0,
      set_var: set_var ? set_var : 0,
    });
    Als_mouse_push();
  }
}
function Als_mouse_push() {
  // reset and update
  als.mouse_data.length = 0;
  for (let i = 0; i < als.mouse.length; i++) {
    Als_mouse_data(als.mouse[i]);
  }
}
function Als_mouse_data(elms) {
  // push all elm data
  let the_elms = document.querySelectorAll(elms.elm);
  for (let i = 0; i < the_elms.length; i++) {
    let the_elms_height = the_elms[i].clientHeight;
    let the_elms_width = the_elms[i].clientWidth;
    let parent_height = the_elms[i].parentElement.clientHeight;
    let parent_width = the_elms[i].parentElement.clientWidth;
    let offset_top = getElementTop(the_elms[i]);
    let parent_offset_top = getElementTop(the_elms[i].parentElement);
    let offset_left = getElementLeft(the_elms[i]);
    let parent_offset_left = getElementLeft(the_elms[i].parentElement);

    als.mouse_data.push({
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
      set_var: elms.set_var,
    });
  }
}

document.addEventListener("mousemove", function (e) {
  als.page_x = e.pageX;
  als.page_y = e.pageY;
});

function Als_mouse_run() {
  for (let i = 0; i < als.mouse_data.length; i++) {
    let center_x = als.page_x - (als.mouse_data[i].left + als.mouse_data[i].width / 2);
    let center_y = als.page_y - (als.mouse_data[i].top + als.mouse_data[i].height / 2);
    if (als_Scrollbar && als.mouse_data[i].outside == 0) {
      center_x = center_x + als.scroll_x;
      center_y = center_y + als.scroll_y;
    }
    // limit = 0
    if (als.mouse_data[i].limit == 0) {
      als.mouse_data[i].mouse_x = center_x;
      als.mouse_data[i].mouse_y = center_y;
    }
    // limit = 1
    else if (als.mouse_data[i].limit == 1) {
      if (Math.abs(center_x) < als.mouse_data[i].parent_width / 2 && Math.abs(center_y) < als.mouse_data[i].parent_height / 2) {
        als.mouse_data[i].mouse_x = center_x;
        als.mouse_data[i].mouse_y = center_y;
      } else {
        als.mouse_data[i].mouse_x = 0;
        als.mouse_data[i].mouse_y = 0;
      }
    }
    // limit = "num"
    else if (parseFloat(als.mouse_data[i].limit) !== NaN) {
      let limit = parseFloat(als.mouse_data[i].limit);
      if (Math.abs(center_x) < limit && Math.abs(center_y) < limit) {
        als.mouse_data[i].mouse_x = center_x;
        als.mouse_data[i].mouse_y = center_y;
      } else {
        als.mouse_data[i].mouse_x = 0;
        als.mouse_data[i].mouse_y = 0;
      }
    }
    // updata friction data
    als.mouse_data[i].mouse_x_friction = Math.round((als.mouse_data[i].mouse_x_friction + (als.mouse_data[i].mouse_x - als.mouse_data[i].mouse_x_friction) * als.mouse_data[i].friction_x) * 100) / 100;
    als.mouse_data[i].mouse_y_friction = Math.round((als.mouse_data[i].mouse_y_friction + (als.mouse_data[i].mouse_y - als.mouse_data[i].mouse_y_friction) * als.mouse_data[i].friction_y) * 100) / 100;

    if (als.mouse_data[i].set_var == 1) {
      // set style
      als.mouse_data[i].elm.style.setProperty("--mouse-x-friction", Math.round(als.mouse_data[i].mouse_x_friction * 100) / 100);
      als.mouse_data[i].elm.style.setProperty("--mouse-y-friction", Math.round(als.mouse_data[i].mouse_y_friction * 100) / 100);
    } else {
      als.mouse_data[i].elm.dataset.mxx = Math.round(als.mouse_data[i].mouse_x_friction * 100) / 100;
      als.mouse_data[i].elm.dataset.myy = Math.round(als.mouse_data[i].mouse_y_friction * 100) / 100;
    }
  }
}

// update_size
function Als_parallax_data_update() {
  for (let i = 0; i < als.parallax_data.length; i++) {
    als.parallax_data[i].top = getElementTop(als.parallax_data[i].elm);
    als.parallax_data[i].left = getElementLeft(als.parallax_data[i].elm);
    als.parallax_data[i].height = als.parallax_data[i].elm.clientHeight;
    als.parallax_data[i].width = als.parallax_data[i].elm.clientWidth;
    //
    als.parallax_data[i].elm.dataset.of_top = als.parallax_data[i].top;
    als.parallax_data[i].elm.dataset.of_left = als.parallax_data[i].left;
  }
}
function Als_sticky_data_update() {
  for (let i = 0; i < als.sticky_data.length; i++) {
    als.sticky_data[i].top = getElementTop(als.sticky_data[i].elm);
    als.sticky_data[i].parent_top = getElementTop(als.sticky_data[i].elm.parentElement);
    als.sticky_data[i].left = getElementLeft(als.sticky_data[i].elm);
    als.sticky_data[i].parent_left = getElementLeft(als.sticky_data[i].elm.parentElement);
    als.sticky_data[i].width = als.sticky_data[i].elm.clientWidth;
    als.sticky_data[i].parent_width = als.sticky_data[i].elm.parentElement.clientWidth;
    als.sticky_data[i].height = als.sticky_data[i].elm.clientHeight;
    als.sticky_data[i].parent_height = als.sticky_data[i].elm.parentElement.clientHeight;
    if (als.sticky_data[i].width > als.sticky_data[i].parent_width) {
      als.sticky_data[i].parent_height = als.sticky_data[i].width;
      als.sticky_data[i].elm.parentElement.style.setProperty("height", `${als.sticky_data[i].parent_height}px`);
    }
    //
    als.sticky_data[i].elm.dataset.of_top = als.sticky_data[i].top;
    als.sticky_data[i].elm.dataset.of_left = als.sticky_data[i].left;
  }
}
function Als_sticky_child_data_update() {
  for (let i = 0; i < als.sticky_child_data.length; i++) {
    als.sticky_child_data[i].top = getElementTop(als.sticky_child_data[i].elm);
    als.sticky_child_data[i].parent_top = getElementTop(als.sticky_child_data[i].elm.parentElement);
    als.sticky_child_data[i].left = getElementLeft(als.sticky_child_data[i].elm);
    als.sticky_child_data[i].parent_left = getElementLeft(als.sticky_child_data[i].elm.parentElement);
    als.sticky_child_data[i].height = als.sticky_child_data[i].elm.clientHeight;
    als.sticky_child_data[i].width = als.sticky_child_data[i].elm.clientWidth;
    //
    als.sticky_child_data[i].elm.dataset.of_top = als.sticky_child_data[i].top;
    als.sticky_child_data[i].elm.dataset.of_parent_top = als.sticky_child_data[i].parent_top;
    als.sticky_child_data[i].elm.dataset.of_left = als.sticky_child_data[i].left;
    als.sticky_child_data[i].elm.dataset.of_parent_left = als.sticky_child_data[i].parent_left;
  }
}
function Als_reach_data_update() {
  for (let i = 0; i < als.reach_data.length; i++) {
    als.reach_data[i].top = getElementTop(als.reach_data[i].elm);
    als.reach_data[i].left = getElementLeft(als.reach_data[i].elm);
    als.reach_data[i].height = als.reach_data[i].elm.clientHeight;
    als.reach_data[i].width = als.reach_data[i].elm.clientWidth;
    //
    als.reach_data[i].elm.dataset.of_top = als.reach_data[i].top;
    als.reach_data[i].elm.dataset.of_left = als.reach_data[i].left;
  }
}
function Als_mouse_data_update() {
  for (let i = 0; i < als.mouse_data.length; i++) {
    als.mouse_data[i].top = getElementTop(als.mouse_data[i].elm);
    als.mouse_data[i].parent_top = getElementTop(als.mouse_data[i].elm.parentElement);
    als.mouse_data[i].left = getElementLeft(als.mouse_data[i].elm);
    als.mouse_data[i].parent_left = getElementLeft(als.mouse_data[i].elm.parentElement);
    als.mouse_data[i].width = als.mouse_data[i].elm.clientWidth;
    als.mouse_data[i].parent_width = als.mouse_data[i].elm.parentElement.clientWidth;
    als.mouse_data[i].height = als.mouse_data[i].elm.clientHeight;
    als.mouse_data[i].parent_height = als.mouse_data[i].elm.parentElement.clientHeight;
  }
}

// watch size change
var size_h = als.scroll_height;
var size_w = als.scroll_width;
function watch_size() {
  if (size_h !== als.scroll_height || size_w !== als.scroll_width) {
    size_h = als.scroll_height;
    size_w = als.scroll_width;
    Als_split_push();
    Als_parallax_data_update();
    Als_sticky_data_update();
    Als_sticky_child_data_update();
    Als_reach_data_update();
    Als_mouse_data_update();
    console.log("Resized");
  }
}

// 滚动到指定位置
function als_scrollTo(y) {
  if (als_Scrollbar) {
    als_Scrollbar.get(document.querySelector(als.wrapper)).update();
    als_Scrollbar.get(document.querySelector(als.wrapper)).scrollTo(0, y, 800);
  } else {
    window.scrollTo(0, y);
  }
}

// scroll_animate
function animate_scroll() {
  watch_size();
  get_scroll();
  Als_split_run();
  Als_parallax_run();
  Als_sticky_run();
  Als_sticky_child_run();
  Als_mouse_run();
  Als_reach_run();
  requestAnimationFrame(animate_scroll);
}
