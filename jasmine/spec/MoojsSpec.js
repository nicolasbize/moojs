// string helper
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

describe('Moo Js', function() {
    describe('.ns(namespace)', function() {
        var ns = Js.ns('a.b.c.d.e');
        a.b.f = 'foo';

        it('should create the namespace', function() {
            expect(typeof a.b.c.d.e).toEqual('object');
            expect(ns).toEqual(a.b.c.d.e);
        });

        it('should not override existing namespaces', function(){
            Js.ns('a.b.f.g');
            expect(a.b.f).toEqual('foo');
        });

        it('should patch another namespace', function(){
            var g = Js.ns('a.b.g');
            expect(a.b.f).toEqual('foo');
            expect(g).toEqual(a.b.g);
            expect(typeof a.b.g).toEqual('object');
            expect(typeof a.b.f).toEqual('string');
        });

        it('should handle weird stuff', function(){
            expect(Js.ns(undefined)).toEqual(window);
            expect(Js.ns(null)).toEqual(window);
            expect(Js.ns({})).toEqual(window);
            expect(Js.ns('')).toEqual(window);
        });
    });

    describe('.apply(dest, src)', function() {
        it('should merge the properties', function() {
            var a = {a: 'aaa', b: 'bbb', d: 'ddd', e: 'eee'};
            var b = {b: 'buz', c: 'ccc', d: null, e: undefined};
            Js.apply(a, b);
            expect(a.a).toEqual('aaa');
            expect(a.b).toEqual('buz');
            expect(a.c).toEqual('ccc');
            expect(a.d).toEqual(null);
            expect(a.e).toEqual('eee');
        });

        it('should merge the functions ', function(){
            var a = {
                a: function(){return 'aaa';},
                b: function(){return 'bbb';},
                d: function(){return 'ddd';},
                e: function(){return 'eee';}
            };
            var b = {
                b: function(){return 'buz';},
                c: function(){return 'ccc';},
                d: function(){return null;},
                e: function(){return undefined;},
            };
            Js.apply(a, b);
            expect(a.a()).toEqual('aaa');
            expect(a.b()).toEqual('buz');
            expect(a.c()).toEqual('ccc');
            expect(a.d()).toEqual(null);
            expect(a.e()).toEqual(undefined);
        });
    });

    describe('.create(cls, {...})', function() {
        Js.create(
            'My.namespace',
            function Person(cfg){
                // We'll have to manually call Js.apply here
                // This mixes in instantiation options into an instance
                Js.apply(this, cfg);
                this.age = cfg.age;
                this.sex = cfg.sex || 'male';
                this.name = cfg.name;
            },
            {
                sayHello: function(person){
                    return "{0} : Hello, {1}!".format(this.name, person.name);
                },
                smile: function(){
                    return "{0} is smiling.".format(this.name);
                }
            }
        );
        var john = new My.namespace.Person({
            name: 'John'
        });
        var jane = new My.namespace.Person({
            name: 'Jane',
            age: 20,
            sex: 'female',
            xp: 50,
            sayHello: function(person){
                return "Hi!!";
            },
            sayBye: function(person){
                return "Bye {0}!".format(person.name);
            }
        });
        it('should create a reusable class', function(){
            expect(john.name).toEqual('John');
            expect(john.age).toEqual(undefined);
            expect(john.sex).toEqual('male');
            expect(john.sayHello(jane)).toEqual("John : Hello, Jane!");
            expect(jane.name).toEqual('Jane');
            expect(jane.age).toEqual(20);
            expect(jane.xp).toEqual(50);
            expect(jane.sex).toEqual('female');
            expect(jane.sayHello(john)).toEqual("Hi!!");
            expect(jane.sayBye(john)).toEqual("Bye John!");
            expect(typeof john).toEqual("object");
            expect(john instanceof My.namespace.Person).toEqual(true);
        });

        // let's extend the Person class
        Js.create(
            'My.namespace',
            function Student(cfg){
                this.superclass.call(this, cfg);
                this.name = "Student " + this.name;
            },
            {
                sayHello: function(person){
                    return "{0} : Eh yoo, {1}!!!".format(this.name, person.name);
                },
                study: function(){
                    return "bzzz...";
                }
            },
            My.namespace.Person
        );
        var nick = new My.namespace.Student({
            name: 'Nick',
            sayBye: function(person){
                return "Peace out.";
            }
        });
        it('should support inheritance', function(){
            expect(nick instanceof My.namespace.Student).toEqual(true);
            expect(nick instanceof My.namespace.Person).toEqual(true);
            expect(john instanceof My.namespace.Student).toEqual(false);
            expect(nick.age).toEqual(undefined);
            expect(nick.name).toEqual("Student Nick");
            expect(nick.sex).toEqual('male');
            expect(nick.sayHello(jane)).toEqual("Student Nick : Eh yoo, Jane!!!");
            expect(nick.study()).toEqual("bzzz...");
            expect(nick.sayBye()).toEqual("Peace out.");
        });
    });
});
