#JOE (Javascript Objects Easy)
Joe is a mini js framework for object composition. It exposes 5 methods:
-## compose(obj[, obj, obj, ...])
returns a new object that is the result of the composition of Joe and the objects passed as parameters
-## getEl(selector|nodeElement)
sets the this._el property of the composed object with the element passed as parameter
-## registerGlobalListener(selector, event, eventHandler)
register the `eventHandler` as an handler for the `event` on the element(s) specified by the `selector`. 
-## initGlobalListeners()
Attach the listener to the events registered with `registerGlobalListener`
--# getDynamicParameter(parameter)
Returns the `parameter` value. Il `parameter` is a function returns the result of calling that function.

##Examples
````
var header = Joe.compose(Sticky, Shrink)
	.getEl('#header')
	.sticky(0)
	.shrink(200)
	.initGlobalListeners();

var nav = Joe.compose(Sticky)
	.getEl('#nav')
	.sticky(()=>promoEl.clientHeight + headerEl.clientHeight)
	.initGlobalListeners();
	
var secondaryNav = Joe.compose(Sticky)
	.getEl('#secondaryNav')
	.sticky(200)
	.initGlobalListeners();
````