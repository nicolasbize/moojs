/**
 * Minimalist Object Oriented. JavaScript
 * Check nicolasbize.github.io/moojs/ for latest updates.
 *
 * Author:       Nicolas Bize
 * Created:      Jul 20th 2014
 * Version:      1.0
 * Licence:      MooJs is licenced under MIT licence (http://opensource.org/licenses/MIT)
 *
 * Provides object-oriented notions using named functions for better debugging.
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
        create: function(){
            // make a regular array of arguments
            var args = Array.prototype.slice.call(arguments);
            // extract namespace and class name
            var fullClsName = args[0];
            var idxNs = fullClsName.lastIndexOf('.');
            var ns = idxNs > 0 ? Js.ns(fullClsName.substring(0, idxNs)) : window;
            var cls = fullClsName.substring(idxNs+1);
            // extract info from arguments
            var superclass = args[2] ? args[1] : Object;
            var cfg = args[2] || args[1];
            // create an init function if there is none
            cfg.init = cfg.init || function(cfg){};
            // build the class through a named function
            // call init within the constructor
            ns[cls] = new Function(
                 "return function " + cls + "(cfg){ this.init(cfg); }"
            )();
            // extend the superclass using Object.create (sry IE8-)
            if(args[2]){
                ns[cls].prototype = Object.create(args[1].prototype);
                ns[cls].prototype.constructor = ns[cls];
            }
            // add all the properties (methods, vars, ...) to the newly created class
            Js.apply(ns[cls].prototype, cfg);
            // add the superclass property to access parent stuff
            ns[cls].prototype.superclass = superclass;

        }
    };

    /**
     * Observable class which supports listeners & callbacks
     */
    Js.create("Js.Observable", {
        init: function(cfg){
            this.callbacks = {};
            if(this.events){
                var scope = this.events.scope || this;
                for(var e in this.events){
                    if(e !== 'scope'){
                        this.on(e, this.events[e], scope);
                    }
                }
            }
            this.fire('init', this);
        },
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


// Js.create("my.ns.Person", Js.Observable, {
//     init: function(cfg){
//         this.grade = 12;
//         this.superclass.init.call(this, cfg);
//     },
//     events: {
//         init: function(s){
//             console.debug(s.grade);
//         }
//     },
//     sayBye: function(){
//         console.debug("bye!");
//     },
//     sayHello: function(){
//         console.debug("Hello!!");
//     }
// });

// var p = new my.ns.Person();
