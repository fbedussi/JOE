var BaseModule = {
	_getDynamicParameter: function(parameter) {
		if (typeof parameter === 'function') {
			return parameter();
		} else {
			return parameter;
		}
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
	}
};

var Sticky = {
	_checkSticky: function() {
		var elMeasures = this._isSticky? this._shadowEl.getBoundingClientRect() : this._el.getBoundingClientRect();

		if (elMeasures.top <= this._getDynamicParameter(this._scrollTreshold)) {
			if (!this._isSticky) {
				this._el.style.top = this._el.getBoundingClientRect().top + 'px';
				this._el.classList.add('sticky');
				this._shadowEl.style.display = this._elDisplay;
				this._shadowEl.style.visibility = 'hidden';
				this._isSticky = true;
			}
		} else {
			if (this._isSticky) {
				this._el.classList.remove('sticky');
				this._el.style.top = '';
				this._shadowEl.style.display = 'none';
				this._isSticky = false;
			}
		}
	},
	sticky: function(scrollTreshold) {
		this._scrollTreshold = scrollTreshold;

		var elMeasures = this._el.getBoundingClientRect();
        this._elDisplay = this._el.style.display;
		var elType = this._el.tagName;
		this._shadowEl = document.createElement(elType);
		var parent = this._el.parentElement;
		this._shadowEl.className = this._el.className + ' stickyPlaceholder';
		this._shadowEl.style.display = 'none';
		//this._el.style.width = elMeasures.width + 'px';
		parent.insertBefore(this._shadowEl, this._el);

		window.addEventListener('scroll', this._checkSticky.bind(this));

		return this;
	}
};

var Shrink = {
	_checkShrink: function() {
		if (document.scrollingElement.scrollTop > this._getDynamicParameter(this._shrinkTreshold)) {
			this._el.classList.add('small');
		} else {
			this._el.classList.remove('small');
		}
	},
	shrink: function(treshold) {
		this._shrinkTreshold = treshold;

		window.addEventListener('scroll', this._checkShrink.bind(this));

		return this;
	}
};

var header = Object.assign({}, BaseModule, Sticky, Shrink)
	.getEl('#header')
	.sticky(0)
	.shrink(200);

document.querySelector('.promoStrip').addEventListener('click', (e) => {
	e.target.classList.toggle('open')
});

var nav = Object.assign({}, BaseModule, Sticky)
	.getEl('#nav')
	.sticky(() => document.querySelector('#header').clientHeight);