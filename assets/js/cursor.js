(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch      = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (reduceMotion) return;
  var PALETTE = ["#87CEEB", "#FFD93D", "#FF8FA3", "#A8E6CF", "#C3A6FF"];
  var plane = null;
  if (!isTouch) {
    plane = document.createElement("div");
    plane.className = "jk-cursor";
    plane.setAttribute("aria-hidden", "true");
    plane.innerHTML =
      '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M34 6 L8 21 L19 24.5 L23 35 Z" fill="#FFFFFF" stroke="#4FB3E8" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M34 6 L8 21 L19 24.5 Z" fill="#FFD93D"/>' +
        '<path d="M19 24.5 L34 6" stroke="#4FB3E8" stroke-width="1.4" stroke-linecap="round" opacity=".65"/>' +
      "</svg>";
    document.body.appendChild(plane);
    document.body.classList.add("has-custom-cursor");
  }
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var px = mx, py = my;
  var rafId = null;
  function tick() {
    px += (mx - px) * 0.2;
    py += (my - py) * 0.2;
    if (plane) plane.style.transform = "translate3d(" + px + "px," + py + "px,0)";
    if (Math.abs(mx - px) > 0.25 || Math.abs(my - py) > 0.25) {
      rafId = requestAnimationFrame(tick);
    } else { rafId = null; }
  }
  function startFollow() { if (!rafId) rafId = requestAnimationFrame(tick); }
  if (!isTouch) {
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; startFollow(); }, { passive: true });
    window.addEventListener("mouseleave", function () { if (plane) plane.style.opacity = "0"; });
    window.addEventListener("mouseenter", function () { if (plane) plane.style.opacity = "1"; });
  }
  function burst(x, y) {
    for (var i = 0; i < 5; i++) {
      var puff = document.createElement("span");
      puff.className = "jk-puff";
      puff.setAttribute("aria-hidden", "true");
      var color = PALETTE[(Math.random() * PALETTE.length) | 0];
      var angle = (Math.PI * 2 * i) / 5 + Math.random() * 0.7;
      var dist  = 38 + Math.random() * 44;
      puff.style.setProperty("--c", color);
      puff.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
      puff.style.setProperty("--dy", (Math.sin(angle) * dist).toFixed(1) + "px");
      puff.style.setProperty("--s", (0.6 + Math.random() * 0.9).toFixed(2));
      puff.style.left = x + "px";
      puff.style.top  = y + "px";
      document.body.appendChild(puff);
      puff.addEventListener("animationend", function () { this.parentNode && this.parentNode.removeChild(this); });
    }
    var ring = document.createElement("span");
    ring.className = "jk-ring";
    ring.setAttribute("aria-hidden", "true");
    ring.style.left = x + "px";
    ring.style.top  = y + "px";
    document.body.appendChild(ring);
    ring.addEventListener("animationend", function () { this.parentNode && this.parentNode.removeChild(this); });
  }
  if (!isTouch) {
    window.addEventListener("mousedown", function (e) { if (e.button === 0) burst(e.clientX, e.clientY); });
  } else {
    window.addEventListener("touchstart", function (e) { var t = e.touches[0]; if (t) burst(t.clientX, t.clientY); }, { passive: true });
  }
  document.addEventListener("selectstart", function () { document.body.classList.remove("has-custom-cursor"); });
  document.addEventListener("mouseup", function () { if (!isTouch) document.body.classList.add("has-custom-cursor"); });
})();
