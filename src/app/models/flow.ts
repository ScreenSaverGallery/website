// https://github.com/jeromeetienne/gowiththeflow.js

export class Flow {
    stack: any[] = [];
    timerId: any;
    
    constructor () {        
        this.timerId = setTimeout(() => {
            this.timerId = null;
            this._next();
        }, 0);
    }

    destroy(): void {
        if (this.timerId) clearTimeout(this.timerId);
    }

    par(callback: any, isSeq: boolean = false): Flow {
        if(isSeq || !(this.stack[this.stack.length-1] instanceof Array)) this.stack.push([]);
        this.stack[this.stack.length-1].push(callback);
        return this;
    }

    seq(callback: any): Flow {
        return this.par(callback, true)
    }

    _next(err?: any, result?: any): void {
        // console.log('_next');
        const errors = [];
        const results = [];
        const callbacks = this.stack.shift() || [];
        let nbReturn = callbacks.length;
        let isSeq = nbReturn === 1;

		for(var i = 0; i < callbacks.length; i++){
			((fct, index) => {
				fct((error: any, result: any) => {
					errors[index]	= error;
					results[index]	= result;		
					if(--nbReturn === 0) this._next(isSeq?errors[0]:errors, isSeq?results[0]:results)
				}, err, result)
			})(callbacks[i], i);
		}
    }
}