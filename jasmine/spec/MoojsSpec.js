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

        });


    });
});
