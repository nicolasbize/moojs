/**
 * Minimalist Object Oriented. JavaScript
 * Check nicolasbize.github.io/moojs/ for latest updates.
 *
 * Author:       Nicolas Bize
 * Created:      Jul 20th 2014
 * Last Updated: Jul 22nd 2014
 * Version:      1.0
 * Licence:      MooJs is licenced under MIT licence (http://opensource.org/licenses/MIT)
 */
(function(){

    /**
     * Js is our core namespace. Didn't want to go for a longer name like Moojs and didn't want to
     * overlap with jQuery, underscore etc.
     */
    Js = {
        /**
         * Creates a namespace and returns it
         * Js.ns('a.b.c.d'); will create the object window.a:{ b: { c: { d: {}}}} and return d
         */
        ns: function(namespace){
            // pointer to current object in space, init at window
            var p = window;
            if(namespace && typeof namespace === "string"){
                var ns = namespace.split('.');
                for(var i=0; i<ns.length; i++){
                    p[ns[i]] = p[ns[i]] || {};
                    p = p[ns[i]];
                }
            }
            return p;
        },
        /**
         * Apply properties from one object to another
         * Returns the targetted object
         */
        apply: function(dest, src){
            // avoid weird cases
            if(typeof(src) === 'object' && dest){
                for(var p in src){
                    if(src[p] !== undefined){
                        dest[p] = src[p];
                    }
                }
            }
            return dest;
        },
        /**
         * Creates a class
         * Usage: Js.create("Namespace.Classname", {func1: ..., func2: ...});
         *        Js.create("Namespace.Classname", SuperClass, {func1: ..., func2: ...});
         */
        create: function(namespace, Constructor, cfg, SuperClass){
            // Make sure a constructor was provided
            if (!Constructor) {
              throw new Error('moo: You must provide a constructor');
            }

            // Check if the function was named
            var name = Constructor.name;
            if (!name) {
              throw new Error('moo: You must provide a named constructor');
            }

            // Figure out if we're using a namespace or global scope
            var idxNs = namespace.lastIndexOf('.');
            var ns = idxNs === -1 ? (window[namespace] = window[namespace] || {}) : Js.ns(namespace);

            // assign as a property of the namespace
            ns[name] = Constructor;

            // extend the superclass using Object.create (sry IE8-)
            if(SuperClass){
                Constructor.prototype = Object.create(SuperClass.prototype);
                Constructor.prototype.constructor = Constructor;
            }

            // add all the properties (methods, vars, ...) to the newly created class
            Js.apply(Constructor.prototype, cfg);

            // add the superclass property to access parent stuff
            Constructor.prototype.superclass = SuperClass || Object;

            return Constructor;
        }
    };

    /**
     * Observable class which supports listeners & callbacks
     */
    Js.create("Js",
      function Observable(cfg){
            this.callbacks = {};
            if(this.events){
                var scope = this.events.scope || this;
                for(var e in this.events){
                    if(e !== 'scope'){
                        this.on(e, this.events[e], scope);
                    }
                }
            }
        },
        {
        fire: function(){
            var args = Array.prototype.slice.call(arguments);
            var ev = args.shift();
            var cb = this.callbacks[ev];
            if(cb){
                // fire the event in order
                for(var i=0; i<cb.length; i++){
                    cb[i].fn.apply(cb[i].scope, args);
                }
            }
        },
        on: function(event, fn, scope){
            this.callbacks[event] = this.callbacks[event] || [];
            this.callbacks[event].push({fn:fn, scope: scope});
            return this;
        },
        un: function(event){
            delete(this.callbacks[event]);
        }
    });
})();