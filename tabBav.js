var TabNav = function (t, s) {
		this.init(t, s || {});
	},
	TabNavProto = TabNav.prototype;
TabNavProto.init = function (t, s) {
		this.tabNav = typeof t == "string" ? document.querySelector(t) : t, this.tabList = this.tabNav.querySelectorAll(".am-tab-item"), this.curTabIndex = s.tabIndex ? s.tabIndex : 0, this.curTab = this.tabList[this.curTabIndex], this.flexWidth = s.flexWidth ? s.flexWidth : 80, this.minDistence = s.minDistence ? s.minDistence : 50, this.selectedBar = this.tabNav.querySelector(".am-tab-selected-bar"), this.scrollNav = this.tabNav.querySelector(".am-tab-scroll-nav"), this.scrollNav && this.initScroll(), this.setSelectedStyle(), this.initEvent();
	},
	TabNavProto.initEvent = function () {
		var t = this;
		Array.prototype.forEach.call(this.tabList, (s) => {
			s.addEventListener("click", t.tabItemClickHandler.bind(t), !0);
		}), this.scrollNav && (this.scrollNav.addEventListener("touchmove", this.scrolling.bind(this), !0), this.scrollNav.addEventListener("touchstart", this.startScroll.bind(this), !0), this.scrollNav.addEventListener("touchend", this.endScroll.bind(this), !0), this.scrollNav.addEventListener("touchcancel", this.endScroll.bind(this), !0));
	},
	TabNavProto.tabItemClickHandler = function (t) {
		var s = t.currentTarget,
			a = this;
		Array.prototype.forEach.call(this.tabList, (t, e) => {
			s === t && (a.curTabIndex = e, a.curTab = t);
		}), this.setSelectedStyle(), this.triggerEvent("tab-nav:click", {
			index: a.curTabIndex,
			tab: a.curTab,
		});
	},
	TabNavProto.setSelectedStyle = function () {
		var t = this.tabNav.querySelector(".selected");
		if (t.className = t.className.replace(/\s+selected/g, ""), /\s+selected/g.test(t.className) || (this.curTab.className = `${this.curTab.className} selected`), this.selectedBar) {
			var s = 0,
				a = 0,
				e = !1;
			const i = this.curTabIndex;
			if (i !== null && this.tabList[i]) {
				var l = this.tabList[i];
				e = !0, a = l.clientWidth, s = l.getBoundingClientRect().left - this.tabNav.getBoundingClientRect().left;
			} else e = !1;
			e ? (this.selectedBar.style.display = "block", this.selectedBar.style.width = `${a}px`, this.selectedBar.style.webkitTransform = `translateX(${s}px)`, this.selectedBar.style.transform = `translateX(${s}px)`) : this.selectedBar.display = "none";
		}
	},
	TabNavProto.initScroll = function () {
		var t = this.scrollNav.scrollWidth,
			s = this.scrollNav.parentNode;
		if (!this.scrollData || this.scrollData.navWidth != t) {
			{
				var a = s.offsetWidth;
				this.getCurrentScrollOffset();
			}
			this.scrollData = this.scrollData || {}, this.scrollData.maxDistence = Math.max(t - a, 0), this.scrollData.navWidth = t, this.scrollData.containerWidth = a;
		}
		this.prevMask = this.tabNav.querySelector(".am-tab-scroll-left"), this.nextMask = this.tabNav.querySelector(".am-tab-scroll-right"), this.setScrollPrevMask(), this.setScrollNextMask();
	},
	TabNavProto.scrollToActiveTab = function () {
		var t = this.curTab;
		if (this.scrollData && t) {
			var s = t.getBoundingClientRect(),
				a = this.getCurrentScrollOffset();
			if (a <= 0) {
				var e = 0.5 * (this.scrollData.containerWidth - t.offsetWidth);
				s.left < 0 ? this.setOffset(Math.min(e + a - s.left, 0)) : this.scrollData.containerWidth < s.left + t.offsetWidth && this.setOffset(Math.max(-this.scrollData.maxDistence, e + a - s.left));
			}
		}
	},
	TabNavProto.getCurrentScrollOffset = function () {
		var t = this.scrollNav ? this.scrollNav.style : {};
		return t.webkitTransform ? Number(t.webkitTransform.match(/translateX\((-?(\d+(\.\d+)*))px\)/)[1]) : 0;
	},
	TabNavProto.setOffset = function (t) {
		if (!isNaN(t)) {
			var s = {
				webkitTransform: `translateX(${t}px)`,
			};
			this.scrollNav.style = s;
		}
	},
	TabNavProto.startScroll = function (t) {
		this.scrollData.y = t.pageY, this.scrollData.x = t.pageX, this.scrollData.scrollOffset = this.getCurrentScrollOffset();
	},
	TabNavProto.scrolling = function (t) {
		t.target;
		this.scrollData.offsetX = t.pageX - this.scrollData.x, this.scrollData.scrollOffsetX = this.scrollData.offsetX + this.scrollData.scrollOffset;
		var s = this.scrollData.scrollOffsetX;
		Math.abs(s) > this.scrollData.maxDistence + this.flexWidth || s > this.flexWidth || (this.scrollNav.style.transition = "none", this.scrollNav.style.webkitTransform = `translateX(${s}px)`);
	},
	TabNavProto.endScroll = function (t) {
		var s = this.scrollData,
			a = this.scrollData.offsetX;
		a != 0 && a && (Math.abs(a) >= s.maxDistence + this.flexWidth || a > this.flexWidth ? a < 0 ? this.scrollTo(-s.maxDistence, !0) : this.scrollTo(0, !0) : this.scrollTo(Math.abs(a) < this.minDistence ? a < 0 ? this.getCurrentScrollOffset() - this.minDistence : this.getCurrentScrollOffset() + this.minDistence : a + this.getCurrentScrollOffset()), this.scrollData.offsetX = 0);
	},
	TabNavProto.scrollTo = function (t, s) {
		this.scrollNav.style.transition = s ? "-webkit-transform 0.3s cubic-bezier(0.333333, 0.666667, 0.666667, 1)" : "-webkit-transform 0.3s ease-out", t < 0 && Math.abs(t) >= this.scrollData.maxDistence ? t = -this.scrollData.maxDistence : t > 0 && (t = 0), this.scrollNav.style.webkitTransform = `translateX(${t}px)`, this.setOffset(t), this.setScrollPrevMask(), this.setScrollNextMask();
	},
	TabNavProto.setScrollPrevMask = function () {
		var t = this.getCurrentScrollOffset();
		t < 0 ? /\s+show/g.test(this.prevMask.className) || (this.prevMask.className += " show") : this.prevMask.className = this.prevMask.className.replace(/\s+show/g, "");
	},
	TabNavProto.setScrollNextMask = function () {
		var t = this.getCurrentScrollOffset();
		Math.abs(-t) + this.scrollData.containerWidth < this.scrollData.navWidth ? /\s+show/g.test(this.nextMask.className) || (this.nextMask.className += " show") : this.nextMask.className = this.nextMask.className.replace(/\s+show/g, "");
	},
	TabNavProto.triggerEvent = function (t, s) {
		var a = new CustomEvent(t, {
			bubbles: "true",
			cancelable: "true",
			detail: {
				data: s,
			},
		});
		this.tabNav.dispatchEvent(a);
	};
