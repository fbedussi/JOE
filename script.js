var Joe = {
	_globalListeners: {
		window: {
			scoll: [],
			resize: []
		}
	},
	
	getDynamicParameter: function(parameter) {
		if (typeof parameter === 'function') {
			return parameter();
		} else {
			return parameter;
		}
	},
	
	registerGlobalListener(selector, event, eventHandler) {
		var sel = selector.toLowerCase();
		var ev = event.toLowerCase();
		
		if (!this._globalListeners[sel]) {
			this._globalListeners[sel] = {};
		}
		
		if (!this._globalListeners[sel][ev]) {
			this._globalListeners[sel][ev] = [];
		}
		
		this._globalListeners[sel][ev].push(eventHandler);
	},
	
	initGlobalListeners: function() {
		Object.keys(this._globalListeners).forEach(selector => {
			var elements;
			
			switch (selector) {
				case 'window':
					elements = [window];
					break;
				case 'document':
					elements = [document];
					break;
				default:
					elements = [].slice.call(document.querySelectorAll(key));
			}
			
			elements.forEach((el) => {
				Object.keys(this._globalListeners[selector]).forEach(event => {
					el.addEventListener(event, () => {
						this._globalListeners[selector][event].forEach(eventHandler => {eventHandler();});
					});
				});
			});
		});
		
		return this;
	},

	getEl: function(selectorOrElement) {
		if (selectorOrElement instanceof HTMLElement) {
			this._el = selectorOrElement;
		}

		if (typeof selectorOrElement === 'string' && selectorOrElement.length) {
			this._el = document.querySelector(selectorOrElement);
		}

		if (!Boolean(this._el)) {
			throw new Error('No element found');
		}

		return this;
	},
	
	compose: function(...objs) {
		return Object.assign({}, this, ...objs);
	}
};

var Sticky = {
	_checkSticky: function() {
		var elMeasures = this._isSticky? this._shadowEl.getBoundingClientRect() : this._el.getBoundingClientRect();
		var scrollTreshold = this.getDynamicParameter(this._scrollTreshold);

		if (elMeasures.top < scrollTreshold) {
			if (!this._isSticky) {
				this._el.style.top = scrollTreshold + 'px';
				this._el.style.left = elMeasures.left + 'px';
				this._el.style.width = elMeasures.width + 'px';
				this._el.classList.add('sticky');
				this._shadowEl.style.display = this._elDisplay;
				this._isSticky = true;
			}
		} else {
			if (this._isSticky) {
				this._el.classList.remove('sticky');
				this._el.style.top = '';
				this._el.style.left = '';
				this._el.style.width = '';
				this._shadowEl.style.display = 'none';
				this._isSticky = false;
			}
		}
	},
	
	_handleWinResize: function() {
		if (this._isSticky) {
			var measures = this._shadowEl.getBoundingClientRect();
			this._el.style.width = measures.width + 'px';
			this._el.style.left = measures.left + 'px';
		}
	},
	
	sticky: function(scrollTreshold) {
		try {
			this._scrollTreshold = scrollTreshold;
	
			var elMeasures = this._el.getBoundingClientRect();
			this._elDisplay = this._el.style.display;
			var elType = this._el.tagName;
			this._shadowEl = document.createElement(elType);
			var parent = this._el.parentElement;
			this._shadowEl.className = this._el.className + ' stickyPlaceholder';
			this._shadowEl.style.display = 'none';
			this._shadowEl.style.opacity = 0;
			parent.insertBefore(this._shadowEl, this._el);
	
			this.registerGlobalListener('window', 'scroll', this._checkSticky.bind(this));
			this.registerGlobalListener('window', 'resize', this._handleWinResize.bind(this));
		} catch(e) {
			console.log('ERROR:', e, 'is Joe here?');
		}
			return this;
	}
};

var Shrink = {
	_checkShrink: function() {
		if (document.scrollingElement.scrollTop > this.getDynamicParameter(this._shrinkTreshold)) {
			this._el.classList.add('small');
		} else {
			this._el.classList.remove('small');
		}
	},
	
	shrink: function(treshold) {
		try {
			this._shrinkTreshold = treshold;
	
			this.registerGlobalListener('window', 'scroll', this._checkShrink.bind(this));
		} catch(e) {
			console.log('ERROR:', e, 'is Joe here?');
		}
		
		return this;
	}
};

var headerEl = document.querySelector('#header');
var promoEl = document.querySelector('.promoStrip');

var header = Joe.compose(Sticky, Shrink)
	.getEl('#header')
	.sticky(0)
	.shrink(200)
	.initGlobalListeners();

var nav = Joe.compose(Sticky)
	.getEl('#nav')
	.sticky(promoEl.clientHeight + headerEl.clientHeight)
	.initGlobalListeners();
	
var secondaryNav = Joe.compose(Sticky)
	.getEl('#secondaryNav')
	.sticky(200)
	.initGlobalListeners();
    
document.querySelector('.promoStrip').addEventListener('click', (e) => {
	e.target.classList.toggle('open');
    nav._checkSticky();
});