
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop$1(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append$1(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append$1(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr$1(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr$1(node, key, attributes[key]);
            }
        }
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now$1() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop$1(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append$1(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr$1(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var languages = {
    	en: {
    		name: "English",
    		label: "en",
    		"default": true
    	},
    	it: {
    		name: "Italiano",
    		label: "it",
    		"default": false
    	}
    };
    var colorPalette = [
    	"#6A72DC",
    	"#60C971"
    ];
    var pages = [
    	{
    		name: "Home",
    		path: "/",
    		components: [
    			{
    				type: "Hero",
    				title: "Transformation Lab",
    				subtitle: "Knowledge for sustainable territories",
    				cta: {
    					text: "scroll down",
    					arrow: "bottom"
    				},
    				shapes: [
    					{
    						top: 90,
    						left: 90,
    						size: 200,
    						color: "#6A72DC",
    						zindex: 10
    					},
    					{
    						top: 73,
    						left: 89,
    						size: 50,
    						color: "#60C971",
    						zindex: 20
    					},
    					{
    						top: 18,
    						left: -12,
    						size: 150,
    						color: "#60C971"
    					},
    					{
    						top: 90,
    						left: 20,
    						size: 100,
    						color: "#6A72DC"
    					}
    				]
    			},
    			{
    				type: "Spacer",
    				height: 100
    			},
    			{
    				type: "BlockWithImage",
    				anchor: "Solution",
    				imagePosition: "right",
    				imagePath: "community.jpg",
    				overtitle: "Community",
    				title: "Learning Path",
    				description: "We start by getting to know the territories, understanding their needs and creating with the active stakeholders a laboratorial journey based on measurable and concrete results",
    				shapes: [
    					{
    						top: 65,
    						left: 61,
    						size: 150,
    						color: "#60C971",
    						zindex: 60
    					},
    					{
    						top: 75,
    						left: 69,
    						size: 50,
    						color: "#6A72DC",
    						zindex: 70
    					}
    				]
    			},
    			{
    				type: "BlockWithImage",
    				imagePosition: "left",
    				imagePath: "knowledge.jpg",
    				overtitle: "knowledge",
    				title: "Impact Generation",
    				description: "We empower a new collaborative generation of business owners by transfering knowlege on enterpreneurship, sustainability, impact measurement and open organisation design",
    				shapes: [
    					{
    						top: 85,
    						left: -10,
    						size: 200,
    						color: "#6A72DC",
    						zindex: 70
    					}
    				]
    			},
    			{
    				type: "BlockWithImage",
    				imagePosition: "right",
    				imagePath: "data.jpg",
    				overtitle: "data",
    				title: "Measurement",
    				description: "We drive a culture of impact measurement and transparent communication enabling data driven decisions, engagement, funds attraction and open participation",
    				shapes: [
    					{
    						top: 65,
    						left: 61,
    						size: 120,
    						color: "#60C971",
    						zindex: 60
    					}
    				]
    			},
    			{
    				type: "Bubbles",
    				overtitle: "Why",
    				title: "We give shape to complex<br />sustainable territorial transformations",
    				bubbles: [
    					{
    						text: "Attract people",
    						color: "#6A72DC"
    					},
    					{
    						text: "Create new jobs",
    						color: "#60C971"
    					},
    					{
    						text: "Community owned enterprise",
    						color: "#6A72DC"
    					},
    					{
    						text: "Environmental protection",
    						color: "#60C971"
    					}
    				]
    			},
    			{
    				type: "Carousel",
    				overtitle: "How",
    				title: "A learning process that works",
    				slides: [
    					{
    						image: "<svg width=\"71\" height=\"48\" viewBox=\"0 0 71 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"18\" cy=\"24\" r=\"17.5\" transform=\"rotate(90 18 24)\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/><circle cx=\"18\" cy=\"24\" r=\"17.5\" transform=\"rotate(90 18 24)\" stroke=\"#60C971\"/><ellipse cx=\"47\" cy=\"24\" rx=\"24\" ry=\"24\" transform=\"rotate(90 47 24)\" fill=\"#646FFF\" style=\"mix-blend-mode:multiply\"/></svg>",
    						title: "Tailor Made",
    						description: "We co-design a tailor made training path composed by a set of micromasters that transfer the needed knowledge to a territory"
    					},
    					{
    						image: "<svg width=\"63\" height=\"50\" viewBox=\"0 0 63 50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M60.3685 21.7325C62.6268 23.3261 62.6269 26.6754 60.3685 28.269L30.8062 49.1296C28.1565 50.9994 24.5 49.1044 24.5 45.8614L24.5 4.14014C24.5 0.897142 28.1565 -0.997856 30.8062 0.871914L60.3685 21.7325Z\" fill=\"#646FFF\" style=\"mix-blend-mode:multiply\"/><path d=\"M36.3685 21.7325C38.6268 23.3261 38.6269 26.6753 36.3685 28.269L6.80623 49.1296C4.15652 50.9993 0.500001 49.1043 0.500001 45.8613L0.500003 4.14011C0.500003 0.897111 4.15652 -0.997887 6.80623 0.871884L36.3685 21.7325Z\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/></svg>",
    						title: "Agile",
    						description: "Communities deliver value by continuously evaluating plans, activities and outcomes in an iterative approach"
    					},
    					{
    						image: "<svg width=\"63\" height=\"51\" viewBox=\"0 0 63 51\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.07108 20.9704C7.63318 19.4083 10.1658 19.4083 11.7279 20.9704L32.9411 42.1836L25.8701 49.2547C24.308 50.8168 21.7753 50.8168 20.2132 49.2547L1.82844 30.8699C0.266341 29.3078 0.266341 26.7752 1.82844 25.2131L6.07108 20.9704Z\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/><path d=\"M60.9842 8.48349C62.5463 10.0456 62.5463 12.5782 60.9842 14.1403L25.87 49.2546C24.3079 50.8167 21.7752 50.8167 20.2131 49.2546L10.3136 39.3551L48.2563 1.41242C49.8184 -0.149673 52.3511 -0.149673 53.9132 1.41242L60.9842 8.48349Z\" fill=\"#646FFF\" style=\"mix-blend-mode:multiply\"/></svg>",
    						title: "Results Driven",
    						description: "All participants practice the immediate application of the acquired skills, generating tangible results"
    					},
    					{
    						image: "<svg width=\"75\" height=\"66\" viewBox=\"0 0 75 66\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M44.3685 29.7318C46.6268 31.3254 46.6269 34.6746 44.3685 36.2682L14.8062 57.1288C12.1565 58.9986 8.5 57.1036 8.5 53.8606L8.5 12.1394C8.5 8.89638 12.1565 7.00138 14.8062 8.87115L44.3685 29.7318Z\" fill=\"#646FFF\" style=\"mix-blend-mode:multiply\"/><circle cx=\"11\" cy=\"55\" r=\"11\" transform=\"rotate(90 11 55)\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/><circle cx=\"11\" cy=\"11\" r=\"11\" transform=\"rotate(90 11 11)\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/><path d=\"M30.6315 36.2682C28.3731 34.6746 28.3731 31.3254 30.6315 29.7318L60.1938 8.87115C62.8435 7.00138 66.5 8.89638 66.5 12.1394L66.5 53.8606C66.5 57.1036 62.8435 58.9986 60.1938 57.1288L30.6315 36.2682Z\" fill=\"#646FFF\" style=\"mix-blend-mode:multiply\"/><circle cx=\"64\" cy=\"11\" r=\"11\" transform=\"rotate(-90 64 11)\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/><circle cx=\"64\" cy=\"55\" r=\"11\" transform=\"rotate(-90 64 55)\" fill=\"#60C971\" style=\"mix-blend-mode:multiply\"/></svg>",
    						title: "Hybrid",
    						description: "Residentials trainings are mixed with online sessions to combine the need for human relations with the digital accessibility"
    					}
    				]
    			},
    			{
    				type: "Cards",
    				overtitle: "What",
    				title: "We drive tangible territorial  growth",
    				cards: [
    					{
    						title: "Territorial<br />Catalog",
    						description: "Co-create an experiences, products and services catalog representing the territorial identity"
    					},
    					{
    						title: "Impact<br />Management",
    						description: "Identify, plan, execute, measure, assess and transparently communicate the impact narrative inside and outside the territory"
    					},
    					{
    						title: "Community<br />Enterprise",
    						description: "Create a local organisation where anyone generating positive impact can actively participate to the decision making process"
    					},
    					{
    						title: "Multi-Channel<br />Distribution",
    						description: "Promote the catalog to remote workers, travelers, enterprises,  schools and locals through OTAs, DMOs or community websites"
    					}
    				]
    			},
    			{
    				type: "BgCards",
    				overtitle: "Who",
    				title: "Who can we help",
    				cards: [
    					{
    						firstLine: "Public Admin",
    						secondLine: "and Governments",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Private operators",
    						secondLine: "individuals or networks",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Foundations",
    						secondLine: "and Civil Society Organisations",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Universities",
    						secondLine: "and Reserach Centers",
    						imagePath: "image.jpeg"
    					}
    				]
    			},
    			{
    				type: "BgCards",
    				overtitle: "what we can do",
    				anchor: "Micromaster",
    				title: "Our Micromaster",
    				slider: true,
    				cards: [
    					{
    						firstLine: "Context Mapping and Analysis",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Impact Management",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Open Organisation Design",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Experience Design",
    						imagePath: "image.jpeg"
    					},
    					{
    						firstLine: "Impact Storytelling",
    						imagePath: "image.jpeg"
    					}
    				]
    			}
    		]
    	}
    ];
    var data = {
    	languages: languages,
    	colorPalette: colorPalette,
    	pages: pages
    };

    /**
     * SSR Window 4.0.0
     * Better handling for window object in SSR environment
     * https://github.com/nolimits4web/ssr-window
     *
     * Copyright 2021, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: August 25, 2021
     */
    /* eslint-disable no-param-reassign */
    function isObject$2(obj) {
        return (obj !== null &&
            typeof obj === 'object' &&
            'constructor' in obj &&
            obj.constructor === Object);
    }
    function extend$2(target = {}, src = {}) {
        Object.keys(src).forEach((key) => {
            if (typeof target[key] === 'undefined')
                target[key] = src[key];
            else if (isObject$2(src[key]) &&
                isObject$2(target[key]) &&
                Object.keys(src[key]).length > 0) {
                extend$2(target[key], src[key]);
            }
        });
    }

    const ssrDocument = {
        body: {},
        addEventListener() { },
        removeEventListener() { },
        activeElement: {
            blur() { },
            nodeName: '',
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() { },
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() { },
                getElementsByTagName() {
                    return [];
                },
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: '',
            host: '',
            hostname: '',
            href: '',
            origin: '',
            pathname: '',
            protocol: '',
            search: '',
        },
    };
    function getDocument() {
        const doc = typeof document !== 'undefined' ? document : {};
        extend$2(doc, ssrDocument);
        return doc;
    }

    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: '',
        },
        location: {
            hash: '',
            host: '',
            hostname: '',
            href: '',
            origin: '',
            pathname: '',
            protocol: '',
            search: '',
        },
        history: {
            replaceState() { },
            pushState() { },
            go() { },
            back() { },
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() { },
        removeEventListener() { },
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return '';
                },
            };
        },
        Image() { },
        Date() { },
        screen: {},
        setTimeout() { },
        clearTimeout() { },
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if (typeof setTimeout === 'undefined') {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if (typeof setTimeout === 'undefined') {
                return;
            }
            clearTimeout(id);
        },
    };
    function getWindow() {
        const win = typeof window !== 'undefined' ? window : {};
        extend$2(win, ssrWindow);
        return win;
    }

    /**
     * Dom7 4.0.0
     * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
     * https://framework7.io/docs/dom7.html
     *
     * Copyright 2021, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: August 25, 2021
     */

    /* eslint-disable no-proto */
    function makeReactive(obj) {
      const proto = obj.__proto__;
      Object.defineProperty(obj, '__proto__', {
        get() {
          return proto;
        },

        set(value) {
          proto.__proto__ = value;
        }

      });
    }

    class Dom7 extends Array {
      constructor(items) {
        super(...(items || []));
        makeReactive(this);
      }

    }

    function arrayFlat(arr = []) {
      const res = [];
      arr.forEach(el => {
        if (Array.isArray(el)) {
          res.push(...arrayFlat(el));
        } else {
          res.push(el);
        }
      });
      return res;
    }
    function arrayFilter(arr, callback) {
      return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
      const uniqueArray = [];

      for (let i = 0; i < arr.length; i += 1) {
        if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
      }

      return uniqueArray;
    }

    // eslint-disable-next-line

    function qsa(selector, context) {
      if (typeof selector !== 'string') {
        return [selector];
      }

      const a = [];
      const res = context.querySelectorAll(selector);

      for (let i = 0; i < res.length; i += 1) {
        a.push(res[i]);
      }

      return a;
    }

    function $(selector, context) {
      const window = getWindow();
      const document = getDocument();
      let arr = [];

      if (!context && selector instanceof Dom7) {
        return selector;
      }

      if (!selector) {
        return new Dom7(arr);
      }

      if (typeof selector === 'string') {
        const html = selector.trim();

        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
          let toCreate = 'div';
          if (html.indexOf('<li') === 0) toCreate = 'ul';
          if (html.indexOf('<tr') === 0) toCreate = 'tbody';
          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
          if (html.indexOf('<tbody') === 0) toCreate = 'table';
          if (html.indexOf('<option') === 0) toCreate = 'select';
          const tempParent = document.createElement(toCreate);
          tempParent.innerHTML = html;

          for (let i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          arr = qsa(selector.trim(), context || document);
        } // arr = qsa(selector, document);

      } else if (selector.nodeType || selector === window || selector === document) {
        arr.push(selector);
      } else if (Array.isArray(selector)) {
        if (selector instanceof Dom7) return selector;
        arr = selector;
      }

      return new Dom7(arrayUnique(arr));
    }

    $.fn = Dom7.prototype;

    // eslint-disable-next-line

    function addClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        el.classList.add(...classNames);
      });
      return this;
    }

    function removeClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        el.classList.remove(...classNames);
      });
      return this;
    }

    function toggleClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        classNames.forEach(className => {
          el.classList.toggle(className);
        });
      });
    }

    function hasClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      return arrayFilter(this, el => {
        return classNames.filter(className => el.classList.contains(className)).length > 0;
      }).length > 0;
    }

    function attr(attrs, value) {
      if (arguments.length === 1 && typeof attrs === 'string') {
        // Get attr
        if (this[0]) return this[0].getAttribute(attrs);
        return undefined;
      } // Set attrs


      for (let i = 0; i < this.length; i += 1) {
        if (arguments.length === 2) {
          // String
          this[i].setAttribute(attrs, value);
        } else {
          // Object
          for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
          }
        }
      }

      return this;
    }

    function removeAttr(attr) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].removeAttribute(attr);
      }

      return this;
    }

    function transform(transform) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].style.transform = transform;
      }

      return this;
    }

    function transition$1(duration) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
      }

      return this;
    }

    function on(...args) {
      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
        [eventType, listener, capture] = args;
        targetSelector = undefined;
      }

      if (!capture) capture = false;

      function handleLiveEvent(e) {
        const target = e.target;
        if (!target) return;
        const eventData = e.target.dom7EventData || [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
          const parents = $(target).parents(); // eslint-disable-line

          for (let k = 0; k < parents.length; k += 1) {
            if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
          }
        }
      }

      function handleEvent(e) {
        const eventData = e && e.target ? e.target.dom7EventData || [] : [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        listener.apply(this, eventData);
      }

      const events = eventType.split(' ');
      let j;

      for (let i = 0; i < this.length; i += 1) {
        const el = this[i];

        if (!targetSelector) {
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            if (!el.dom7Listeners) el.dom7Listeners = {};
            if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
            el.dom7Listeners[event].push({
              listener,
              proxyListener: handleEvent
            });
            el.addEventListener(event, handleEvent, capture);
          }
        } else {
          // Live events
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
            if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
            el.dom7LiveListeners[event].push({
              listener,
              proxyListener: handleLiveEvent
            });
            el.addEventListener(event, handleLiveEvent, capture);
          }
        }
      }

      return this;
    }

    function off(...args) {
      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
        [eventType, listener, capture] = args;
        targetSelector = undefined;
      }

      if (!capture) capture = false;
      const events = eventType.split(' ');

      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];

        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];
          let handlers;

          if (!targetSelector && el.dom7Listeners) {
            handlers = el.dom7Listeners[event];
          } else if (targetSelector && el.dom7LiveListeners) {
            handlers = el.dom7LiveListeners[event];
          }

          if (handlers && handlers.length) {
            for (let k = handlers.length - 1; k >= 0; k -= 1) {
              const handler = handlers[k];

              if (listener && handler.listener === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (!listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              }
            }
          }
        }
      }

      return this;
    }

    function trigger(...args) {
      const window = getWindow();
      const events = args[0].split(' ');
      const eventData = args[1];

      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];

        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];

          if (window.CustomEvent) {
            const evt = new window.CustomEvent(event, {
              detail: eventData,
              bubbles: true,
              cancelable: true
            });
            el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
            el.dispatchEvent(evt);
            el.dom7EventData = [];
            delete el.dom7EventData;
          }
        }
      }

      return this;
    }

    function transitionEnd$1(callback) {
      const dom = this;

      function fireCallBack(e) {
        if (e.target !== this) return;
        callback.call(this, e);
        dom.off('transitionend', fireCallBack);
      }

      if (callback) {
        dom.on('transitionend', fireCallBack);
      }

      return this;
    }

    function outerWidth(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
        }

        return this[0].offsetWidth;
      }

      return null;
    }

    function outerHeight(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
        }

        return this[0].offsetHeight;
      }

      return null;
    }

    function offset() {
      if (this.length > 0) {
        const window = getWindow();
        const document = getDocument();
        const el = this[0];
        const box = el.getBoundingClientRect();
        const body = document.body;
        const clientTop = el.clientTop || body.clientTop || 0;
        const clientLeft = el.clientLeft || body.clientLeft || 0;
        const scrollTop = el === window ? window.scrollY : el.scrollTop;
        const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
        return {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft
        };
      }

      return null;
    }

    function styles() {
      const window = getWindow();
      if (this[0]) return window.getComputedStyle(this[0], null);
      return {};
    }

    function css(props, value) {
      const window = getWindow();
      let i;

      if (arguments.length === 1) {
        if (typeof props === 'string') {
          // .css('width')
          if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
          // .css({ width: '100px' })
          for (i = 0; i < this.length; i += 1) {
            for (const prop in props) {
              this[i].style[prop] = props[prop];
            }
          }

          return this;
        }
      }

      if (arguments.length === 2 && typeof props === 'string') {
        // .css('width', '100px')
        for (i = 0; i < this.length; i += 1) {
          this[i].style[props] = value;
        }

        return this;
      }

      return this;
    }

    function each(callback) {
      if (!callback) return this;
      this.forEach((el, index) => {
        callback.apply(el, [el, index]);
      });
      return this;
    }

    function filter(callback) {
      const result = arrayFilter(this, callback);
      return $(result);
    }

    function html(html) {
      if (typeof html === 'undefined') {
        return this[0] ? this[0].innerHTML : null;
      }

      for (let i = 0; i < this.length; i += 1) {
        this[i].innerHTML = html;
      }

      return this;
    }

    function text(text) {
      if (typeof text === 'undefined') {
        return this[0] ? this[0].textContent.trim() : null;
      }

      for (let i = 0; i < this.length; i += 1) {
        this[i].textContent = text;
      }

      return this;
    }

    function is(selector) {
      const window = getWindow();
      const document = getDocument();
      const el = this[0];
      let compareWith;
      let i;
      if (!el || typeof selector === 'undefined') return false;

      if (typeof selector === 'string') {
        if (el.matches) return el.matches(selector);
        if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
        if (el.msMatchesSelector) return el.msMatchesSelector(selector);
        compareWith = $(selector);

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      if (selector === document) {
        return el === document;
      }

      if (selector === window) {
        return el === window;
      }

      if (selector.nodeType || selector instanceof Dom7) {
        compareWith = selector.nodeType ? [selector] : selector;

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      return false;
    }

    function index() {
      let child = this[0];
      let i;

      if (child) {
        i = 0; // eslint-disable-next-line

        while ((child = child.previousSibling) !== null) {
          if (child.nodeType === 1) i += 1;
        }

        return i;
      }

      return undefined;
    }

    function eq(index) {
      if (typeof index === 'undefined') return this;
      const length = this.length;

      if (index > length - 1) {
        return $([]);
      }

      if (index < 0) {
        const returnIndex = length + index;
        if (returnIndex < 0) return $([]);
        return $([this[returnIndex]]);
      }

      return $([this[index]]);
    }

    function append(...els) {
      let newChild;
      const document = getDocument();

      for (let k = 0; k < els.length; k += 1) {
        newChild = els[k];

        for (let i = 0; i < this.length; i += 1) {
          if (typeof newChild === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;

            while (tempDiv.firstChild) {
              this[i].appendChild(tempDiv.firstChild);
            }
          } else if (newChild instanceof Dom7) {
            for (let j = 0; j < newChild.length; j += 1) {
              this[i].appendChild(newChild[j]);
            }
          } else {
            this[i].appendChild(newChild);
          }
        }
      }

      return this;
    }

    function prepend(newChild) {
      const document = getDocument();
      let i;
      let j;

      for (i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newChild;

          for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
          }
        } else if (newChild instanceof Dom7) {
          for (j = 0; j < newChild.length; j += 1) {
            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
          }
        } else {
          this[i].insertBefore(newChild, this[i].childNodes[0]);
        }
      }

      return this;
    }

    function next(selector) {
      if (this.length > 0) {
        if (selector) {
          if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
            return $([this[0].nextElementSibling]);
          }

          return $([]);
        }

        if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function nextAll(selector) {
      const nextEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.nextElementSibling) {
        const next = el.nextElementSibling; // eslint-disable-line

        if (selector) {
          if ($(next).is(selector)) nextEls.push(next);
        } else nextEls.push(next);

        el = next;
      }

      return $(nextEls);
    }

    function prev(selector) {
      if (this.length > 0) {
        const el = this[0];

        if (selector) {
          if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
            return $([el.previousElementSibling]);
          }

          return $([]);
        }

        if (el.previousElementSibling) return $([el.previousElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function prevAll(selector) {
      const prevEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.previousElementSibling) {
        const prev = el.previousElementSibling; // eslint-disable-line

        if (selector) {
          if ($(prev).is(selector)) prevEls.push(prev);
        } else prevEls.push(prev);

        el = prev;
      }

      return $(prevEls);
    }

    function parent(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        if (this[i].parentNode !== null) {
          if (selector) {
            if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
          } else {
            parents.push(this[i].parentNode);
          }
        }
      }

      return $(parents);
    }

    function parents(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        let parent = this[i].parentNode; // eslint-disable-line

        while (parent) {
          if (selector) {
            if ($(parent).is(selector)) parents.push(parent);
          } else {
            parents.push(parent);
          }

          parent = parent.parentNode;
        }
      }

      return $(parents);
    }

    function closest(selector) {
      let closest = this; // eslint-disable-line

      if (typeof selector === 'undefined') {
        return $([]);
      }

      if (!closest.is(selector)) {
        closest = closest.parents(selector).eq(0);
      }

      return closest;
    }

    function find(selector) {
      const foundElements = [];

      for (let i = 0; i < this.length; i += 1) {
        const found = this[i].querySelectorAll(selector);

        for (let j = 0; j < found.length; j += 1) {
          foundElements.push(found[j]);
        }
      }

      return $(foundElements);
    }

    function children(selector) {
      const children = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        const childNodes = this[i].children;

        for (let j = 0; j < childNodes.length; j += 1) {
          if (!selector || $(childNodes[j]).is(selector)) {
            children.push(childNodes[j]);
          }
        }
      }

      return $(children);
    }

    function remove() {
      for (let i = 0; i < this.length; i += 1) {
        if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
      }

      return this;
    }

    const Methods = {
      addClass,
      removeClass,
      hasClass,
      toggleClass,
      attr,
      removeAttr,
      transform,
      transition: transition$1,
      on,
      off,
      trigger,
      transitionEnd: transitionEnd$1,
      outerWidth,
      outerHeight,
      styles,
      offset,
      css,
      each,
      html,
      text,
      is,
      index,
      eq,
      append,
      prepend,
      next,
      nextAll,
      prev,
      prevAll,
      parent,
      parents,
      closest,
      find,
      children,
      filter,
      remove
    };
    Object.keys(Methods).forEach(methodName => {
      Object.defineProperty($.fn, methodName, {
        value: Methods[methodName],
        writable: true
      });
    });

    function deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach(key => {
        try {
          object[key] = null;
        } catch (e) {// no getter for object
        }

        try {
          delete object[key];
        } catch (e) {// something got wrong
        }
      });
    }

    function nextTick(callback, delay = 0) {
      return setTimeout(callback, delay);
    }

    function now() {
      return Date.now();
    }

    function getComputedStyle$1(el) {
      const window = getWindow();
      let style;

      if (window.getComputedStyle) {
        style = window.getComputedStyle(el, null);
      }

      if (!style && el.currentStyle) {
        style = el.currentStyle;
      }

      if (!style) {
        style = el.style;
      }

      return style;
    }

    function getTranslate(el, axis = 'x') {
      const window = getWindow();
      let matrix;
      let curTransform;
      let transformMatrix;
      const curStyle = getComputedStyle$1(el);

      if (window.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;

        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
        } // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case


        transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
      }

      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
      }

      return curTransform || 0;
    }

    function isObject$1(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function isNode(node) {
      // eslint-disable-next-line
      if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
        return node instanceof HTMLElement;
      }

      return node && (node.nodeType === 1 || node.nodeType === 11);
    }

    function extend$1(...args) {
      const to = Object(args[0]);
      const noExtend = ['__proto__', 'constructor', 'prototype'];

      for (let i = 1; i < args.length; i += 1) {
        const nextSource = args[i];

        if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
          const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend$1(to[nextKey], nextSource[nextKey]);
                }
              } else if (!isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
                to[nextKey] = {};

                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend$1(to[nextKey], nextSource[nextKey]);
                }
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }

      return to;
    }

    function setCSSProperty(el, varName, varValue) {
      el.style.setProperty(varName, varValue);
    }

    function animateCSSModeScroll({
      swiper,
      targetPosition,
      side
    }) {
      const window = getWindow();
      const startPosition = -swiper.translate;
      let startTime = null;
      let time;
      const duration = swiper.params.speed;
      swiper.wrapperEl.style.scrollSnapType = 'none';
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      const dir = targetPosition > startPosition ? 'next' : 'prev';

      const isOutOfBound = (current, target) => {
        return dir === 'next' && current >= target || dir === 'prev' && current <= target;
      };

      const animate = () => {
        time = new Date().getTime();

        if (startTime === null) {
          startTime = time;
        }

        const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

        if (isOutOfBound(currentPosition, targetPosition)) {
          currentPosition = targetPosition;
        }

        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });

        if (isOutOfBound(currentPosition, targetPosition)) {
          swiper.wrapperEl.style.overflow = 'hidden';
          swiper.wrapperEl.style.scrollSnapType = '';
          setTimeout(() => {
            swiper.wrapperEl.style.overflow = '';
            swiper.wrapperEl.scrollTo({
              [side]: currentPosition
            });
          });
          window.cancelAnimationFrame(swiper.cssModeFrameID);
          return;
        }

        swiper.cssModeFrameID = window.requestAnimationFrame(animate);
      };

      animate();
    }

    let support;

    function calcSupport() {
      const window = getWindow();
      const document = getDocument();
      return {
        smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
        passiveListener: function checkPassiveListener() {
          let supportsPassive = false;

          try {
            const opts = Object.defineProperty({}, 'passive', {
              // eslint-disable-next-line
              get() {
                supportsPassive = true;
              }

            });
            window.addEventListener('testPassiveListener', null, opts);
          } catch (e) {// No support
          }

          return supportsPassive;
        }(),
        gestures: function checkGestures() {
          return 'ongesturestart' in window;
        }()
      };
    }

    function getSupport() {
      if (!support) {
        support = calcSupport();
      }

      return support;
    }

    let deviceCached;

    function calcDevice({
      userAgent
    } = {}) {
      const support = getSupport();
      const window = getWindow();
      const platform = window.navigator.platform;
      const ua = userAgent || window.navigator.userAgent;
      const device = {
        ios: false,
        android: false
      };
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

      let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      const windows = platform === 'Win32';
      let macos = platform === 'MacIntel'; // iPadOs 13 fix

      const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

      if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
        ipad = ua.match(/(Version)\/([\d.]+)/);
        if (!ipad) ipad = [0, 1, '13_0_0'];
        macos = false;
      } // Android


      if (android && !windows) {
        device.os = 'android';
        device.android = true;
      }

      if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
      } // Export object


      return device;
    }

    function getDevice(overrides = {}) {
      if (!deviceCached) {
        deviceCached = calcDevice(overrides);
      }

      return deviceCached;
    }

    let browser;

    function calcBrowser() {
      const window = getWindow();

      function isSafari() {
        const ua = window.navigator.userAgent.toLowerCase();
        return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
      }

      return {
        isSafari: isSafari(),
        isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
      };
    }

    function getBrowser() {
      if (!browser) {
        browser = calcBrowser();
      }

      return browser;
    }

    function Resize({
      swiper,
      on,
      emit
    }) {
      const window = getWindow();
      let observer = null;

      const resizeHandler = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        emit('beforeResize');
        emit('resize');
      };

      const createObserver = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        observer = new ResizeObserver(entries => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach(({
            contentBoxSize,
            contentRect,
            target
          }) => {
            if (target && target !== swiper.el) return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });

          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
        observer.observe(swiper.el);
      };

      const removeObserver = () => {
        if (observer && observer.unobserve && swiper.el) {
          observer.unobserve(swiper.el);
          observer = null;
        }
      };

      const orientationChangeHandler = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        emit('orientationchange');
      };

      on('init', () => {
        if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
          createObserver();
          return;
        }

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('orientationchange', orientationChangeHandler);
      });
      on('destroy', () => {
        removeObserver();
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('orientationchange', orientationChangeHandler);
      });
    }

    function Observer({
      swiper,
      extendParams,
      on,
      emit
    }) {
      const observers = [];
      const window = getWindow();

      const attach = (target, options = {}) => {
        const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        const observer = new ObserverFunc(mutations => {
          // The observerUpdate event should only be triggered
          // once despite the number of mutations.  Additional
          // triggers are redundant and are very costly
          if (mutations.length === 1) {
            emit('observerUpdate', mutations[0]);
            return;
          }

          const observerUpdate = function observerUpdate() {
            emit('observerUpdate', mutations[0]);
          };

          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(observerUpdate);
          } else {
            window.setTimeout(observerUpdate, 0);
          }
        });
        observer.observe(target, {
          attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
          childList: typeof options.childList === 'undefined' ? true : options.childList,
          characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
        observers.push(observer);
      };

      const init = () => {
        if (!swiper.params.observer) return;

        if (swiper.params.observeParents) {
          const containerParents = swiper.$el.parents();

          for (let i = 0; i < containerParents.length; i += 1) {
            attach(containerParents[i]);
          }
        } // Observe container


        attach(swiper.$el[0], {
          childList: swiper.params.observeSlideChildren
        }); // Observe wrapper

        attach(swiper.$wrapperEl[0], {
          attributes: false
        });
      };

      const destroy = () => {
        observers.forEach(observer => {
          observer.disconnect();
        });
        observers.splice(0, observers.length);
      };

      extendParams({
        observer: false,
        observeParents: false,
        observeSlideChildren: false
      });
      on('init', init);
      on('destroy', destroy);
    }

    /* eslint-disable no-underscore-dangle */
    var eventsEmitter = {
      on(events, handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';
        events.split(' ').forEach(event => {
          if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
          self.eventsListeners[event][method](handler);
        });
        return self;
      },

      once(events, handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;

        function onceHandler(...args) {
          self.off(events, onceHandler);

          if (onceHandler.__emitterProxy) {
            delete onceHandler.__emitterProxy;
          }

          handler.apply(self, args);
        }

        onceHandler.__emitterProxy = handler;
        return self.on(events, onceHandler, priority);
      },

      onAny(handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';

        if (self.eventsAnyListeners.indexOf(handler) < 0) {
          self.eventsAnyListeners[method](handler);
        }

        return self;
      },

      offAny(handler) {
        const self = this;
        if (!self.eventsAnyListeners) return self;
        const index = self.eventsAnyListeners.indexOf(handler);

        if (index >= 0) {
          self.eventsAnyListeners.splice(index, 1);
        }

        return self;
      },

      off(events, handler) {
        const self = this;
        if (!self.eventsListeners) return self;
        events.split(' ').forEach(event => {
          if (typeof handler === 'undefined') {
            self.eventsListeners[event] = [];
          } else if (self.eventsListeners[event]) {
            self.eventsListeners[event].forEach((eventHandler, index) => {
              if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                self.eventsListeners[event].splice(index, 1);
              }
            });
          }
        });
        return self;
      },

      emit(...args) {
        const self = this;
        if (!self.eventsListeners) return self;
        let events;
        let data;
        let context;

        if (typeof args[0] === 'string' || Array.isArray(args[0])) {
          events = args[0];
          data = args.slice(1, args.length);
          context = self;
        } else {
          events = args[0].events;
          data = args[0].data;
          context = args[0].context || self;
        }

        data.unshift(context);
        const eventsArray = Array.isArray(events) ? events : events.split(' ');
        eventsArray.forEach(event => {
          if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
            self.eventsAnyListeners.forEach(eventHandler => {
              eventHandler.apply(context, [event, ...data]);
            });
          }

          if (self.eventsListeners && self.eventsListeners[event]) {
            self.eventsListeners[event].forEach(eventHandler => {
              eventHandler.apply(context, data);
            });
          }
        });
        return self;
      }

    };

    function updateSize() {
      const swiper = this;
      let width;
      let height;
      const $el = swiper.$el;

      if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
        width = swiper.params.width;
      } else {
        width = $el[0].clientWidth;
      }

      if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
        height = swiper.params.height;
      } else {
        height = $el[0].clientHeight;
      }

      if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
        return;
      } // Subtract paddings


      width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
      height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
      if (Number.isNaN(width)) width = 0;
      if (Number.isNaN(height)) height = 0;
      Object.assign(swiper, {
        width,
        height,
        size: swiper.isHorizontal() ? width : height
      });
    }

    function updateSlides() {
      const swiper = this;

      function getDirectionLabel(property) {
        if (swiper.isHorizontal()) {
          return property;
        } // prettier-ignore


        return {
          'width': 'height',
          'margin-top': 'margin-left',
          'margin-bottom ': 'margin-right',
          'margin-left': 'margin-top',
          'margin-right': 'margin-bottom',
          'padding-left': 'padding-top',
          'padding-right': 'padding-bottom',
          'marginRight': 'marginBottom'
        }[property];
      }

      function getDirectionPropertyValue(node, label) {
        return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      }

      const params = swiper.params;
      const {
        $wrapperEl,
        size: swiperSize,
        rtlTranslate: rtl,
        wrongRTL
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
      const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
      const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
      let snapGrid = [];
      const slidesGrid = [];
      const slidesSizesGrid = [];
      let offsetBefore = params.slidesOffsetBefore;

      if (typeof offsetBefore === 'function') {
        offsetBefore = params.slidesOffsetBefore.call(swiper);
      }

      let offsetAfter = params.slidesOffsetAfter;

      if (typeof offsetAfter === 'function') {
        offsetAfter = params.slidesOffsetAfter.call(swiper);
      }

      const previousSnapGridLength = swiper.snapGrid.length;
      const previousSlidesGridLength = swiper.slidesGrid.length;
      let spaceBetween = params.spaceBetween;
      let slidePosition = -offsetBefore;
      let prevSlideSize = 0;
      let index = 0;

      if (typeof swiperSize === 'undefined') {
        return;
      }

      if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
      }

      swiper.virtualSize = -spaceBetween; // reset margins

      if (rtl) slides.css({
        marginLeft: '',
        marginBottom: '',
        marginTop: ''
      });else slides.css({
        marginRight: '',
        marginBottom: '',
        marginTop: ''
      }); // reset cssMode offsets

      if (params.centeredSlides && params.cssMode) {
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
      }

      const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

      if (gridEnabled) {
        swiper.grid.initSlides(slidesLength);
      } // Calc slides


      let slideSize;
      const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
        return typeof params.breakpoints[key].slidesPerView !== 'undefined';
      }).length > 0;

      for (let i = 0; i < slidesLength; i += 1) {
        slideSize = 0;
        const slide = slides.eq(i);

        if (gridEnabled) {
          swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
        }

        if (slide.css('display') === 'none') continue; // eslint-disable-line

        if (params.slidesPerView === 'auto') {
          if (shouldResetSlideSize) {
            slides[i].style[getDirectionLabel('width')] = ``;
          }

          const slideStyles = getComputedStyle(slide[0]);
          const currentTransform = slide[0].style.transform;
          const currentWebKitTransform = slide[0].style.webkitTransform;

          if (currentTransform) {
            slide[0].style.transform = 'none';
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = 'none';
          }

          if (params.roundLengths) {
            slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
          } else {
            // eslint-disable-next-line
            const width = getDirectionPropertyValue(slideStyles, 'width');
            const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
            const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
            const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
            const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
            const boxSizing = slideStyles.getPropertyValue('box-sizing');

            if (boxSizing && boxSizing === 'border-box') {
              slideSize = width + marginLeft + marginRight;
            } else {
              const {
                clientWidth,
                offsetWidth
              } = slide[0];
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
            }
          }

          if (currentTransform) {
            slide[0].style.transform = currentTransform;
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = currentWebKitTransform;
          }

          if (params.roundLengths) slideSize = Math.floor(slideSize);
        } else {
          slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
          if (params.roundLengths) slideSize = Math.floor(slideSize);

          if (slides[i]) {
            slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
          }
        }

        if (slides[i]) {
          slides[i].swiperSlideSize = slideSize;
        }

        slidesSizesGrid.push(slideSize);

        if (params.centeredSlides) {
          slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
          if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
        } else {
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
          slidePosition = slidePosition + slideSize + spaceBetween;
        }

        swiper.virtualSize += slideSize + spaceBetween;
        prevSlideSize = slideSize;
        index += 1;
      }

      swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

      if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
        $wrapperEl.css({
          width: `${swiper.virtualSize + params.spaceBetween}px`
        });
      }

      if (params.setWrapperSize) {
        $wrapperEl.css({
          [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
        });
      }

      if (gridEnabled) {
        swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
      } // Remove last grid elements depending on width


      if (!params.centeredSlides) {
        const newSlidesGrid = [];

        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

          if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
            newSlidesGrid.push(slidesGridItem);
          }
        }

        snapGrid = newSlidesGrid;

        if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
          snapGrid.push(swiper.virtualSize - swiperSize);
        }
      }

      if (snapGrid.length === 0) snapGrid = [0];

      if (params.spaceBetween !== 0) {
        const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
        slides.filter((_, slideIndex) => {
          if (!params.cssMode) return true;

          if (slideIndex === slides.length - 1) {
            return false;
          }

          return true;
        }).css({
          [key]: `${spaceBetween}px`
        });
      }

      if (params.centeredSlides && params.centeredSlidesBounds) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach(slideSizeValue => {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;
        const maxSnap = allSlidesSize - swiperSize;
        snapGrid = snapGrid.map(snap => {
          if (snap < 0) return -offsetBefore;
          if (snap > maxSnap) return maxSnap + offsetAfter;
          return snap;
        });
      }

      if (params.centerInsufficientSlides) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach(slideSizeValue => {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;

        if (allSlidesSize < swiperSize) {
          const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
          snapGrid.forEach((snap, snapIndex) => {
            snapGrid[snapIndex] = snap - allSlidesOffset;
          });
          slidesGrid.forEach((snap, snapIndex) => {
            slidesGrid[snapIndex] = snap + allSlidesOffset;
          });
        }
      }

      Object.assign(swiper, {
        slides,
        snapGrid,
        slidesGrid,
        slidesSizesGrid
      });

      if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
        const addToSnapGrid = -swiper.snapGrid[0];
        const addToSlidesGrid = -swiper.slidesGrid[0];
        swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
        swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
      }

      if (slidesLength !== previousSlidesLength) {
        swiper.emit('slidesLengthChange');
      }

      if (snapGrid.length !== previousSnapGridLength) {
        if (swiper.params.watchOverflow) swiper.checkOverflow();
        swiper.emit('snapGridLengthChange');
      }

      if (slidesGrid.length !== previousSlidesGridLength) {
        swiper.emit('slidesGridLengthChange');
      }

      if (params.watchSlidesProgress) {
        swiper.updateSlidesOffset();
      }
    }

    function updateAutoHeight(speed) {
      const swiper = this;
      const activeSlides = [];
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let newHeight = 0;
      let i;

      if (typeof speed === 'number') {
        swiper.setTransition(speed);
      } else if (speed === true) {
        swiper.setTransition(swiper.params.speed);
      }

      const getSlideByIndex = index => {
        if (isVirtual) {
          return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
        }

        return swiper.slides.eq(index)[0];
      }; // Find slides currently in view


      if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
        if (swiper.params.centeredSlides) {
          swiper.visibleSlides.each(slide => {
            activeSlides.push(slide);
          });
        } else {
          for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
          }
        }
      } else {
        activeSlides.push(getSlideByIndex(swiper.activeIndex));
      } // Find new height from highest slide in view


      for (i = 0; i < activeSlides.length; i += 1) {
        if (typeof activeSlides[i] !== 'undefined') {
          const height = activeSlides[i].offsetHeight;
          newHeight = height > newHeight ? height : newHeight;
        }
      } // Update Height


      if (newHeight) swiper.$wrapperEl.css('height', `${newHeight}px`);
    }

    function updateSlidesOffset() {
      const swiper = this;
      const slides = swiper.slides;

      for (let i = 0; i < slides.length; i += 1) {
        slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
      }
    }

    function updateSlidesProgress(translate = this && this.translate || 0) {
      const swiper = this;
      const params = swiper.params;
      const {
        slides,
        rtlTranslate: rtl
      } = swiper;
      if (slides.length === 0) return;
      if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
      let offsetCenter = -translate;
      if (rtl) offsetCenter = translate; // Visible Slides

      slides.removeClass(params.slideVisibleClass);
      swiper.visibleSlidesIndexes = [];
      swiper.visibleSlides = [];

      for (let i = 0; i < slides.length; i += 1) {
        const slide = slides[i];
        let slideOffset = slide.swiperSlideOffset;

        if (params.cssMode && params.centeredSlides) {
          slideOffset -= slides[0].swiperSlideOffset;
        }

        const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
        const slideBefore = -(offsetCenter - slideOffset);
        const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
        const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

        if (isVisible) {
          swiper.visibleSlides.push(slide);
          swiper.visibleSlidesIndexes.push(i);
          slides.eq(i).addClass(params.slideVisibleClass);
        }

        slide.progress = rtl ? -slideProgress : slideProgress;
      }

      swiper.visibleSlides = $(swiper.visibleSlides);
    }

    function updateProgress(translate) {
      const swiper = this;

      if (typeof translate === 'undefined') {
        const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

        translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
      }

      const params = swiper.params;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      let {
        progress,
        isBeginning,
        isEnd
      } = swiper;
      const wasBeginning = isBeginning;
      const wasEnd = isEnd;

      if (translatesDiff === 0) {
        progress = 0;
        isBeginning = true;
        isEnd = true;
      } else {
        progress = (translate - swiper.minTranslate()) / translatesDiff;
        isBeginning = progress <= 0;
        isEnd = progress >= 1;
      }

      Object.assign(swiper, {
        progress,
        isBeginning,
        isEnd
      });
      if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

      if (isBeginning && !wasBeginning) {
        swiper.emit('reachBeginning toEdge');
      }

      if (isEnd && !wasEnd) {
        swiper.emit('reachEnd toEdge');
      }

      if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
        swiper.emit('fromEdge');
      }

      swiper.emit('progress', progress);
    }

    function updateSlidesClasses() {
      const swiper = this;
      const {
        slides,
        params,
        $wrapperEl,
        activeIndex,
        realIndex
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
      let activeSlide;

      if (isVirtual) {
        activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
      } else {
        activeSlide = slides.eq(activeIndex);
      } // Active classes


      activeSlide.addClass(params.slideActiveClass);

      if (params.loop) {
        // Duplicate to all looped slides
        if (activeSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        }
      } // Next Slide


      let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

      if (params.loop && nextSlide.length === 0) {
        nextSlide = slides.eq(0);
        nextSlide.addClass(params.slideNextClass);
      } // Prev Slide


      let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

      if (params.loop && prevSlide.length === 0) {
        prevSlide = slides.eq(-1);
        prevSlide.addClass(params.slidePrevClass);
      }

      if (params.loop) {
        // Duplicate to all looped slides
        if (nextSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
        }

        if (prevSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
        }
      }

      swiper.emitSlidesClasses();
    }

    function updateActiveIndex(newActiveIndex) {
      const swiper = this;
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
      const {
        slidesGrid,
        snapGrid,
        params,
        activeIndex: previousIndex,
        realIndex: previousRealIndex,
        snapIndex: previousSnapIndex
      } = swiper;
      let activeIndex = newActiveIndex;
      let snapIndex;

      if (typeof activeIndex === 'undefined') {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
              activeIndex = i;
            } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
              activeIndex = i + 1;
            }
          } else if (translate >= slidesGrid[i]) {
            activeIndex = i;
          }
        } // Normalize slideIndex


        if (params.normalizeSlideIndex) {
          if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
        }
      }

      if (snapGrid.indexOf(translate) >= 0) {
        snapIndex = snapGrid.indexOf(translate);
      } else {
        const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
        snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }

      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if (activeIndex === previousIndex) {
        if (snapIndex !== previousSnapIndex) {
          swiper.snapIndex = snapIndex;
          swiper.emit('snapIndexChange');
        }

        return;
      } // Get real index


      const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
      Object.assign(swiper, {
        snapIndex,
        realIndex,
        previousIndex,
        activeIndex
      });
      swiper.emit('activeIndexChange');
      swiper.emit('snapIndexChange');

      if (previousRealIndex !== realIndex) {
        swiper.emit('realIndexChange');
      }

      if (swiper.initialized || swiper.params.runCallbacksOnInit) {
        swiper.emit('slideChange');
      }
    }

    function updateClickedSlide(e) {
      const swiper = this;
      const params = swiper.params;
      const slide = $(e.target).closest(`.${params.slideClass}`)[0];
      let slideFound = false;
      let slideIndex;

      if (slide) {
        for (let i = 0; i < swiper.slides.length; i += 1) {
          if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
          }
        }
      }

      if (slide && slideFound) {
        swiper.clickedSlide = slide;

        if (swiper.virtual && swiper.params.virtual.enabled) {
          swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
        } else {
          swiper.clickedIndex = slideIndex;
        }
      } else {
        swiper.clickedSlide = undefined;
        swiper.clickedIndex = undefined;
        return;
      }

      if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
        swiper.slideToClickedSlide();
      }
    }

    var update = {
      updateSize,
      updateSlides,
      updateAutoHeight,
      updateSlidesOffset,
      updateSlidesProgress,
      updateProgress,
      updateSlidesClasses,
      updateActiveIndex,
      updateClickedSlide
    };

    function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
      const swiper = this;
      const {
        params,
        rtlTranslate: rtl,
        translate,
        $wrapperEl
      } = swiper;

      if (params.virtualTranslate) {
        return rtl ? -translate : translate;
      }

      if (params.cssMode) {
        return translate;
      }

      let currentTranslate = getTranslate($wrapperEl[0], axis);
      if (rtl) currentTranslate = -currentTranslate;
      return currentTranslate || 0;
    }

    function setTranslate(translate, byController) {
      const swiper = this;
      const {
        rtlTranslate: rtl,
        params,
        $wrapperEl,
        wrapperEl,
        progress
      } = swiper;
      let x = 0;
      let y = 0;
      const z = 0;

      if (swiper.isHorizontal()) {
        x = rtl ? -translate : translate;
      } else {
        y = translate;
      }

      if (params.roundLengths) {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      if (params.cssMode) {
        wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
      } else if (!params.virtualTranslate) {
        $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
      }

      swiper.previousTranslate = swiper.translate;
      swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== progress) {
        swiper.updateProgress(translate);
      }

      swiper.emit('setTranslate', swiper.translate, byController);
    }

    function minTranslate() {
      return -this.snapGrid[0];
    }

    function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
    }

    function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
      const swiper = this;
      const {
        params,
        wrapperEl
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return false;
      }

      const minTranslate = swiper.minTranslate();
      const maxTranslate = swiper.maxTranslate();
      let newTranslate;
      if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

      swiper.updateProgress(newTranslate);

      if (params.cssMode) {
        const isH = swiper.isHorizontal();

        if (speed === 0) {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
        } else {
          if (!swiper.support.smoothScroll) {
            animateCSSModeScroll({
              swiper,
              targetPosition: -newTranslate,
              side: isH ? 'left' : 'top'
            });
            return true;
          }

          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -newTranslate,
            behavior: 'smooth'
          });
        }

        return true;
      }

      if (speed === 0) {
        swiper.setTransition(0);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionEnd');
        }
      } else {
        swiper.setTransition(speed);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionStart');
        }

        if (!swiper.animating) {
          swiper.animating = true;

          if (!swiper.onTranslateToWrapperTransitionEnd) {
            swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
              if (!swiper || swiper.destroyed) return;
              if (e.target !== this) return;
              swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
              swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
              swiper.onTranslateToWrapperTransitionEnd = null;
              delete swiper.onTranslateToWrapperTransitionEnd;

              if (runCallbacks) {
                swiper.emit('transitionEnd');
              }
            };
          }

          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
        }
      }

      return true;
    }

    var translate = {
      getTranslate: getSwiperTranslate,
      setTranslate,
      minTranslate,
      maxTranslate,
      translateTo
    };

    function setTransition(duration, byController) {
      const swiper = this;

      if (!swiper.params.cssMode) {
        swiper.$wrapperEl.transition(duration);
      }

      swiper.emit('setTransition', duration, byController);
    }

    function transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step
    }) {
      const {
        activeIndex,
        previousIndex
      } = swiper;
      let dir = direction;

      if (!dir) {
        if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
      }

      swiper.emit(`transition${step}`);

      if (runCallbacks && activeIndex !== previousIndex) {
        if (dir === 'reset') {
          swiper.emit(`slideResetTransition${step}`);
          return;
        }

        swiper.emit(`slideChangeTransition${step}`);

        if (dir === 'next') {
          swiper.emit(`slideNextTransition${step}`);
        } else {
          swiper.emit(`slidePrevTransition${step}`);
        }
      }
    }

    function transitionStart(runCallbacks = true, direction) {
      const swiper = this;
      const {
        params
      } = swiper;
      if (params.cssMode) return;

      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }

      transitionEmit({
        swiper,
        runCallbacks,
        direction,
        step: 'Start'
      });
    }

    function transitionEnd(runCallbacks = true, direction) {
      const swiper = this;
      const {
        params
      } = swiper;
      swiper.animating = false;
      if (params.cssMode) return;
      swiper.setTransition(0);
      transitionEmit({
        swiper,
        runCallbacks,
        direction,
        step: 'End'
      });
    }

    var transition = {
      setTransition,
      transitionStart,
      transitionEnd
    };

    function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
      if (typeof index !== 'number' && typeof index !== 'string') {
        throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
      }

      if (typeof index === 'string') {
        /**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
        const indexAsNumber = parseInt(index, 10);
        /**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

        const isValidNumber = isFinite(indexAsNumber);

        if (!isValidNumber) {
          throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
        } // Knowing that the converted `index` is a valid number,
        // we can update the original argument's value.


        index = indexAsNumber;
      }

      const swiper = this;
      let slideIndex = index;
      if (slideIndex < 0) slideIndex = 0;
      const {
        params,
        snapGrid,
        slidesGrid,
        previousIndex,
        activeIndex,
        rtlTranslate: rtl,
        wrapperEl,
        enabled
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
        return false;
      }

      const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
      let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
        swiper.emit('beforeSlideChangeStart');
      }

      const translate = -snapGrid[snapIndex]; // Update progress

      swiper.updateProgress(translate); // Normalize slideIndex

      if (params.normalizeSlideIndex) {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          const normalizedTranslate = -Math.floor(translate * 100);
          const normalizedGrid = Math.floor(slidesGrid[i] * 100);
          const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
              slideIndex = i;
            } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
              slideIndex = i + 1;
            }
          } else if (normalizedTranslate >= normalizedGrid) {
            slideIndex = i;
          }
        }
      } // Directions locks


      if (swiper.initialized && slideIndex !== activeIndex) {
        if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
          return false;
        }

        if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
          if ((activeIndex || 0) !== slideIndex) return false;
        }
      }

      let direction;
      if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

      if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
        swiper.updateActiveIndex(slideIndex); // Update Height

        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }

        swiper.updateSlidesClasses();

        if (params.effect !== 'slide') {
          swiper.setTranslate(translate);
        }

        if (direction !== 'reset') {
          swiper.transitionStart(runCallbacks, direction);
          swiper.transitionEnd(runCallbacks, direction);
        }

        return false;
      }

      if (params.cssMode) {
        const isH = swiper.isHorizontal();
        const t = rtl ? translate : -translate;

        if (speed === 0) {
          const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

          if (isVirtual) {
            swiper.wrapperEl.style.scrollSnapType = 'none';
            swiper._immediateVirtual = true;
          }

          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

          if (isVirtual) {
            requestAnimationFrame(() => {
              swiper.wrapperEl.style.scrollSnapType = '';
              swiper._swiperImmediateVirtual = false;
            });
          }
        } else {
          if (!swiper.support.smoothScroll) {
            animateCSSModeScroll({
              swiper,
              targetPosition: t,
              side: isH ? 'left' : 'top'
            });
            return true;
          }

          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: t,
            behavior: 'smooth'
          });
        }

        return true;
      }

      if (speed === 0) {
        swiper.setTransition(0);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      } else {
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.transitionStart(runCallbacks, direction);

        if (!swiper.animating) {
          swiper.animating = true;

          if (!swiper.onSlideToWrapperTransitionEnd) {
            swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
              if (!swiper || swiper.destroyed) return;
              if (e.target !== this) return;
              swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
              swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
              swiper.onSlideToWrapperTransitionEnd = null;
              delete swiper.onSlideToWrapperTransitionEnd;
              swiper.transitionEnd(runCallbacks, direction);
            };
          }

          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
        }
      }

      return true;
    }

    function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      let newIndex = index;

      if (swiper.params.loop) {
        newIndex += swiper.loopedSlides;
      }

      return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      const {
        animating,
        enabled,
        params
      } = swiper;
      if (!enabled) return swiper;
      let perGroup = params.slidesPerGroup;

      if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
      }

      const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      const {
        params,
        animating,
        snapGrid,
        slidesGrid,
        rtlTranslate,
        enabled
      } = swiper;
      if (!enabled) return swiper;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      const translate = rtlTranslate ? swiper.translate : -swiper.translate;

      function normalize(val) {
        if (val < 0) return -Math.floor(Math.abs(val));
        return Math.floor(val);
      }

      const normalizedTranslate = normalize(translate);
      const normalizedSnapGrid = snapGrid.map(val => normalize(val));
      let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

      if (typeof prevSnap === 'undefined' && params.cssMode) {
        let prevSnapIndex;
        snapGrid.forEach((snap, snapIndex) => {
          if (normalizedTranslate >= snap) {
            // prevSnap = snap;
            prevSnapIndex = snapIndex;
          }
        });

        if (typeof prevSnapIndex !== 'undefined') {
          prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
      }

      let prevIndex = 0;

      if (typeof prevSnap !== 'undefined') {
        prevIndex = slidesGrid.indexOf(prevSnap);
        if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

        if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
          prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
          prevIndex = Math.max(prevIndex, 0);
        }
      }

      return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
      const swiper = this;
      let index = swiper.activeIndex;
      const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
      const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

      if (translate >= swiper.snapGrid[snapIndex]) {
        // The current translate is on or after the current snap index, so the choice
        // is between the current index and the one after it.
        const currentSnap = swiper.snapGrid[snapIndex];
        const nextSnap = swiper.snapGrid[snapIndex + 1];

        if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
          index += swiper.params.slidesPerGroup;
        }
      } else {
        // The current translate is before the current snap index, so the choice
        // is between the current index and the one before it.
        const prevSnap = swiper.snapGrid[snapIndex - 1];
        const currentSnap = swiper.snapGrid[snapIndex];

        if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
          index -= swiper.params.slidesPerGroup;
        }
      }

      index = Math.max(index, 0);
      index = Math.min(index, swiper.slidesGrid.length - 1);
      return swiper.slideTo(index, speed, runCallbacks, internal);
    }

    function slideToClickedSlide() {
      const swiper = this;
      const {
        params,
        $wrapperEl
      } = swiper;
      const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
      let slideToIndex = swiper.clickedIndex;
      let realIndex;

      if (params.loop) {
        if (swiper.animating) return;
        realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

        if (params.centeredSlides) {
          if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
            swiper.loopFix();
            slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
            nextTick(() => {
              swiper.slideTo(slideToIndex);
            });
          } else {
            swiper.slideTo(slideToIndex);
          }
        } else if (slideToIndex > swiper.slides.length - slidesPerView) {
          swiper.loopFix();
          slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else {
        swiper.slideTo(slideToIndex);
      }
    }

    var slide = {
      slideTo,
      slideToLoop,
      slideNext,
      slidePrev,
      slideReset,
      slideToClosest,
      slideToClickedSlide
    };

    function loopCreate() {
      const swiper = this;
      const document = getDocument();
      const {
        params,
        $wrapperEl
      } = swiper; // Remove duplicated slides

      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
      let slides = $wrapperEl.children(`.${params.slideClass}`);

      if (params.loopFillGroupWithBlank) {
        const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

        if (blankSlidesNum !== params.slidesPerGroup) {
          for (let i = 0; i < blankSlidesNum; i += 1) {
            const blankNode = $(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
            $wrapperEl.append(blankNode);
          }

          slides = $wrapperEl.children(`.${params.slideClass}`);
        }
      }

      if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
      swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
      swiper.loopedSlides += params.loopAdditionalSlides;

      if (swiper.loopedSlides > slides.length) {
        swiper.loopedSlides = slides.length;
      }

      const prependSlides = [];
      const appendSlides = [];
      slides.each((el, index) => {
        const slide = $(el);

        if (index < swiper.loopedSlides) {
          appendSlides.push(el);
        }

        if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
          prependSlides.push(el);
        }

        slide.attr('data-swiper-slide-index', index);
      });

      for (let i = 0; i < appendSlides.length; i += 1) {
        $wrapperEl.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }

      for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
        $wrapperEl.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }
    }

    function loopFix() {
      const swiper = this;
      swiper.emit('beforeLoopFix');
      const {
        activeIndex,
        slides,
        loopedSlides,
        allowSlidePrev,
        allowSlideNext,
        snapGrid,
        rtlTranslate: rtl
      } = swiper;
      let newIndex;
      swiper.allowSlidePrev = true;
      swiper.allowSlideNext = true;
      const snapTranslate = -snapGrid[activeIndex];
      const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

      if (activeIndex < loopedSlides) {
        newIndex = slides.length - loopedSlides * 3 + activeIndex;
        newIndex += loopedSlides;
        const slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      } else if (activeIndex >= slides.length - loopedSlides) {
        // Fix For Positive Oversliding
        newIndex = -slides.length + activeIndex + loopedSlides;
        newIndex += loopedSlides;
        const slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      }

      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit('loopFix');
    }

    function loopDestroy() {
      const swiper = this;
      const {
        $wrapperEl,
        params,
        slides
      } = swiper;
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
      slides.removeAttr('data-swiper-slide-index');
    }

    var loop = {
      loopCreate,
      loopFix,
      loopDestroy
    };

    function setGrabCursor(moving) {
      const swiper = this;
      if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
      const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
      el.style.cursor = 'move';
      el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
      el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
      el.style.cursor = moving ? 'grabbing' : 'grab';
    }

    function unsetGrabCursor() {
      const swiper = this;

      if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
        return;
      }

      swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
    }

    var grabCursor = {
      setGrabCursor,
      unsetGrabCursor
    };

    function closestElement(selector, base = this) {
      function __closestFrom(el) {
        if (!el || el === getDocument() || el === getWindow()) return null;
        if (el.assignedSlot) el = el.assignedSlot;
        const found = el.closest(selector);
        return found || __closestFrom(el.getRootNode().host);
      }

      return __closestFrom(base);
    }

    function onTouchStart(event) {
      const swiper = this;
      const document = getDocument();
      const window = getWindow();
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        enabled
      } = swiper;
      if (!enabled) return;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return;
      }

      if (!swiper.animating && params.cssMode && params.loop) {
        swiper.loopFix();
      }

      let e = event;
      if (e.originalEvent) e = e.originalEvent;
      let $targetEl = $(e.target);

      if (params.touchEventsTarget === 'wrapper') {
        if (!$targetEl.closest(swiper.wrapperEl).length) return;
      }

      data.isTouchEvent = e.type === 'touchstart';
      if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
      if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
      if (data.isTouched && data.isMoved) return; // change target el for shadow root component

      const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

      if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
        $targetEl = $(event.path[0]);
      }

      const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
      const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

      if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
        swiper.allowClick = true;
        return;
      }

      if (params.swipeHandler) {
        if (!$targetEl.closest(params.swipeHandler)[0]) return;
      }

      touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      const startX = touches.currentX;
      const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

      const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
      const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

      if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
        if (edgeSwipeDetection === 'prevent') {
          event.preventDefault();
        } else {
          return;
        }
      }

      Object.assign(data, {
        isTouched: true,
        isMoved: false,
        allowTouchCallbacks: true,
        isScrolling: undefined,
        startMoving: undefined
      });
      touches.startX = startX;
      touches.startY = startY;
      data.touchStartTime = now();
      swiper.allowClick = true;
      swiper.updateSize();
      swiper.swipeDirection = undefined;
      if (params.threshold > 0) data.allowThresholdMove = false;

      if (e.type !== 'touchstart') {
        let preventDefault = true;
        if ($targetEl.is(data.focusableElements)) preventDefault = false;

        if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
          document.activeElement.blur();
        }

        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
          e.preventDefault();
        }
      }

      swiper.emit('touchStart', e);
    }

    function onTouchMove(event) {
      const document = getDocument();
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (!data.isTouched) {
        if (data.startMoving && data.isScrolling) {
          swiper.emit('touchMoveOpposite', e);
        }

        return;
      }

      if (data.isTouchEvent && e.type !== 'touchmove') return;
      const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
      const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
      const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

      if (e.preventedByNestedSwiper) {
        touches.startX = pageX;
        touches.startY = pageY;
        return;
      }

      if (!swiper.allowTouchMove) {
        // isMoved = true;
        swiper.allowClick = false;

        if (data.isTouched) {
          Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY
          });
          data.touchStartTime = now();
        }

        return;
      }

      if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
        if (swiper.isVertical()) {
          // Vertical
          if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
            data.isTouched = false;
            data.isMoved = false;
            return;
          }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
          return;
        }
      }

      if (data.isTouchEvent && document.activeElement) {
        if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
          data.isMoved = true;
          swiper.allowClick = false;
          return;
        }
      }

      if (data.allowTouchCallbacks) {
        swiper.emit('touchMove', e);
      }

      if (e.targetTouches && e.targetTouches.length > 1) return;
      touches.currentX = pageX;
      touches.currentY = pageY;
      const diffX = touches.currentX - touches.startX;
      const diffY = touches.currentY - touches.startY;
      if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

      if (typeof data.isScrolling === 'undefined') {
        let touchAngle;

        if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
          data.isScrolling = false;
        } else {
          // eslint-disable-next-line
          if (diffX * diffX + diffY * diffY >= 25) {
            touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
            data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
          }
        }
      }

      if (data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }

      if (typeof data.startMoving === 'undefined') {
        if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
          data.startMoving = true;
        }
      }

      if (data.isScrolling) {
        data.isTouched = false;
        return;
      }

      if (!data.startMoving) {
        return;
      }

      swiper.allowClick = false;

      if (!params.cssMode && e.cancelable) {
        e.preventDefault();
      }

      if (params.touchMoveStopPropagation && !params.nested) {
        e.stopPropagation();
      }

      if (!data.isMoved) {
        if (params.loop && !params.cssMode) {
          swiper.loopFix();
        }

        data.startTranslate = swiper.getTranslate();
        swiper.setTransition(0);

        if (swiper.animating) {
          swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
        }

        data.allowMomentumBounce = false; // Grab Cursor

        if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
          swiper.setGrabCursor(true);
        }

        swiper.emit('sliderFirstMove', e);
      }

      swiper.emit('sliderMove', e);
      data.isMoved = true;
      let diff = swiper.isHorizontal() ? diffX : diffY;
      touches.diff = diff;
      diff *= params.touchRatio;
      if (rtl) diff = -diff;
      swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
      data.currentTranslate = diff + data.startTranslate;
      let disableParentSwiper = true;
      let resistanceRatio = params.resistanceRatio;

      if (params.touchReleaseOnEdges) {
        resistanceRatio = 0;
      }

      if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }

      if (disableParentSwiper) {
        e.preventedByNestedSwiper = true;
      } // Directions locks


      if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
        data.currentTranslate = data.startTranslate;
      } // Threshold


      if (params.threshold > 0) {
        if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
          if (!data.allowThresholdMove) {
            data.allowThresholdMove = true;
            touches.startX = touches.currentX;
            touches.startY = touches.currentY;
            data.currentTranslate = data.startTranslate;
            touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
            return;
          }
        } else {
          data.currentTranslate = data.startTranslate;
          return;
        }
      }

      if (!params.followFinger || params.cssMode) return; // Update active index in free mode

      if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
        swiper.freeMode.onTouchMove();
      } // Update progress


      swiper.updateProgress(data.currentTranslate); // Update translate

      swiper.setTranslate(data.currentTranslate);
    }

    function onTouchEnd(event) {
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        slidesGrid,
        enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (data.allowTouchCallbacks) {
        swiper.emit('touchEnd', e);
      }

      data.allowTouchCallbacks = false;

      if (!data.isTouched) {
        if (data.isMoved && params.grabCursor) {
          swiper.setGrabCursor(false);
        }

        data.isMoved = false;
        data.startMoving = false;
        return;
      } // Return Grab Cursor


      if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(false);
      } // Time diff


      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

      if (swiper.allowClick) {
        swiper.updateClickedSlide(e);
        swiper.emit('tap click', e);

        if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
          swiper.emit('doubleTap doubleClick', e);
        }
      }

      data.lastClickTime = now();
      nextTick(() => {
        if (!swiper.destroyed) swiper.allowClick = true;
      });

      if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        return;
      }

      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      let currentPos;

      if (params.followFinger) {
        currentPos = rtl ? swiper.translate : -swiper.translate;
      } else {
        currentPos = -data.currentTranslate;
      }

      if (params.cssMode) {
        return;
      }

      if (swiper.params.freeMode && params.freeMode.enabled) {
        swiper.freeMode.onTouchEnd({
          currentPos
        });
        return;
      } // Find current slide


      let stopIndex = 0;
      let groupSize = swiper.slidesSizesGrid[0];

      for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
        const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

        if (typeof slidesGrid[i + increment] !== 'undefined') {
          if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
            stopIndex = i;
            groupSize = slidesGrid[i + increment] - slidesGrid[i];
          }
        } else if (currentPos >= slidesGrid[i]) {
          stopIndex = i;
          groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
        }
      } // Find current slide size


      const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
      const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

      if (timeDiff > params.longSwipesMs) {
        // Long touches
        if (!params.longSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (swiper.swipeDirection === 'next') {
          if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
        }

        if (swiper.swipeDirection === 'prev') {
          if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
        }
      } else {
        // Short swipes
        if (!params.shortSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

        if (!isNavButtonTarget) {
          if (swiper.swipeDirection === 'next') {
            swiper.slideTo(stopIndex + increment);
          }

          if (swiper.swipeDirection === 'prev') {
            swiper.slideTo(stopIndex);
          }
        } else if (e.target === swiper.navigation.nextEl) {
          swiper.slideTo(stopIndex + increment);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    }

    function onResize() {
      const swiper = this;
      const {
        params,
        el
      } = swiper;
      if (el && el.offsetWidth === 0) return; // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      } // Save locks


      const {
        allowSlideNext,
        allowSlidePrev,
        snapGrid
      } = swiper; // Disable locks on resize

      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateSlidesClasses();

      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
        swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.run();
      } // Return locks after resize


      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;

      if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
    }

    function onClick(e) {
      const swiper = this;
      if (!swiper.enabled) return;

      if (!swiper.allowClick) {
        if (swiper.params.preventClicks) e.preventDefault();

        if (swiper.params.preventClicksPropagation && swiper.animating) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    }

    function onScroll() {
      const swiper = this;
      const {
        wrapperEl,
        rtlTranslate,
        enabled
      } = swiper;
      if (!enabled) return;
      swiper.previousTranslate = swiper.translate;

      if (swiper.isHorizontal()) {
        swiper.translate = -wrapperEl.scrollLeft;
      } else {
        swiper.translate = -wrapperEl.scrollTop;
      } // eslint-disable-next-line


      if (swiper.translate === -0) swiper.translate = 0;
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== swiper.progress) {
        swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
      }

      swiper.emit('setTranslate', swiper.translate, false);
    }

    let dummyEventAttached = false;

    function dummyEventListener() {}

    const events = (swiper, method) => {
      const document = getDocument();
      const {
        params,
        touchEvents,
        el,
        wrapperEl,
        device,
        support
      } = swiper;
      const capture = !!params.nested;
      const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
      const swiperMethod = method; // Touch Events

      if (!support.touch) {
        el[domMethod](touchEvents.start, swiper.onTouchStart, false);
        document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
        document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
      } else {
        const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
        el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
          passive: false,
          capture
        } : capture);
        el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

        if (touchEvents.cancel) {
          el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
      } // Prevent Links Clicks


      if (params.preventClicks || params.preventClicksPropagation) {
        el[domMethod]('click', swiper.onClick, true);
      }

      if (params.cssMode) {
        wrapperEl[domMethod]('scroll', swiper.onScroll);
      } // Resize handler


      if (params.updateOnWindowResize) {
        swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
      } else {
        swiper[swiperMethod]('observerUpdate', onResize, true);
      }
    };

    function attachEvents() {
      const swiper = this;
      const document = getDocument();
      const {
        params,
        support
      } = swiper;
      swiper.onTouchStart = onTouchStart.bind(swiper);
      swiper.onTouchMove = onTouchMove.bind(swiper);
      swiper.onTouchEnd = onTouchEnd.bind(swiper);

      if (params.cssMode) {
        swiper.onScroll = onScroll.bind(swiper);
      }

      swiper.onClick = onClick.bind(swiper);

      if (support.touch && !dummyEventAttached) {
        document.addEventListener('touchstart', dummyEventListener);
        dummyEventAttached = true;
      }

      events(swiper, 'on');
    }

    function detachEvents() {
      const swiper = this;
      events(swiper, 'off');
    }

    var events$1 = {
      attachEvents,
      detachEvents
    };

    const isGridEnabled = (swiper, params) => {
      return swiper.grid && params.grid && params.grid.rows > 1;
    };

    function setBreakpoint() {
      const swiper = this;
      const {
        activeIndex,
        initialized,
        loopedSlides = 0,
        params,
        $el
      } = swiper;
      const breakpoints = params.breakpoints;
      if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

      const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
      if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
      const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
      const breakpointParams = breakpointOnlyParams || swiper.originalParams;
      const wasMultiRow = isGridEnabled(swiper, params);
      const isMultiRow = isGridEnabled(swiper, breakpointParams);
      const wasEnabled = params.enabled;

      if (wasMultiRow && !isMultiRow) {
        $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
        swiper.emitContainerClasses();
      } else if (!wasMultiRow && isMultiRow) {
        $el.addClass(`${params.containerModifierClass}grid`);

        if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
          $el.addClass(`${params.containerModifierClass}grid-column`);
        }

        swiper.emitContainerClasses();
      }

      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

      if (directionChanged && initialized) {
        swiper.changeDirection();
      }

      extend$1(swiper.params, breakpointParams);
      const isEnabled = swiper.params.enabled;
      Object.assign(swiper, {
        allowTouchMove: swiper.params.allowTouchMove,
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev
      });

      if (wasEnabled && !isEnabled) {
        swiper.disable();
      } else if (!wasEnabled && isEnabled) {
        swiper.enable();
      }

      swiper.currentBreakpoint = breakpoint;
      swiper.emit('_beforeBreakpoint', breakpointParams);

      if (needsReLoop && initialized) {
        swiper.loopDestroy();
        swiper.loopCreate();
        swiper.updateSlides();
        swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
      }

      swiper.emit('breakpoint', breakpointParams);
    }

    function getBreakpoint(breakpoints, base = 'window', containerEl) {
      if (!breakpoints || base === 'container' && !containerEl) return undefined;
      let breakpoint = false;
      const window = getWindow();
      const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
      const points = Object.keys(breakpoints).map(point => {
        if (typeof point === 'string' && point.indexOf('@') === 0) {
          const minRatio = parseFloat(point.substr(1));
          const value = currentHeight * minRatio;
          return {
            value,
            point
          };
        }

        return {
          value: point,
          point
        };
      });
      points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

      for (let i = 0; i < points.length; i += 1) {
        const {
          point,
          value
        } = points[i];

        if (base === 'window') {
          if (window.matchMedia(`(min-width: ${value}px)`).matches) {
            breakpoint = point;
          }
        } else if (value <= containerEl.clientWidth) {
          breakpoint = point;
        }
      }

      return breakpoint || 'max';
    }

    var breakpoints = {
      setBreakpoint,
      getBreakpoint
    };

    function prepareClasses(entries, prefix) {
      const resultClasses = [];
      entries.forEach(item => {
        if (typeof item === 'object') {
          Object.keys(item).forEach(classNames => {
            if (item[classNames]) {
              resultClasses.push(prefix + classNames);
            }
          });
        } else if (typeof item === 'string') {
          resultClasses.push(prefix + item);
        }
      });
      return resultClasses;
    }

    function addClasses() {
      const swiper = this;
      const {
        classNames,
        params,
        rtl,
        $el,
        device,
        support
      } = swiper; // prettier-ignore

      const suffixes = prepareClasses(['initialized', params.direction, {
        'pointer-events': !support.touch
      }, {
        'free-mode': swiper.params.freeMode && params.freeMode.enabled
      }, {
        'autoheight': params.autoHeight
      }, {
        'rtl': rtl
      }, {
        'grid': params.grid && params.grid.rows > 1
      }, {
        'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
      }, {
        'android': device.android
      }, {
        'ios': device.ios
      }, {
        'css-mode': params.cssMode
      }, {
        'centered': params.cssMode && params.centeredSlides
      }], params.containerModifierClass);
      classNames.push(...suffixes);
      $el.addClass([...classNames].join(' '));
      swiper.emitContainerClasses();
    }

    function removeClasses() {
      const swiper = this;
      const {
        $el,
        classNames
      } = swiper;
      $el.removeClass(classNames.join(' '));
      swiper.emitContainerClasses();
    }

    var classes = {
      addClasses,
      removeClasses
    };

    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
      const window = getWindow();
      let image;

      function onReady() {
        if (callback) callback();
      }

      const isPicture = $(imageEl).parent('picture')[0];

      if (!isPicture && (!imageEl.complete || !checkForComplete)) {
        if (src) {
          image = new window.Image();
          image.onload = onReady;
          image.onerror = onReady;

          if (sizes) {
            image.sizes = sizes;
          }

          if (srcset) {
            image.srcset = srcset;
          }

          if (src) {
            image.src = src;
          }
        } else {
          onReady();
        }
      } else {
        // image already loaded...
        onReady();
      }
    }

    function preloadImages() {
      const swiper = this;
      swiper.imagesToLoad = swiper.$el.find('img');

      function onReady() {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
        if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

        if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
          if (swiper.params.updateOnImagesReady) swiper.update();
          swiper.emit('imagesReady');
        }
      }

      for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
        const imageEl = swiper.imagesToLoad[i];
        swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
      }
    }

    var images = {
      loadImage,
      preloadImages
    };

    function checkOverflow() {
      const swiper = this;
      const {
        isLocked: wasLocked,
        params
      } = swiper;
      const {
        slidesOffsetBefore
      } = params;

      if (slidesOffsetBefore) {
        const lastSlideIndex = swiper.slides.length - 1;
        const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
        swiper.isLocked = swiper.size > lastSlideRightEdge;
      } else {
        swiper.isLocked = swiper.snapGrid.length === 1;
      }

      if (params.allowSlideNext === true) {
        swiper.allowSlideNext = !swiper.isLocked;
      }

      if (params.allowSlidePrev === true) {
        swiper.allowSlidePrev = !swiper.isLocked;
      }

      if (wasLocked && wasLocked !== swiper.isLocked) {
        swiper.isEnd = false;
      }

      if (wasLocked !== swiper.isLocked) {
        swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
      }
    }

    var checkOverflow$1 = {
      checkOverflow
    };

    var defaults = {
      init: true,
      direction: 'horizontal',
      touchEventsTarget: 'wrapper',
      initialSlide: 0,
      speed: 300,
      cssMode: false,
      updateOnWindowResize: true,
      resizeObserver: true,
      nested: false,
      createElements: false,
      enabled: true,
      focusableElements: 'input, select, option, textarea, button, video, label',
      // Overrides
      width: null,
      height: null,
      //
      preventInteractionOnTransition: false,
      // ssr
      userAgent: null,
      url: null,
      // To support iOS's swipe-to-go-back gesture (when being used in-app).
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      // Autoheight
      autoHeight: false,
      // Set wrapper width
      setWrapperSize: false,
      // Virtual Translate
      virtualTranslate: false,
      // Effects
      effect: 'slide',
      // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
      // Breakpoints
      breakpoints: undefined,
      breakpointsBase: 'window',
      // Slides grid
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      slidesPerGroupAuto: false,
      centeredSlides: false,
      centeredSlidesBounds: false,
      slidesOffsetBefore: 0,
      // in px
      slidesOffsetAfter: 0,
      // in px
      normalizeSlideIndex: true,
      centerInsufficientSlides: false,
      // Disable swiper and hide navigation when container not overflow
      watchOverflow: true,
      // Round length
      roundLengths: false,
      // Touches
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 0,
      touchMoveStopPropagation: false,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchReleaseOnEdges: false,
      // Unique Navigation Elements
      uniqueNavElements: true,
      // Resistance
      resistance: true,
      resistanceRatio: 0.85,
      // Progress
      watchSlidesProgress: false,
      // Cursor
      grabCursor: false,
      // Clicks
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      // Images
      preloadImages: true,
      updateOnImagesReady: true,
      // loop
      loop: false,
      loopAdditionalSlides: 0,
      loopedSlides: null,
      loopFillGroupWithBlank: false,
      loopPreventsSlide: true,
      // Swiping/no swiping
      allowSlidePrev: true,
      allowSlideNext: true,
      swipeHandler: null,
      // '.swipe-handler',
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      noSwipingSelector: null,
      // Passive Listeners
      passiveListeners: true,
      // NS
      containerModifierClass: 'swiper-',
      // NEW
      slideClass: 'swiper-slide',
      slideBlankClass: 'swiper-slide-invisible-blank',
      slideActiveClass: 'swiper-slide-active',
      slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
      slideVisibleClass: 'swiper-slide-visible',
      slideDuplicateClass: 'swiper-slide-duplicate',
      slideNextClass: 'swiper-slide-next',
      slideDuplicateNextClass: 'swiper-slide-duplicate-next',
      slidePrevClass: 'swiper-slide-prev',
      slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
      wrapperClass: 'swiper-wrapper',
      // Callbacks
      runCallbacksOnInit: true,
      // Internals
      _emitClasses: false
    };

    function moduleExtendParams(params, allModulesParams) {
      return function extendParams(obj = {}) {
        const moduleParamName = Object.keys(obj)[0];
        const moduleParams = obj[moduleParamName];

        if (typeof moduleParams !== 'object' || moduleParams === null) {
          extend$1(allModulesParams, obj);
          return;
        }

        if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
          params[moduleParamName] = {
            auto: true
          };
        }

        if (!(moduleParamName in params && 'enabled' in moduleParams)) {
          extend$1(allModulesParams, obj);
          return;
        }

        if (params[moduleParamName] === true) {
          params[moduleParamName] = {
            enabled: true
          };
        }

        if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
          params[moduleParamName].enabled = true;
        }

        if (!params[moduleParamName]) params[moduleParamName] = {
          enabled: false
        };
        extend$1(allModulesParams, obj);
      };
    }

    /* eslint no-param-reassign: "off" */
    const prototypes = {
      eventsEmitter,
      update,
      translate,
      transition,
      slide,
      loop,
      grabCursor,
      events: events$1,
      breakpoints,
      checkOverflow: checkOverflow$1,
      classes,
      images
    };
    const extendedDefaults = {};

    class Swiper$1 {
      constructor(...args) {
        let el;
        let params;

        if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
          params = args[0];
        } else {
          [el, params] = args;
        }

        if (!params) params = {};
        params = extend$1({}, params);
        if (el && !params.el) params.el = el;

        if (params.el && $(params.el).length > 1) {
          const swipers = [];
          $(params.el).each(containerEl => {
            const newParams = extend$1({}, params, {
              el: containerEl
            });
            swipers.push(new Swiper$1(newParams));
          });
          return swipers;
        } // Swiper Instance


        const swiper = this;
        swiper.__swiper__ = true;
        swiper.support = getSupport();
        swiper.device = getDevice({
          userAgent: params.userAgent
        });
        swiper.browser = getBrowser();
        swiper.eventsListeners = {};
        swiper.eventsAnyListeners = [];
        swiper.modules = [...swiper.__modules__];

        if (params.modules && Array.isArray(params.modules)) {
          swiper.modules.push(...params.modules);
        }

        const allModulesParams = {};
        swiper.modules.forEach(mod => {
          mod({
            swiper,
            extendParams: moduleExtendParams(params, allModulesParams),
            on: swiper.on.bind(swiper),
            once: swiper.once.bind(swiper),
            off: swiper.off.bind(swiper),
            emit: swiper.emit.bind(swiper)
          });
        }); // Extend defaults with modules params

        const swiperParams = extend$1({}, defaults, allModulesParams); // Extend defaults with passed params

        swiper.params = extend$1({}, swiperParams, extendedDefaults, params);
        swiper.originalParams = extend$1({}, swiper.params);
        swiper.passedParams = extend$1({}, params); // add event listeners

        if (swiper.params && swiper.params.on) {
          Object.keys(swiper.params.on).forEach(eventName => {
            swiper.on(eventName, swiper.params.on[eventName]);
          });
        }

        if (swiper.params && swiper.params.onAny) {
          swiper.onAny(swiper.params.onAny);
        } // Save Dom lib


        swiper.$ = $; // Extend Swiper

        Object.assign(swiper, {
          enabled: swiper.params.enabled,
          el,
          // Classes
          classNames: [],
          // Slides
          slides: $(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],

          // isDirection
          isHorizontal() {
            return swiper.params.direction === 'horizontal';
          },

          isVertical() {
            return swiper.params.direction === 'vertical';
          },

          // Indexes
          activeIndex: 0,
          realIndex: 0,
          //
          isBeginning: true,
          isEnd: false,
          // Props
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: false,
          // Locks
          allowSlideNext: swiper.params.allowSlideNext,
          allowSlidePrev: swiper.params.allowSlidePrev,
          // Touch Events
          touchEvents: function touchEvents() {
            const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            const desktop = ['pointerdown', 'pointermove', 'pointerup'];
            swiper.touchEventsTouch = {
              start: touch[0],
              move: touch[1],
              end: touch[2],
              cancel: touch[3]
            };
            swiper.touchEventsDesktop = {
              start: desktop[0],
              move: desktop[1],
              end: desktop[2]
            };
            return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
          }(),
          touchEventsData: {
            isTouched: undefined,
            isMoved: undefined,
            allowTouchCallbacks: undefined,
            touchStartTime: undefined,
            isScrolling: undefined,
            currentTranslate: undefined,
            startTranslate: undefined,
            allowThresholdMove: undefined,
            // Form elements to match
            focusableElements: swiper.params.focusableElements,
            // Last click time
            lastClickTime: now(),
            clickTimeout: undefined,
            // Velocities
            velocities: [],
            allowMomentumBounce: undefined,
            isTouchEvent: undefined,
            startMoving: undefined
          },
          // Clicks
          allowClick: true,
          // Touches
          allowTouchMove: swiper.params.allowTouchMove,
          touches: {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
          },
          // Images
          imagesToLoad: [],
          imagesLoaded: 0
        });
        swiper.emit('_swiper'); // Init

        if (swiper.params.init) {
          swiper.init();
        } // Return app instance


        return swiper;
      }

      enable() {
        const swiper = this;
        if (swiper.enabled) return;
        swiper.enabled = true;

        if (swiper.params.grabCursor) {
          swiper.setGrabCursor();
        }

        swiper.emit('enable');
      }

      disable() {
        const swiper = this;
        if (!swiper.enabled) return;
        swiper.enabled = false;

        if (swiper.params.grabCursor) {
          swiper.unsetGrabCursor();
        }

        swiper.emit('disable');
      }

      setProgress(progress, speed) {
        const swiper = this;
        progress = Math.min(Math.max(progress, 0), 1);
        const min = swiper.minTranslate();
        const max = swiper.maxTranslate();
        const current = (max - min) * progress + min;
        swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      emitContainerClasses() {
        const swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        const cls = swiper.el.className.split(' ').filter(className => {
          return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
        });
        swiper.emit('_containerClasses', cls.join(' '));
      }

      getSlideClasses(slideEl) {
        const swiper = this;
        return slideEl.className.split(' ').filter(className => {
          return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
        }).join(' ');
      }

      emitSlidesClasses() {
        const swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        const updates = [];
        swiper.slides.each(slideEl => {
          const classNames = swiper.getSlideClasses(slideEl);
          updates.push({
            slideEl,
            classNames
          });
          swiper.emit('_slideClass', slideEl, classNames);
        });
        swiper.emit('_slideClasses', updates);
      }

      slidesPerViewDynamic(view = 'current', exact = false) {
        const swiper = this;
        const {
          params,
          slides,
          slidesGrid,
          slidesSizesGrid,
          size: swiperSize,
          activeIndex
        } = swiper;
        let spv = 1;

        if (params.centeredSlides) {
          let slideSize = slides[activeIndex].swiperSlideSize;
          let breakLoop;

          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }

          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }
        } else {
          // eslint-disable-next-line
          if (view === 'current') {
            for (let i = activeIndex + 1; i < slides.length; i += 1) {
              const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

              if (slideInView) {
                spv += 1;
              }
            }
          } else {
            // previous
            for (let i = activeIndex - 1; i >= 0; i -= 1) {
              const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

              if (slideInView) {
                spv += 1;
              }
            }
          }
        }

        return spv;
      }

      update() {
        const swiper = this;
        if (!swiper || swiper.destroyed) return;
        const {
          snapGrid,
          params
        } = swiper; // Breakpoints

        if (params.breakpoints) {
          swiper.setBreakpoint();
        }

        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateProgress();
        swiper.updateSlidesClasses();

        function setTranslate() {
          const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
          const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
          swiper.setTranslate(newTranslate);
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }

        let translated;

        if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
          setTranslate();

          if (swiper.params.autoHeight) {
            swiper.updateAutoHeight();
          }
        } else {
          if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
            translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
          } else {
            translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
          }

          if (!translated) {
            setTranslate();
          }
        }

        if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
          swiper.checkOverflow();
        }

        swiper.emit('update');
      }

      changeDirection(newDirection, needUpdate = true) {
        const swiper = this;
        const currentDirection = swiper.params.direction;

        if (!newDirection) {
          // eslint-disable-next-line
          newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
        }

        if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
          return swiper;
        }

        swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
        swiper.emitContainerClasses();
        swiper.params.direction = newDirection;
        swiper.slides.each(slideEl => {
          if (newDirection === 'vertical') {
            slideEl.style.width = '';
          } else {
            slideEl.style.height = '';
          }
        });
        swiper.emit('changeDirection');
        if (needUpdate) swiper.update();
        return swiper;
      }

      mount(el) {
        const swiper = this;
        if (swiper.mounted) return true; // Find el

        const $el = $(el || swiper.params.el);
        el = $el[0];

        if (!el) {
          return false;
        }

        el.swiper = swiper;

        const getWrapperSelector = () => {
          return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
        };

        const getWrapper = () => {
          if (el && el.shadowRoot && el.shadowRoot.querySelector) {
            const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

            res.children = options => $el.children(options);

            return res;
          }

          return $el.children(getWrapperSelector());
        }; // Find Wrapper


        let $wrapperEl = getWrapper();

        if ($wrapperEl.length === 0 && swiper.params.createElements) {
          const document = getDocument();
          const wrapper = document.createElement('div');
          $wrapperEl = $(wrapper);
          wrapper.className = swiper.params.wrapperClass;
          $el.append(wrapper);
          $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
            $wrapperEl.append(slideEl);
          });
        }

        Object.assign(swiper, {
          $el,
          el,
          $wrapperEl,
          wrapperEl: $wrapperEl[0],
          mounted: true,
          // RTL
          rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
          rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
          wrongRTL: $wrapperEl.css('display') === '-webkit-box'
        });
        return true;
      }

      init(el) {
        const swiper = this;
        if (swiper.initialized) return swiper;
        const mounted = swiper.mount(el);
        if (mounted === false) return swiper;
        swiper.emit('beforeInit'); // Set breakpoint

        if (swiper.params.breakpoints) {
          swiper.setBreakpoint();
        } // Add Classes


        swiper.addClasses(); // Create loop

        if (swiper.params.loop) {
          swiper.loopCreate();
        } // Update size


        swiper.updateSize(); // Update slides

        swiper.updateSlides();

        if (swiper.params.watchOverflow) {
          swiper.checkOverflow();
        } // Set Grab Cursor


        if (swiper.params.grabCursor && swiper.enabled) {
          swiper.setGrabCursor();
        }

        if (swiper.params.preloadImages) {
          swiper.preloadImages();
        } // Slide To Initial Slide


        if (swiper.params.loop) {
          swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
        } else {
          swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
        } // Attach events


        swiper.attachEvents(); // Init Flag

        swiper.initialized = true; // Emit

        swiper.emit('init');
        swiper.emit('afterInit');
        return swiper;
      }

      destroy(deleteInstance = true, cleanStyles = true) {
        const swiper = this;
        const {
          params,
          $el,
          $wrapperEl,
          slides
        } = swiper;

        if (typeof swiper.params === 'undefined' || swiper.destroyed) {
          return null;
        }

        swiper.emit('beforeDestroy'); // Init Flag

        swiper.initialized = false; // Detach events

        swiper.detachEvents(); // Destroy loop

        if (params.loop) {
          swiper.loopDestroy();
        } // Cleanup styles


        if (cleanStyles) {
          swiper.removeClasses();
          $el.removeAttr('style');
          $wrapperEl.removeAttr('style');

          if (slides && slides.length) {
            slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
          }
        }

        swiper.emit('destroy'); // Detach emitter events

        Object.keys(swiper.eventsListeners).forEach(eventName => {
          swiper.off(eventName);
        });

        if (deleteInstance !== false) {
          swiper.$el[0].swiper = null;
          deleteProps(swiper);
        }

        swiper.destroyed = true;
        return null;
      }

      static extendDefaults(newDefaults) {
        extend$1(extendedDefaults, newDefaults);
      }

      static get extendedDefaults() {
        return extendedDefaults;
      }

      static get defaults() {
        return defaults;
      }

      static installModule(mod) {
        if (!Swiper$1.prototype.__modules__) Swiper$1.prototype.__modules__ = [];
        const modules = Swiper$1.prototype.__modules__;

        if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
          modules.push(mod);
        }
      }

      static use(module) {
        if (Array.isArray(module)) {
          module.forEach(m => Swiper$1.installModule(m));
          return Swiper$1;
        }

        Swiper$1.installModule(module);
        return Swiper$1;
      }

    }

    Object.keys(prototypes).forEach(prototypeGroup => {
      Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
        Swiper$1.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
      });
    });
    Swiper$1.use([Resize, Observer]);

    function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
      const document = getDocument();

      if (swiper.params.createElements) {
        Object.keys(checkProps).forEach(key => {
          if (!params[key] && params.auto === true) {
            let element = swiper.$el.children(`.${checkProps[key]}`)[0];

            if (!element) {
              element = document.createElement('div');
              element.className = checkProps[key];
              swiper.$el.append(element);
            }

            params[key] = element;
            originalParams[key] = element;
          }
        });
      }

      return params;
    }

    function Navigation({
      swiper,
      extendParams,
      on,
      emit
    }) {
      extendParams({
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: false,
          disabledClass: 'swiper-button-disabled',
          hiddenClass: 'swiper-button-hidden',
          lockClass: 'swiper-button-lock'
        }
      });
      swiper.navigation = {
        nextEl: null,
        $nextEl: null,
        prevEl: null,
        $prevEl: null
      };

      function getEl(el) {
        let $el;

        if (el) {
          $el = $(el);

          if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
            $el = swiper.$el.find(el);
          }
        }

        return $el;
      }

      function toggleEl($el, disabled) {
        const params = swiper.params.navigation;

        if ($el && $el.length > 0) {
          $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
          if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

          if (swiper.params.watchOverflow && swiper.enabled) {
            $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
          }
        }
      }

      function update() {
        // Update Navigation Buttons
        if (swiper.params.loop) return;
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;
        toggleEl($prevEl, swiper.isBeginning);
        toggleEl($nextEl, swiper.isEnd);
      }

      function onPrevClick(e) {
        e.preventDefault();
        if (swiper.isBeginning && !swiper.params.loop) return;
        swiper.slidePrev();
      }

      function onNextClick(e) {
        e.preventDefault();
        if (swiper.isEnd && !swiper.params.loop) return;
        swiper.slideNext();
      }

      function init() {
        const params = swiper.params.navigation;
        swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
          nextEl: 'swiper-button-next',
          prevEl: 'swiper-button-prev'
        });
        if (!(params.nextEl || params.prevEl)) return;
        const $nextEl = getEl(params.nextEl);
        const $prevEl = getEl(params.prevEl);

        if ($nextEl && $nextEl.length > 0) {
          $nextEl.on('click', onNextClick);
        }

        if ($prevEl && $prevEl.length > 0) {
          $prevEl.on('click', onPrevClick);
        }

        Object.assign(swiper.navigation, {
          $nextEl,
          nextEl: $nextEl && $nextEl[0],
          $prevEl,
          prevEl: $prevEl && $prevEl[0]
        });

        if (!swiper.enabled) {
          if ($nextEl) $nextEl.addClass(params.lockClass);
          if ($prevEl) $prevEl.addClass(params.lockClass);
        }
      }

      function destroy() {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($nextEl && $nextEl.length) {
          $nextEl.off('click', onNextClick);
          $nextEl.removeClass(swiper.params.navigation.disabledClass);
        }

        if ($prevEl && $prevEl.length) {
          $prevEl.off('click', onPrevClick);
          $prevEl.removeClass(swiper.params.navigation.disabledClass);
        }
      }

      on('init', () => {
        init();
        update();
      });
      on('toEdge fromEdge lock unlock', () => {
        update();
      });
      on('destroy', () => {
        destroy();
      });
      on('enable disable', () => {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($nextEl) {
          $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
        }

        if ($prevEl) {
          $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
        }
      });
      on('click', (_s, e) => {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;
        const targetEl = e.target;

        if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
          if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
          let isHidden;

          if ($nextEl) {
            isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
          } else if ($prevEl) {
            isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
          }

          if (isHidden === true) {
            emit('navigationShow');
          } else {
            emit('navigationHide');
          }

          if ($nextEl) {
            $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
          }

          if ($prevEl) {
            $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
          }
        }
      });
      Object.assign(swiper.navigation, {
        update,
        init,
        destroy
      });
    }

    function isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function extend(target, src) {
      const noExtend = ['__proto__', 'constructor', 'prototype'];
      Object.keys(src).filter(key => noExtend.indexOf(key) < 0).forEach(key => {
        if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
          if (src[key].__swiper__) target[key] = src[key];else extend(target[key], src[key]);
        } else {
          target[key] = src[key];
        }
      });
    }

    function needsNavigation(params = {}) {
      return params.navigation && typeof params.navigation.nextEl === 'undefined' && typeof params.navigation.prevEl === 'undefined';
    }

    function needsPagination(params = {}) {
      return params.pagination && typeof params.pagination.el === 'undefined';
    }

    function needsScrollbar(params = {}) {
      return params.scrollbar && typeof params.scrollbar.el === 'undefined';
    }

    function uniqueClasses(classNames = '') {
      const classes = classNames.split(' ').map(c => c.trim()).filter(c => !!c);
      const unique = [];
      classes.forEach(c => {
        if (unique.indexOf(c) < 0) unique.push(c);
      });
      return unique.join(' ');
    }

    /* underscore in name -> watch for changes */
    const paramsList = ['modules', 'init', '_direction', 'touchEventsTarget', 'initialSlide', '_speed', 'cssMode', 'updateOnWindowResize', 'resizeObserver', 'nested', 'focusableElements', '_enabled', '_width', '_height', 'preventInteractionOnTransition', 'userAgent', 'url', '_edgeSwipeDetection', '_edgeSwipeThreshold', '_freeMode', '_autoHeight', 'setWrapperSize', 'virtualTranslate', '_effect', 'breakpoints', '_spaceBetween', '_slidesPerView', '_grid', '_slidesPerGroup', '_slidesPerGroupSkip', '_slidesPerGroupAuto', '_centeredSlides', '_centeredSlidesBounds', '_slidesOffsetBefore', '_slidesOffsetAfter', 'normalizeSlideIndex', '_centerInsufficientSlides', '_watchOverflow', 'roundLengths', 'touchRatio', 'touchAngle', 'simulateTouch', '_shortSwipes', '_longSwipes', 'longSwipesRatio', 'longSwipesMs', '_followFinger', 'allowTouchMove', '_threshold', 'touchMoveStopPropagation', 'touchStartPreventDefault', 'touchStartForcePreventDefault', 'touchReleaseOnEdges', 'uniqueNavElements', '_resistance', '_resistanceRatio', '_watchSlidesProgress', '_grabCursor', 'preventClicks', 'preventClicksPropagation', '_slideToClickedSlide', '_preloadImages', 'updateOnImagesReady', '_loop', '_loopAdditionalSlides', '_loopedSlides', '_loopFillGroupWithBlank', 'loopPreventsSlide', '_allowSlidePrev', '_allowSlideNext', '_swipeHandler', '_noSwiping', 'noSwipingClass', 'noSwipingSelector', 'passiveListeners', 'containerModifierClass', 'slideClass', 'slideBlankClass', 'slideActiveClass', 'slideDuplicateActiveClass', 'slideVisibleClass', 'slideDuplicateClass', 'slideNextClass', 'slideDuplicateNextClass', 'slidePrevClass', 'slideDuplicatePrevClass', 'wrapperClass', 'runCallbacksOnInit', 'observer', 'observeParents', 'observeSlideChildren', // modules
    'a11y', 'autoplay', '_controller', 'coverflowEffect', 'cubeEffect', 'fadeEffect', 'flipEffect', 'creativeEffect', 'cardsEffect', 'hashNavigation', 'history', 'keyboard', 'lazy', 'mousewheel', '_navigation', '_pagination', 'parallax', '_scrollbar', '_thumbs', '_virtual', 'zoom'];

    function getParams(obj = {}) {
      const params = {
        on: {}
      };
      const passedParams = {};
      extend(params, Swiper$1.defaults);
      extend(params, Swiper$1.extendedDefaults);
      params._emitClasses = true;
      params.init = false;
      const rest = {};
      const allowedParams = paramsList.map(key => key.replace(/_/, ''));
      Object.keys(obj).forEach(key => {
        if (allowedParams.indexOf(key) >= 0) {
          if (isObject(obj[key])) {
            params[key] = {};
            passedParams[key] = {};
            extend(params[key], obj[key]);
            extend(passedParams[key], obj[key]);
          } else {
            params[key] = obj[key];
            passedParams[key] = obj[key];
          }
        } else if (key.search(/on[A-Z]/) === 0 && typeof obj[key] === 'function') {
          params.on[`${key[2].toLowerCase()}${key.substr(3)}`] = obj[key];
        } else {
          rest[key] = obj[key];
        }
      });
      ['navigation', 'pagination', 'scrollbar'].forEach(key => {
        if (params[key] === true) params[key] = {};
        if (params[key] === false) delete params[key];
      });
      return {
        params,
        passedParams,
        rest
      };
    }

    function initSwiper(swiperParams) {
      return new Swiper$1(swiperParams);
    }

    function mountSwiper({
      el,
      nextEl,
      prevEl,
      paginationEl,
      scrollbarEl,
      swiper
    }, swiperParams) {
      if (needsNavigation(swiperParams) && nextEl && prevEl) {
        swiper.params.navigation.nextEl = nextEl;
        swiper.originalParams.navigation.nextEl = nextEl;
        swiper.params.navigation.prevEl = prevEl;
        swiper.originalParams.navigation.prevEl = prevEl;
      }

      if (needsPagination(swiperParams) && paginationEl) {
        swiper.params.pagination.el = paginationEl;
        swiper.originalParams.pagination.el = paginationEl;
      }

      if (needsScrollbar(swiperParams) && scrollbarEl) {
        swiper.params.scrollbar.el = scrollbarEl;
        swiper.originalParams.scrollbar.el = scrollbarEl;
      }

      swiper.init(el);
    }

    function getChangedParams(swiperParams, oldParams) {
      const keys = [];
      if (!oldParams) return keys;

      const addKey = key => {
        if (keys.indexOf(key) < 0) keys.push(key);
      };

      const watchParams = paramsList.filter(key => key[0] === '_').map(key => key.replace(/_/, ''));
      watchParams.forEach(key => {
        if (key in swiperParams && key in oldParams) {
          if (isObject(swiperParams[key]) && isObject(oldParams[key])) {
            const newKeys = Object.keys(swiperParams[key]);
            const oldKeys = Object.keys(oldParams[key]);

            if (newKeys.length !== oldKeys.length) {
              addKey(key);
            } else {
              newKeys.forEach(newKey => {
                if (swiperParams[key][newKey] !== oldParams[key][newKey]) {
                  addKey(key);
                }
              });
              oldKeys.forEach(oldKey => {
                if (swiperParams[key][oldKey] !== oldParams[key][oldKey]) addKey(key);
              });
            }
          } else if (swiperParams[key] !== oldParams[key]) {
            addKey(key);
          }
        }
      });
      return keys;
    }

    function updateSwiper({
      swiper,
      passedParams,
      changedParams,
      nextEl,
      prevEl,
      scrollbarEl,
      paginationEl
    }) {
      const updateParams = changedParams.filter(key => key !== 'children' && key !== 'direction');
      const {
        params: currentParams,
        pagination,
        navigation,
        scrollbar,
        thumbs
      } = swiper;
      let needThumbsInit;
      let needControllerInit;
      let needPaginationInit;
      let needScrollbarInit;
      let needNavigationInit;

      if (changedParams.includes('thumbs') && passedParams.thumbs && passedParams.thumbs.swiper && currentParams.thumbs && !currentParams.thumbs.swiper) {
        needThumbsInit = true;
      }

      if (changedParams.includes('controller') && passedParams.controller && passedParams.controller.control && currentParams.controller && !currentParams.controller.control) {
        needControllerInit = true;
      }

      if (changedParams.includes('pagination') && passedParams.pagination && (passedParams.pagination.el || paginationEl) && (currentParams.pagination || currentParams.pagination === false) && pagination && !pagination.el) {
        needPaginationInit = true;
      }

      if (changedParams.includes('scrollbar') && passedParams.scrollbar && (passedParams.scrollbar.el || scrollbarEl) && (currentParams.scrollbar || currentParams.scrollbar === false) && scrollbar && !scrollbar.el) {
        needScrollbarInit = true;
      }

      if (changedParams.includes('navigation') && passedParams.navigation && (passedParams.navigation.prevEl || prevEl) && (passedParams.navigation.nextEl || nextEl) && (currentParams.navigation || currentParams.navigation === false) && navigation && !navigation.prevEl && !navigation.nextEl) {
        needNavigationInit = true;
      }

      if (changedParams.includes('virtual')) {
        if (passedParams.virtual && passedParams.virtual.slides && swiper.virtual) {
          swiper.virtual.slides = passedParams.virtual.slides;
          swiper.virtual.update();
        }
      }

      const destroyModule = mod => {
        if (!swiper[mod]) return;
        swiper[mod].destroy();

        if (mod === 'navigation') {
          currentParams[mod].prevEl = undefined;
          currentParams[mod].nextEl = undefined;
          swiper[mod].prevEl = undefined;
          swiper[mod].nextEl = undefined;
        } else {
          currentParams[mod].el = undefined;
          swiper[mod].el = undefined;
        }
      };

      updateParams.forEach(key => {
        if (isObject(currentParams[key]) && isObject(passedParams[key])) {
          extend(currentParams[key], passedParams[key]);
        } else {
          const newValue = passedParams[key];

          if ((newValue === true || newValue === false) && (key === 'navigation' || key === 'pagination' || key === 'scrollbar')) {
            if (newValue === false) {
              destroyModule(key);
            }
          } else {
            currentParams[key] = passedParams[key];
          }
        }
      });

      if (needThumbsInit) {
        const initialized = thumbs.init();

        if (initialized) {
          thumbs.update(true);
        }
      }

      if (needControllerInit) {
        swiper.controller.control = currentParams.controller.control;
      }

      if (needPaginationInit) {
        if (paginationEl) currentParams.pagination.el = paginationEl;
        pagination.init();
        pagination.render();
        pagination.update();
      }

      if (needScrollbarInit) {
        if (scrollbarEl) currentParams.scrollbar.el = scrollbarEl;
        scrollbar.init();
        scrollbar.updateSize();
        scrollbar.setTranslate();
      }

      if (needNavigationInit) {
        if (nextEl) currentParams.navigation.nextEl = nextEl;
        if (prevEl) currentParams.navigation.prevEl = prevEl;
        navigation.init();
        navigation.update();
      }

      if (changedParams.includes('allowSlideNext')) {
        swiper.allowSlideNext = passedParams.allowSlideNext;
      }

      if (changedParams.includes('allowSlidePrev')) {
        swiper.allowSlidePrev = passedParams.allowSlidePrev;
      }

      if (changedParams.includes('direction')) {
        swiper.changeDirection(passedParams.direction, false);
      }

      swiper.update();
    }

    /* node_modules/swiper/svelte/swiper.svelte generated by Svelte v3.43.0 */
    const file$e = "node_modules/swiper/svelte/swiper.svelte";
    const get_container_end_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_container_end_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_wrapper_end_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_wrapper_end_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_default_slot_changes$1 = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_default_slot_context$1 = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_wrapper_start_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_wrapper_start_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_container_start_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_container_start_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });

    // (162:2) {#if needsNavigation(swiperParams)}
    function create_if_block_2$1(ctx) {
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "swiper-button-prev");
    			add_location(div0, file$e, 162, 4, 4007);
    			attr_dev(div1, "class", "swiper-button-next");
    			add_location(div1, file$e, 163, 4, 4065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			/*div0_binding*/ ctx[13](div0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			/*div1_binding*/ ctx[14](div1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			/*div0_binding*/ ctx[13](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(162:2) {#if needsNavigation(swiperParams)}",
    		ctx
    	});

    	return block;
    }

    // (166:2) {#if needsScrollbar(swiperParams)}
    function create_if_block_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "swiper-scrollbar");
    			add_location(div, file$e, 166, 4, 4168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[15](div);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[15](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(166:2) {#if needsScrollbar(swiperParams)}",
    		ctx
    	});

    	return block;
    }

    // (169:2) {#if needsPagination(swiperParams)}
    function create_if_block$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "swiper-pagination");
    			add_location(div, file$e, 169, 4, 4275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding_1*/ ctx[16](div);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding_1*/ ctx[16](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(169:2) {#if needsPagination(swiperParams)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div1;
    	let t0;
    	let show_if_2 = needsNavigation(/*swiperParams*/ ctx[2]);
    	let t1;
    	let show_if_1 = needsScrollbar(/*swiperParams*/ ctx[2]);
    	let t2;
    	let show_if = needsPagination(/*swiperParams*/ ctx[2]);
    	let t3;
    	let div0;
    	let t4;
    	let t5;
    	let t6;
    	let div1_class_value;
    	let current;
    	const container_start_slot_template = /*#slots*/ ctx[12]["container-start"];
    	const container_start_slot = create_slot(container_start_slot_template, ctx, /*$$scope*/ ctx[11], get_container_start_slot_context);
    	let if_block0 = show_if_2 && create_if_block_2$1(ctx);
    	let if_block1 = show_if_1 && create_if_block_1$2(ctx);
    	let if_block2 = show_if && create_if_block$8(ctx);
    	const wrapper_start_slot_template = /*#slots*/ ctx[12]["wrapper-start"];
    	const wrapper_start_slot = create_slot(wrapper_start_slot_template, ctx, /*$$scope*/ ctx[11], get_wrapper_start_slot_context);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context$1);
    	const wrapper_end_slot_template = /*#slots*/ ctx[12]["wrapper-end"];
    	const wrapper_end_slot = create_slot(wrapper_end_slot_template, ctx, /*$$scope*/ ctx[11], get_wrapper_end_slot_context);
    	const container_end_slot_template = /*#slots*/ ctx[12]["container-end"];
    	const container_end_slot = create_slot(container_end_slot_template, ctx, /*$$scope*/ ctx[11], get_container_end_slot_context);

    	let div1_levels = [
    		{
    			class: div1_class_value = uniqueClasses(`${/*containerClasses*/ ctx[1]}${/*className*/ ctx[0] ? ` ${/*className*/ ctx[0]}` : ''}`)
    		},
    		/*restProps*/ ctx[3]
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (container_start_slot) container_start_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div0 = element("div");
    			if (wrapper_start_slot) wrapper_start_slot.c();
    			t4 = space();
    			if (default_slot) default_slot.c();
    			t5 = space();
    			if (wrapper_end_slot) wrapper_end_slot.c();
    			t6 = space();
    			if (container_end_slot) container_end_slot.c();
    			attr_dev(div0, "class", "swiper-wrapper");
    			add_location(div0, file$e, 171, 2, 4344);
    			set_attributes(div1, div1_data);
    			add_location(div1, file$e, 155, 0, 3802);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (container_start_slot) {
    				container_start_slot.m(div1, null);
    			}

    			append_dev(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, div0);

    			if (wrapper_start_slot) {
    				wrapper_start_slot.m(div0, null);
    			}

    			append_dev(div0, t4);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div0, t5);

    			if (wrapper_end_slot) {
    				wrapper_end_slot.m(div0, null);
    			}

    			append_dev(div1, t6);

    			if (container_end_slot) {
    				container_end_slot.m(div1, null);
    			}

    			/*div1_binding_1*/ ctx[17](div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (container_start_slot) {
    				if (container_start_slot.p && (!current || dirty & /*$$scope, virtualData*/ 2560)) {
    					update_slot_base(
    						container_start_slot,
    						container_start_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(container_start_slot_template, /*$$scope*/ ctx[11], dirty, get_container_start_slot_changes),
    						get_container_start_slot_context
    					);
    				}
    			}

    			if (dirty & /*swiperParams*/ 4) show_if_2 = needsNavigation(/*swiperParams*/ ctx[2]);

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*swiperParams*/ 4) show_if_1 = needsScrollbar(/*swiperParams*/ ctx[2]);

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*swiperParams*/ 4) show_if = needsPagination(/*swiperParams*/ ctx[2]);

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$8(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (wrapper_start_slot) {
    				if (wrapper_start_slot.p && (!current || dirty & /*$$scope, virtualData*/ 2560)) {
    					update_slot_base(
    						wrapper_start_slot,
    						wrapper_start_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(wrapper_start_slot_template, /*$$scope*/ ctx[11], dirty, get_wrapper_start_slot_changes),
    						get_wrapper_start_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, virtualData*/ 2560)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (wrapper_end_slot) {
    				if (wrapper_end_slot.p && (!current || dirty & /*$$scope, virtualData*/ 2560)) {
    					update_slot_base(
    						wrapper_end_slot,
    						wrapper_end_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(wrapper_end_slot_template, /*$$scope*/ ctx[11], dirty, get_wrapper_end_slot_changes),
    						get_wrapper_end_slot_context
    					);
    				}
    			}

    			if (container_end_slot) {
    				if (container_end_slot.p && (!current || dirty & /*$$scope, virtualData*/ 2560)) {
    					update_slot_base(
    						container_end_slot,
    						container_end_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(container_end_slot_template, /*$$scope*/ ctx[11], dirty, get_container_end_slot_changes),
    						get_container_end_slot_context
    					);
    				}
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				(!current || dirty & /*containerClasses, className*/ 3 && div1_class_value !== (div1_class_value = uniqueClasses(`${/*containerClasses*/ ctx[1]}${/*className*/ ctx[0] ? ` ${/*className*/ ctx[0]}` : ''}`))) && { class: div1_class_value },
    				dirty & /*restProps*/ 8 && /*restProps*/ ctx[3]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container_start_slot, local);
    			transition_in(wrapper_start_slot, local);
    			transition_in(default_slot, local);
    			transition_in(wrapper_end_slot, local);
    			transition_in(container_end_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container_start_slot, local);
    			transition_out(wrapper_start_slot, local);
    			transition_out(default_slot, local);
    			transition_out(wrapper_end_slot, local);
    			transition_out(container_end_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (container_start_slot) container_start_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (wrapper_start_slot) wrapper_start_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (wrapper_end_slot) wrapper_end_slot.d(detaching);
    			if (container_end_slot) container_end_slot.d(detaching);
    			/*div1_binding_1*/ ctx[17](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","swiper"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Swiper', slots, ['container-start','wrapper-start','default','wrapper-end','container-end']);
    	const dispatch = createEventDispatcher();
    	let { class: className = undefined } = $$props;
    	let containerClasses = 'swiper';
    	let breakpointChanged = false;
    	let swiperInstance = null;
    	let oldPassedParams = null;
    	let paramsData;
    	let swiperParams;
    	let passedParams;
    	let restProps;
    	let swiperEl = null;
    	let prevEl = null;
    	let nextEl = null;
    	let scrollbarEl = null;
    	let paginationEl = null;
    	let virtualData = { slides: [] };

    	function swiper() {
    		return swiperInstance;
    	}

    	const setVirtualData = data => {
    		$$invalidate(9, virtualData = data);

    		tick().then(() => {
    			swiperInstance.$wrapperEl.children('.swiper-slide').each(el => {
    				if (el.onSwiper) el.onSwiper(swiperInstance);
    			});

    			swiperInstance.updateSlides();
    			swiperInstance.updateProgress();
    			swiperInstance.updateSlidesClasses();

    			if (swiperInstance.lazy && swiperInstance.params.lazy.enabled) {
    				swiperInstance.lazy.load();
    			}
    		});
    	};

    	const calcParams = () => {
    		paramsData = getParams($$restProps);
    		$$invalidate(2, swiperParams = paramsData.params);
    		passedParams = paramsData.passedParams;
    		$$invalidate(3, restProps = paramsData.rest);
    	};

    	calcParams();
    	oldPassedParams = passedParams;

    	const onBeforeBreakpoint = () => {
    		breakpointChanged = true;
    	};

    	swiperParams.onAny = (event, ...args) => {
    		dispatch(event, [args]);
    	};

    	Object.assign(swiperParams.on, {
    		_beforeBreakpoint: onBeforeBreakpoint,
    		_containerClasses(_swiper, classes) {
    			$$invalidate(1, containerClasses = classes);
    		}
    	});

    	swiperInstance = initSwiper(swiperParams);

    	if (swiperInstance.virtual && swiperInstance.params.virtual.enabled) {
    		const extendWith = {
    			cache: false,
    			renderExternal: data => {
    				setVirtualData(data);

    				if (swiperParams.virtual && swiperParams.virtual.renderExternal) {
    					swiperParams.virtual.renderExternal(data);
    				}
    			},
    			renderExternalUpdate: false
    		};

    		extend(swiperInstance.params.virtual, extendWith);
    		extend(swiperInstance.originalParams.virtual, extendWith);
    	}

    	onMount(() => {
    		if (!swiperEl) return;

    		mountSwiper(
    			{
    				el: swiperEl,
    				nextEl,
    				prevEl,
    				paginationEl,
    				scrollbarEl,
    				swiper: swiperInstance
    			},
    			swiperParams
    		);

    		dispatch('swiper', [swiperInstance]);
    		if (swiperParams.virtual) return;

    		swiperInstance.slides.each(el => {
    			if (el.onSwiper) el.onSwiper(swiperInstance);
    		});
    	});

    	afterUpdate(() => {
    		if (!swiperInstance) return;
    		calcParams();
    		const changedParams = getChangedParams(passedParams, oldPassedParams);

    		if ((changedParams.length || breakpointChanged) && swiperInstance && !swiperInstance.destroyed) {
    			updateSwiper({
    				swiper: swiperInstance,
    				passedParams,
    				changedParams,
    				nextEl,
    				prevEl,
    				scrollbarEl,
    				paginationEl
    			});
    		}

    		breakpointChanged = false;
    		oldPassedParams = passedParams;
    	});

    	onDestroy(() => {
    		// eslint-disable-next-line
    		if (typeof window !== 'undefined' && swiperInstance && !swiperInstance.destroyed) {
    			swiperInstance.destroy(true, false);
    		}
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			prevEl = $$value;
    			$$invalidate(5, prevEl);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			nextEl = $$value;
    			$$invalidate(6, nextEl);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			scrollbarEl = $$value;
    			$$invalidate(7, scrollbarEl);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			paginationEl = $$value;
    			$$invalidate(8, paginationEl);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			swiperEl = $$value;
    			$$invalidate(4, swiperEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(27, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		afterUpdate,
    		createEventDispatcher,
    		tick,
    		beforeUpdate,
    		getParams,
    		initSwiper,
    		mountSwiper,
    		needsScrollbar,
    		needsNavigation,
    		needsPagination,
    		uniqueClasses,
    		extend,
    		getChangedParams,
    		updateSwiper,
    		dispatch,
    		className,
    		containerClasses,
    		breakpointChanged,
    		swiperInstance,
    		oldPassedParams,
    		paramsData,
    		swiperParams,
    		passedParams,
    		restProps,
    		swiperEl,
    		prevEl,
    		nextEl,
    		scrollbarEl,
    		paginationEl,
    		virtualData,
    		swiper,
    		setVirtualData,
    		calcParams,
    		onBeforeBreakpoint
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('containerClasses' in $$props) $$invalidate(1, containerClasses = $$new_props.containerClasses);
    		if ('breakpointChanged' in $$props) breakpointChanged = $$new_props.breakpointChanged;
    		if ('swiperInstance' in $$props) swiperInstance = $$new_props.swiperInstance;
    		if ('oldPassedParams' in $$props) oldPassedParams = $$new_props.oldPassedParams;
    		if ('paramsData' in $$props) paramsData = $$new_props.paramsData;
    		if ('swiperParams' in $$props) $$invalidate(2, swiperParams = $$new_props.swiperParams);
    		if ('passedParams' in $$props) passedParams = $$new_props.passedParams;
    		if ('restProps' in $$props) $$invalidate(3, restProps = $$new_props.restProps);
    		if ('swiperEl' in $$props) $$invalidate(4, swiperEl = $$new_props.swiperEl);
    		if ('prevEl' in $$props) $$invalidate(5, prevEl = $$new_props.prevEl);
    		if ('nextEl' in $$props) $$invalidate(6, nextEl = $$new_props.nextEl);
    		if ('scrollbarEl' in $$props) $$invalidate(7, scrollbarEl = $$new_props.scrollbarEl);
    		if ('paginationEl' in $$props) $$invalidate(8, paginationEl = $$new_props.paginationEl);
    		if ('virtualData' in $$props) $$invalidate(9, virtualData = $$new_props.virtualData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		className,
    		containerClasses,
    		swiperParams,
    		restProps,
    		swiperEl,
    		prevEl,
    		nextEl,
    		scrollbarEl,
    		paginationEl,
    		virtualData,
    		swiper,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div_binding,
    		div_binding_1,
    		div1_binding_1
    	];
    }

    class Swiper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { class: 0, swiper: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swiper",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Swiper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swiper() {
    		return this.$$.ctx[10];
    	}

    	set swiper(value) {
    		throw new Error("<Swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/swiper/svelte/swiper-slide.svelte generated by Svelte v3.43.0 */
    const file$d = "node_modules/swiper/svelte/swiper-slide.svelte";
    const get_default_slot_changes_1 = dirty => ({ data: dirty & /*slideData*/ 32 });
    const get_default_slot_context_1 = ctx => ({ data: /*slideData*/ ctx[5] });
    const get_default_slot_changes = dirty => ({ data: dirty & /*slideData*/ 32 });
    const get_default_slot_context = ctx => ({ data: /*slideData*/ ctx[5] });

    // (92:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, slideData*/ 160)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(92:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (85:2) {#if zoom}
    function create_if_block$7(ctx) {
    	let div;
    	let div_data_swiper_zoom_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "swiper-zoom-container");

    			attr_dev(div, "data-swiper-zoom", div_data_swiper_zoom_value = typeof /*zoom*/ ctx[0] === 'number'
    			? /*zoom*/ ctx[0]
    			: undefined);

    			add_location(div, file$d, 85, 4, 2067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, slideData*/ 160)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*zoom*/ 1 && div_data_swiper_zoom_value !== (div_data_swiper_zoom_value = typeof /*zoom*/ ctx[0] === 'number'
    			? /*zoom*/ ctx[0]
    			: undefined)) {
    				attr_dev(div, "data-swiper-zoom", div_data_swiper_zoom_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(85:2) {#if zoom}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_class_value;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*zoom*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let div_levels = [
    		{
    			class: div_class_value = uniqueClasses(`${/*slideClasses*/ ctx[3]}${/*className*/ ctx[2] ? ` ${/*className*/ ctx[2]}` : ''}`)
    		},
    		{
    			"data-swiper-slide-index": /*virtualIndex*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$d, 78, 0, 1883);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*slideClasses, className*/ 12 && div_class_value !== (div_class_value = uniqueClasses(`${/*slideClasses*/ ctx[3]}${/*className*/ ctx[2] ? ` ${/*className*/ ctx[2]}` : ''}`))) && { class: div_class_value },
    				(!current || dirty & /*virtualIndex*/ 2) && {
    					"data-swiper-slide-index": /*virtualIndex*/ ctx[1]
    				},
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let slideData;
    	const omit_props_names = ["zoom","virtualIndex","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Swiper_slide', slots, ['default']);
    	let { zoom = undefined } = $$props;
    	let { virtualIndex = undefined } = $$props;
    	let { class: className = undefined } = $$props;
    	let slideEl = null;
    	let slideClasses = 'swiper-slide';
    	let swiper = null;
    	let eventAttached = false;

    	const updateClasses = (_, el, classNames) => {
    		if (el === slideEl) {
    			$$invalidate(3, slideClasses = classNames);
    		}
    	};

    	const attachEvent = () => {
    		if (!swiper || eventAttached) return;
    		swiper.on('_slideClass', updateClasses);
    		eventAttached = true;
    	};

    	const detachEvent = () => {
    		if (!swiper) return;
    		swiper.off('_slideClass', updateClasses);
    		eventAttached = false;
    	};

    	onMount(() => {
    		if (typeof virtualIndex === 'undefined') return;

    		$$invalidate(
    			4,
    			slideEl.onSwiper = _swiper => {
    				swiper = _swiper;
    				attachEvent();
    			},
    			slideEl
    		);

    		attachEvent();
    	});

    	afterUpdate(() => {
    		if (!slideEl || !swiper) return;

    		if (swiper.destroyed) {
    			if (slideClasses !== 'swiper-slide') {
    				$$invalidate(3, slideClasses = 'swiper-slide');
    			}

    			return;
    		}

    		attachEvent();
    	});

    	beforeUpdate(() => {
    		attachEvent();
    	});

    	onDestroy(() => {
    		if (!swiper) return;
    		detachEvent();
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			slideEl = $$value;
    			$$invalidate(4, slideEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('zoom' in $$new_props) $$invalidate(0, zoom = $$new_props.zoom);
    		if ('virtualIndex' in $$new_props) $$invalidate(1, virtualIndex = $$new_props.virtualIndex);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		beforeUpdate,
    		afterUpdate,
    		uniqueClasses,
    		zoom,
    		virtualIndex,
    		className,
    		slideEl,
    		slideClasses,
    		swiper,
    		eventAttached,
    		updateClasses,
    		attachEvent,
    		detachEvent,
    		slideData
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('zoom' in $$props) $$invalidate(0, zoom = $$new_props.zoom);
    		if ('virtualIndex' in $$props) $$invalidate(1, virtualIndex = $$new_props.virtualIndex);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('slideEl' in $$props) $$invalidate(4, slideEl = $$new_props.slideEl);
    		if ('slideClasses' in $$props) $$invalidate(3, slideClasses = $$new_props.slideClasses);
    		if ('swiper' in $$props) swiper = $$new_props.swiper;
    		if ('eventAttached' in $$props) eventAttached = $$new_props.eventAttached;
    		if ('slideData' in $$props) $$invalidate(5, slideData = $$new_props.slideData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*slideClasses*/ 8) {
    			$$invalidate(5, slideData = {
    				isActive: slideClasses.indexOf('swiper-slide-active') >= 0 || slideClasses.indexOf('swiper-slide-duplicate-active') >= 0,
    				isVisible: slideClasses.indexOf('swiper-slide-visible') >= 0,
    				isDuplicate: slideClasses.indexOf('swiper-slide-duplicate') >= 0,
    				isPrev: slideClasses.indexOf('swiper-slide-prev') >= 0 || slideClasses.indexOf('swiper-slide-duplicate-prev') >= 0,
    				isNext: slideClasses.indexOf('swiper-slide-next') >= 0 || slideClasses.indexOf('swiper-slide-duplicate-next') >= 0
    			});
    		}
    	};

    	return [
    		zoom,
    		virtualIndex,
    		className,
    		slideClasses,
    		slideEl,
    		slideData,
    		$$restProps,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Swiper_slide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { zoom: 0, virtualIndex: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swiper_slide",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get zoom() {
    		throw new Error("<Swiper_slide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zoom(value) {
    		throw new Error("<Swiper_slide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get virtualIndex() {
    		throw new Error("<Swiper_slide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set virtualIndex(value) {
    		throw new Error("<Swiper_slide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Swiper_slide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Swiper_slide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/BgCards.svelte generated by Svelte v3.43.0 */
    const file$c = "src/components/BgCards.svelte";

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (60:4) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let each_value_1 = /*cards*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "bg-cards__container");
    			add_location(div, file$c, 60, 6, 1743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4) {
    				each_value_1 = /*cards*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(60:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if slider}
    function create_if_block$6(ctx) {
    	let swiper;
    	let t0;
    	let div;
    	let current;

    	swiper = new Swiper({
    			props: {
    				modules: [Navigation],
    				loop: true,
    				navigation: /*navigation*/ ctx[5],
    				class: "bg-cards__container",
    				spaceBetween: 50,
    				slidesPerView: 4,
    				breakpoints: /*breakpoints*/ ctx[6],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("slideChange", slideChange_handler$3);
    	swiper.$on("swiper", swiper_handler$3);

    	const block = {
    		c: function create() {
    			create_component(swiper.$$.fragment);
    			t0 = space();
    			div = element("div");
    			div.textContent = "Next ->";
    			attr_dev(div, "class", "bg-cards__next");
    			add_location(div, file$c, 58, 6, 1683);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiper, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};

    			if (dirty & /*$$scope, cards*/ 8196) {
    				swiper_changes.$$scope = { dirty, ctx };
    			}

    			swiper.$set(swiper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiper, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(33:4) {#if slider}",
    		ctx
    	});

    	return block;
    }

    // (66:14) {#if card.secondLine}
    function create_if_block_2(ctx) {
    	let small;
    	let raw_value = /*card*/ ctx[8].secondLine + "";

    	const block = {
    		c: function create() {
    			small = element("small");
    			add_location(small, file$c, 66, 16, 2070);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			small.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4 && raw_value !== (raw_value = /*card*/ ctx[8].secondLine + "")) small.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(66:14) {#if card.secondLine}",
    		ctx
    	});

    	return block;
    }

    // (62:8) {#each cards as card}
    function create_each_block_1$4(ctx) {
    	let div2;
    	let div0;
    	let strong;
    	let raw_value = /*card*/ ctx[8].firstLine + "";
    	let br;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div1;
    	let t2;
    	let if_block = /*card*/ ctx[8].secondLine && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			strong = element("strong");
    			br = element("br");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			add_location(strong, file$c, 64, 14, 1972);
    			add_location(br, file$c, 64, 53, 2011);

    			attr_dev(div0, "class", div0_class_value = "bg-cards__card__title " + (/*card*/ ctx[8].secondLine
    			? 'bg-cards__card__title--with-subtitle'
    			: ''));

    			add_location(div0, file$c, 63, 12, 1858);
    			attr_dev(div1, "class", "bg-cards__card__image");
    			set_style(div1, "background-image", "url('images/" + /*card*/ ctx[8].imagePath + "')");
    			add_location(div1, file$c, 69, 12, 2160);
    			attr_dev(div2, "class", "bg-cards__card");
    			add_location(div2, file$c, 62, 10, 1817);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, strong);
    			strong.innerHTML = raw_value;
    			append_dev(div0, br);
    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4 && raw_value !== (raw_value = /*card*/ ctx[8].firstLine + "")) strong.innerHTML = raw_value;
    			if (/*card*/ ctx[8].secondLine) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*cards*/ 4 && div0_class_value !== (div0_class_value = "bg-cards__card__title " + (/*card*/ ctx[8].secondLine
    			? 'bg-cards__card__title--with-subtitle'
    			: ''))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*cards*/ 4) {
    				set_style(div1, "background-image", "url('images/" + /*card*/ ctx[8].imagePath + "')");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(62:8) {#each cards as card}",
    		ctx
    	});

    	return block;
    }

    // (50:16) {#if card.secondLine}
    function create_if_block_1$1(ctx) {
    	let small;
    	let raw_value = /*card*/ ctx[8].secondLine + "";

    	const block = {
    		c: function create() {
    			small = element("small");
    			add_location(small, file$c, 50, 18, 1406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			small.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4 && raw_value !== (raw_value = /*card*/ ctx[8].secondLine + "")) small.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(50:16) {#if card.secondLine}",
    		ctx
    	});

    	return block;
    }

    // (46:10) <SwiperSlide>
    function create_default_slot_1$3(ctx) {
    	let div2;
    	let div0;
    	let strong;
    	let raw_value = /*card*/ ctx[8].firstLine + "";
    	let br;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div1;
    	let t2;
    	let if_block = /*card*/ ctx[8].secondLine && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			strong = element("strong");
    			br = element("br");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			add_location(strong, file$c, 48, 16, 1304);
    			add_location(br, file$c, 48, 55, 1343);

    			attr_dev(div0, "class", div0_class_value = "bg-cards__card__title " + (/*card*/ ctx[8].secondLine
    			? 'bg-cards__card__title--with-subtitle'
    			: ''));

    			add_location(div0, file$c, 47, 14, 1188);
    			attr_dev(div1, "class", "bg-cards__card__image");
    			set_style(div1, "background-image", "url('images/" + /*card*/ ctx[8].imagePath + "')");
    			add_location(div1, file$c, 53, 14, 1502);
    			attr_dev(div2, "class", "bg-cards__card");
    			add_location(div2, file$c, 46, 12, 1145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, strong);
    			strong.innerHTML = raw_value;
    			append_dev(div0, br);
    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4 && raw_value !== (raw_value = /*card*/ ctx[8].firstLine + "")) strong.innerHTML = raw_value;
    			if (/*card*/ ctx[8].secondLine) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*cards*/ 4 && div0_class_value !== (div0_class_value = "bg-cards__card__title " + (/*card*/ ctx[8].secondLine
    			? 'bg-cards__card__title--with-subtitle'
    			: ''))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*cards*/ 4) {
    				set_style(div1, "background-image", "url('images/" + /*card*/ ctx[8].imagePath + "')");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(46:10) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (45:8) {#each cards as card}
    function create_each_block$5(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper_slide({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty & /*$$scope, cards*/ 8196) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(45:8) {#each cards as card}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Swiper         modules={[Navigation]}         loop="{true}"         navigation={navigation}         class="bg-cards__container"         spaceBetween={50}         slidesPerView={4}         breakpoints={breakpoints}         on:slideChange={() => {}}         on:swiper={(e) => {}}       >
    function create_default_slot$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*cards*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4) {
    				each_value = /*cards*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(34:6) <Swiper         modules={[Navigation]}         loop=\\\"{true}\\\"         navigation={navigation}         class=\\\"bg-cards__container\\\"         spaceBetween={50}         slidesPerView={4}         breakpoints={breakpoints}         on:slideChange={() => {}}         on:swiper={(e) => {}}       >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*slider*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text$1(/*overtitle*/ ctx[1]);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text$1(/*title*/ ctx[0]);
    			t3 = space();
    			if_block.c();
    			attr_dev(div0, "class", "bg-cards__overtitle");
    			add_location(div0, file$c, 30, 4, 673);
    			attr_dev(h3, "class", "bg-cards__title");
    			add_location(h3, file$c, 31, 4, 728);
    			attr_dev(div1, "class", "bg-cards");
    			add_location(div1, file$c, 29, 2, 646);
    			attr_dev(div2, "class", "wrapper");
    			attr_dev(div2, "id", /*HTMLanchor*/ ctx[4]);
    			add_location(div2, file$c, 28, 0, 604);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, h3);
    			append_dev(h3, t2);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*overtitle*/ 2) set_data_dev(t0, /*overtitle*/ ctx[1]);
    			if (!current || dirty & /*title*/ 1) set_data_dev(t2, /*title*/ ctx[0]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const slideChange_handler$3 = () => {
    	
    };

    const swiper_handler$3 = e => {
    	
    };

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BgCards', slots, []);
    	let { title = "Title for hero component" } = $$props;
    	let { overtitle = "overtitle" } = $$props;
    	let { cards = [] } = $$props;
    	let { slider = false } = $$props;
    	let { anchor } = $$props;
    	let HTMLanchor = anchor ? anchor : overtitle;
    	let navigation = { nextEl: '.bg-cards__next' };

    	let breakpoints = {
    		'320': { slidesPerView: 1, spaceBetween: 20 },
    		'640': { slidesPerView: 2, spaceBetween: 40 },
    		'1200': { slidesPerView: 4, spaceBetween: 50 }
    	};

    	const writable_props = ['title', 'overtitle', 'cards', 'slider', 'anchor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BgCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('overtitle' in $$props) $$invalidate(1, overtitle = $$props.overtitle);
    		if ('cards' in $$props) $$invalidate(2, cards = $$props.cards);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		overtitle,
    		cards,
    		slider,
    		anchor,
    		HTMLanchor,
    		navigation,
    		breakpoints,
    		Navigation,
    		Swiper,
    		SwiperSlide: Swiper_slide
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('overtitle' in $$props) $$invalidate(1, overtitle = $$props.overtitle);
    		if ('cards' in $$props) $$invalidate(2, cards = $$props.cards);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    		if ('HTMLanchor' in $$props) $$invalidate(4, HTMLanchor = $$props.HTMLanchor);
    		if ('navigation' in $$props) $$invalidate(5, navigation = $$props.navigation);
    		if ('breakpoints' in $$props) $$invalidate(6, breakpoints = $$props.breakpoints);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, overtitle, cards, slider, HTMLanchor, navigation, breakpoints, anchor];
    }

    class BgCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			title: 0,
    			overtitle: 1,
    			cards: 2,
    			slider: 3,
    			anchor: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BgCards",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*anchor*/ ctx[7] === undefined && !('anchor' in props)) {
    			console.warn("<BgCards> was created without expected prop 'anchor'");
    		}
    	}

    	get title() {
    		throw new Error("<BgCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<BgCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overtitle() {
    		throw new Error("<BgCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overtitle(value) {
    		throw new Error("<BgCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cards() {
    		throw new Error("<BgCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cards(value) {
    		throw new Error("<BgCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slider() {
    		throw new Error("<BgCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slider(value) {
    		throw new Error("<BgCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchor() {
    		throw new Error("<BgCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchor(value) {
    		throw new Error("<BgCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let generateBlob = () => {
      let p1 = random();
      let p2 = random();
      let p3 = random();
      let p4 = random();
      return `${p1}% ${reflect(p1)}% ${reflect(p2)}% ${p2}% / ${p3}% ${p4}% ${reflect(p4)}% ${reflect(p3)}%`;
    };

    let random = (from = 25, to = 75) => { return Math.floor(Math.random() * (to - from) + from) };

    let reflect = (n) => { return 100 - n };

    /* src/components/Blob.svelte generated by Svelte v3.43.0 */
    const file$b = "src/components/Blob.svelte";

    function create_fragment$c(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "blob svelte-p7qz7t");
    			set_style(div, "background-color", /*color*/ ctx[0]);
    			set_style(div, "--border-radius", generateBlob());
    			set_style(div, "--fifty", generateBlob());
    			set_style(div, "--onehundred", generateBlob());
    			set_style(div, "--top", /*topPos*/ ctx[4]);
    			set_style(div, "--left", /*leftPos*/ ctx[3]);
    			set_style(div, "--dimensions", /*dimensions*/ ctx[2]);
    			set_style(div, "--zindex", /*zIndex*/ ctx[1]);
    			set_style(div, "--blobtiming", random(3, 5) + "s");
    			set_style(div, "--bloboffsettiming", "-" + random(3, 5) + "s");
    			add_location(div, file$b, 18, 0, 481);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(div, "background-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*topPos*/ 16) {
    				set_style(div, "--top", /*topPos*/ ctx[4]);
    			}

    			if (dirty & /*leftPos*/ 8) {
    				set_style(div, "--left", /*leftPos*/ ctx[3]);
    			}

    			if (dirty & /*dimensions*/ 4) {
    				set_style(div, "--dimensions", /*dimensions*/ ctx[2]);
    			}

    			if (dirty & /*zIndex*/ 2) {
    				set_style(div, "--zindex", /*zIndex*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let topPos;
    	let leftPos;
    	let dimensions;
    	let zIndex;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blob', slots, []);
    	let { color } = $$props;
    	let { top } = $$props;
    	let { left } = $$props;
    	let { size } = $$props;
    	let { zindex } = $$props;

    	let randomPosition = () => {
    		return `${random(0, 100)}%`;
    	};

    	const writable_props = ['color', 'top', 'left', 'size', 'zindex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blob> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('top' in $$props) $$invalidate(5, top = $$props.top);
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    		if ('size' in $$props) $$invalidate(7, size = $$props.size);
    		if ('zindex' in $$props) $$invalidate(8, zindex = $$props.zindex);
    	};

    	$$self.$capture_state = () => ({
    		color,
    		top,
    		left,
    		size,
    		zindex,
    		generateBlob,
    		random,
    		randomPosition,
    		zIndex,
    		dimensions,
    		leftPos,
    		topPos
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('top' in $$props) $$invalidate(5, top = $$props.top);
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    		if ('size' in $$props) $$invalidate(7, size = $$props.size);
    		if ('zindex' in $$props) $$invalidate(8, zindex = $$props.zindex);
    		if ('randomPosition' in $$props) $$invalidate(9, randomPosition = $$props.randomPosition);
    		if ('zIndex' in $$props) $$invalidate(1, zIndex = $$props.zIndex);
    		if ('dimensions' in $$props) $$invalidate(2, dimensions = $$props.dimensions);
    		if ('leftPos' in $$props) $$invalidate(3, leftPos = $$props.leftPos);
    		if ('topPos' in $$props) $$invalidate(4, topPos = $$props.topPos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*top*/ 32) {
    			$$invalidate(4, topPos = isNaN(top) ? randomPosition() : `${top}%`);
    		}

    		if ($$self.$$.dirty & /*left*/ 64) {
    			$$invalidate(3, leftPos = isNaN(left) ? randomPosition() : `${left}%`);
    		}

    		if ($$self.$$.dirty & /*size*/ 128) {
    			$$invalidate(2, dimensions = isNaN(size) ? `${random(20, 200)}px` : `${size}px`);
    		}

    		if ($$self.$$.dirty & /*zindex*/ 256) {
    			$$invalidate(1, zIndex = isNaN(zindex) ? random(1, 100) : zindex);
    		}
    	};

    	return [color, zIndex, dimensions, leftPos, topPos, top, left, size, zindex];
    }

    class Blob extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			color: 0,
    			top: 5,
    			left: 6,
    			size: 7,
    			zindex: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blob",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
    			console.warn("<Blob> was created without expected prop 'color'");
    		}

    		if (/*top*/ ctx[5] === undefined && !('top' in props)) {
    			console.warn("<Blob> was created without expected prop 'top'");
    		}

    		if (/*left*/ ctx[6] === undefined && !('left' in props)) {
    			console.warn("<Blob> was created without expected prop 'left'");
    		}

    		if (/*size*/ ctx[7] === undefined && !('size' in props)) {
    			console.warn("<Blob> was created without expected prop 'size'");
    		}

    		if (/*zindex*/ ctx[8] === undefined && !('zindex' in props)) {
    			console.warn("<Blob> was created without expected prop 'zindex'");
    		}
    	}

    	get color() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zindex() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zindex(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Blobs.svelte generated by Svelte v3.43.0 */

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (12:0) {:else}
    function create_else_block$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*shapes*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*shapes*/ 1) {
    				each_value_1 = /*shapes*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(12:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if (typeof shapes === 'number')}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = Array(/*shapes*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors, Math, shapes*/ 3) {
    				each_value = Array(/*shapes*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(8:0) {#if (typeof shapes === 'number')}",
    		ctx
    	});

    	return block;
    }

    // (13:2) {#each shapes as shape, i}
    function create_each_block_1$3(ctx) {
    	let blob;
    	let current;

    	blob = new Blob({
    			props: {
    				color: /*shape*/ ctx[5].color,
    				top: /*shape*/ ctx[5].top,
    				left: /*shape*/ ctx[5].left,
    				size: /*shape*/ ctx[5].size,
    				zindex: /*shape*/ ctx[5].zindex
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(blob.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blob, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const blob_changes = {};
    			if (dirty & /*shapes*/ 1) blob_changes.color = /*shape*/ ctx[5].color;
    			if (dirty & /*shapes*/ 1) blob_changes.top = /*shape*/ ctx[5].top;
    			if (dirty & /*shapes*/ 1) blob_changes.left = /*shape*/ ctx[5].left;
    			if (dirty & /*shapes*/ 1) blob_changes.size = /*shape*/ ctx[5].size;
    			if (dirty & /*shapes*/ 1) blob_changes.zindex = /*shape*/ ctx[5].zindex;
    			blob.$set(blob_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blob.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blob.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blob, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(13:2) {#each shapes as shape, i}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#each Array(shapes) as _, i}
    function create_each_block$4(ctx) {
    	let blob;
    	let current;

    	blob = new Blob({
    			props: {
    				color: /*colors*/ ctx[1][Math.floor(Math.random() * /*colors*/ ctx[1].length)]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(blob.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blob, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const blob_changes = {};
    			if (dirty & /*colors*/ 2) blob_changes.color = /*colors*/ ctx[1][Math.floor(Math.random() * /*colors*/ ctx[1].length)];
    			blob.$set(blob_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blob.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blob.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blob, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(9:2) {#each Array(shapes) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*shapes*/ ctx[0] === 'number') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blobs', slots, []);
    	let { shapes } = $$props;
    	let { colors } = $$props;
    	const writable_props = ['shapes', 'colors'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blobs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('shapes' in $$props) $$invalidate(0, shapes = $$props.shapes);
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    	};

    	$$self.$capture_state = () => ({ shapes, colors, Blob });

    	$$self.$inject_state = $$props => {
    		if ('shapes' in $$props) $$invalidate(0, shapes = $$props.shapes);
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shapes, colors];
    }

    class Blobs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { shapes: 0, colors: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blobs",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*shapes*/ ctx[0] === undefined && !('shapes' in props)) {
    			console.warn("<Blobs> was created without expected prop 'shapes'");
    		}

    		if (/*colors*/ ctx[1] === undefined && !('colors' in props)) {
    			console.warn("<Blobs> was created without expected prop 'colors'");
    		}
    	}

    	get shapes() {
    		throw new Error("<Blobs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shapes(value) {
    		throw new Error("<Blobs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Blobs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Blobs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/BlockWithImage.svelte generated by Svelte v3.43.0 */
    const file$a = "src/components/BlockWithImage.svelte";

    function create_fragment$a(ctx) {
    	let div5;
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let t5;
    	let div3;
    	let div4_class_value;
    	let t6;
    	let blobs;
    	let current;

    	blobs = new Blobs({
    			props: {
    				shapes: /*shapes*/ ctx[5],
    				colors: /*colors*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text$1(/*overtitle*/ ctx[2]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text$1(/*title*/ ctx[3]);
    			t3 = space();
    			div1 = element("div");
    			t4 = text$1(/*description*/ ctx[4]);
    			t5 = space();
    			div3 = element("div");
    			t6 = space();
    			create_component(blobs.$$.fragment);
    			attr_dev(div0, "class", "block__overtitle");
    			add_location(div0, file$a, 19, 6, 632);
    			attr_dev(h2, "class", "block__title");
    			add_location(h2, file$a, 20, 6, 686);
    			attr_dev(div1, "class", "block__description");
    			add_location(div1, file$a, 21, 6, 730);
    			attr_dev(div2, "class", "block__content");
    			add_location(div2, file$a, 18, 4, 597);
    			attr_dev(div3, "class", "block__image");
    			set_style(div3, "background-image", "url('images/" + /*imagePath*/ ctx[1] + "')");
    			add_location(div3, file$a, 23, 4, 797);
    			attr_dev(div4, "class", div4_class_value = "block block--" + /*imagePosition*/ ctx[0]);
    			add_location(div4, file$a, 17, 2, 550);
    			attr_dev(div5, "class", "wrapper");
    			attr_dev(div5, "id", /*HTMLanchor*/ ctx[7]);
    			add_location(div5, file$a, 16, 0, 508);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, h2);
    			append_dev(h2, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div5, t6);
    			mount_component(blobs, div5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*overtitle*/ 4) set_data_dev(t0, /*overtitle*/ ctx[2]);
    			if (!current || dirty & /*title*/ 8) set_data_dev(t2, /*title*/ ctx[3]);
    			if (!current || dirty & /*description*/ 16) set_data_dev(t4, /*description*/ ctx[4]);

    			if (!current || dirty & /*imagePath*/ 2) {
    				set_style(div3, "background-image", "url('images/" + /*imagePath*/ ctx[1] + "')");
    			}

    			if (!current || dirty & /*imagePosition*/ 1 && div4_class_value !== (div4_class_value = "block block--" + /*imagePosition*/ ctx[0])) {
    				attr_dev(div4, "class", div4_class_value);
    			}

    			const blobs_changes = {};
    			if (dirty & /*shapes*/ 32) blobs_changes.shapes = /*shapes*/ ctx[5];
    			if (dirty & /*colors*/ 64) blobs_changes.colors = /*colors*/ ctx[6];
    			blobs.$set(blobs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blobs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blobs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(blobs);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BlockWithImage', slots, []);
    	let { imagePosition = "left" } = $$props;
    	let { imagePath = "image.jpg" } = $$props;
    	let { overtitle = "overtitle" } = $$props;
    	let { title = "Title for hero component" } = $$props;
    	let { description = "Sample description" } = $$props;
    	let { shapes = 2 } = $$props;
    	let { colors = ['red', 'yellow', 'blue'] } = $$props;
    	let { anchor } = $$props;
    	let HTMLanchor = anchor ? anchor : title;

    	let random = (from = 25, to = 75) => {
    		return Math.floor(Math.random() * (to - from) + from);
    	};

    	const writable_props = [
    		'imagePosition',
    		'imagePath',
    		'overtitle',
    		'title',
    		'description',
    		'shapes',
    		'colors',
    		'anchor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BlockWithImage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('imagePosition' in $$props) $$invalidate(0, imagePosition = $$props.imagePosition);
    		if ('imagePath' in $$props) $$invalidate(1, imagePath = $$props.imagePath);
    		if ('overtitle' in $$props) $$invalidate(2, overtitle = $$props.overtitle);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('description' in $$props) $$invalidate(4, description = $$props.description);
    		if ('shapes' in $$props) $$invalidate(5, shapes = $$props.shapes);
    		if ('colors' in $$props) $$invalidate(6, colors = $$props.colors);
    		if ('anchor' in $$props) $$invalidate(8, anchor = $$props.anchor);
    	};

    	$$self.$capture_state = () => ({
    		imagePosition,
    		imagePath,
    		overtitle,
    		title,
    		description,
    		shapes,
    		colors,
    		anchor,
    		HTMLanchor,
    		Blobs,
    		random
    	});

    	$$self.$inject_state = $$props => {
    		if ('imagePosition' in $$props) $$invalidate(0, imagePosition = $$props.imagePosition);
    		if ('imagePath' in $$props) $$invalidate(1, imagePath = $$props.imagePath);
    		if ('overtitle' in $$props) $$invalidate(2, overtitle = $$props.overtitle);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('description' in $$props) $$invalidate(4, description = $$props.description);
    		if ('shapes' in $$props) $$invalidate(5, shapes = $$props.shapes);
    		if ('colors' in $$props) $$invalidate(6, colors = $$props.colors);
    		if ('anchor' in $$props) $$invalidate(8, anchor = $$props.anchor);
    		if ('HTMLanchor' in $$props) $$invalidate(7, HTMLanchor = $$props.HTMLanchor);
    		if ('random' in $$props) random = $$props.random;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		imagePosition,
    		imagePath,
    		overtitle,
    		title,
    		description,
    		shapes,
    		colors,
    		HTMLanchor,
    		anchor
    	];
    }

    class BlockWithImage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			imagePosition: 0,
    			imagePath: 1,
    			overtitle: 2,
    			title: 3,
    			description: 4,
    			shapes: 5,
    			colors: 6,
    			anchor: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockWithImage",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*anchor*/ ctx[8] === undefined && !('anchor' in props)) {
    			console.warn("<BlockWithImage> was created without expected prop 'anchor'");
    		}
    	}

    	get imagePosition() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imagePosition(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imagePath() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imagePath(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overtitle() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overtitle(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shapes() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shapes(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchor() {
    		throw new Error("<BlockWithImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchor(value) {
    		throw new Error("<BlockWithImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Bubbles.svelte generated by Svelte v3.43.0 */
    const file$9 = "src/components/Bubbles.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (60:4) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let each_value_1 = /*bubbles*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "bubbles__bubbles");
    			add_location(div, file$9, 60, 6, 1687);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*generateBlob, bubbles*/ 4) {
    				each_value_1 = /*bubbles*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(60:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if slider}
    function create_if_block$4(ctx) {
    	let div0;
    	let swiper;
    	let t0;
    	let div1;
    	let current;

    	swiper = new Swiper({
    			props: {
    				modules: [Navigation],
    				loop: true,
    				navigation: /*navigation*/ ctx[5],
    				class: "bubbles__slides",
    				spaceBetween: 50,
    				slidesPerView: 4,
    				breakpoints: /*breakpoints*/ ctx[6],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("slideChange", slideChange_handler$2);
    	swiper.$on("swiper", swiper_handler$2);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(swiper.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Next ->";
    			attr_dev(div0, "class", "bubbles__bubbles");
    			add_location(div0, file$9, 36, 6, 876);
    			attr_dev(div1, "class", "bubbles__next");
    			add_location(div1, file$9, 58, 6, 1628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(swiper, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};

    			if (dirty & /*$$scope, bubbles*/ 8196) {
    				swiper_changes.$$scope = { dirty, ctx };
    			}

    			swiper.$set(swiper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(swiper);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(36:4) {#if slider}",
    		ctx
    	});

    	return block;
    }

    // (62:8) {#each bubbles as bubble}
    function create_each_block_1$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0_value = /*bubble*/ ctx[8].text + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text$1(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			attr_dev(div0, "class", "bubbles__bubble__text");
    			add_location(div0, file$9, 64, 14, 1858);
    			attr_dev(div1, "class", "bubbles__bubble__bg");
    			set_style(div1, "border-radius", generateBlob());
    			set_style(div1, "background-color", /*bubble*/ ctx[8].color);
    			add_location(div1, file$9, 65, 14, 1927);
    			attr_dev(div2, "class", "bubbles__bubble");
    			add_location(div2, file$9, 63, 12, 1814);
    			attr_dev(div3, "class", "bubbles__bubble-container");
    			add_location(div3, file$9, 62, 10, 1762);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div3, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bubbles*/ 4 && t0_value !== (t0_value = /*bubble*/ ctx[8].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*bubbles*/ 4) {
    				set_style(div1, "background-color", /*bubble*/ ctx[8].color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(62:8) {#each bubbles as bubble}",
    		ctx
    	});

    	return block;
    }

    // (50:12) <SwiperSlide>
    function create_default_slot_1$2(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*bubble*/ ctx[8].text + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text$1(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			attr_dev(div0, "class", "bubbles__bubble__text");
    			add_location(div0, file$9, 51, 16, 1340);
    			attr_dev(div1, "class", "bubbles__bubble__bg");
    			set_style(div1, "border-radius", generateBlob());
    			set_style(div1, "background-color", /*bubble*/ ctx[8].color);
    			add_location(div1, file$9, 52, 16, 1411);
    			attr_dev(div2, "class", "bubbles__bubble");
    			add_location(div2, file$9, 50, 14, 1294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bubbles*/ 4 && t0_value !== (t0_value = /*bubble*/ ctx[8].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*bubbles*/ 4) {
    				set_style(div1, "background-color", /*bubble*/ ctx[8].color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(50:12) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (49:10) {#each bubbles as bubble}
    function create_each_block$3(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper_slide({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty & /*$$scope, bubbles*/ 8196) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(49:10) {#each bubbles as bubble}",
    		ctx
    	});

    	return block;
    }

    // (38:8) <Swiper           modules={[Navigation]}           loop="{true}"           navigation={navigation}           class="bubbles__slides"           spaceBetween={50}           slidesPerView={4}           breakpoints={breakpoints}           on:slideChange={() => {}}           on:swiper={(e) => {}}         >
    function create_default_slot$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*bubbles*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*generateBlob, bubbles*/ 4) {
    				each_value = /*bubbles*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(38:8) <Swiper           modules={[Navigation]}           loop=\\\"{true}\\\"           navigation={navigation}           class=\\\"bubbles__slides\\\"           spaceBetween={50}           slidesPerView={4}           breakpoints={breakpoints}           on:slideChange={() => {}}           on:swiper={(e) => {}}         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*slider*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text$1(/*overtitle*/ ctx[0]);
    			t1 = space();
    			h3 = element("h3");
    			t2 = space();
    			if_block.c();
    			attr_dev(div0, "class", "bubbles__overtitle");
    			add_location(div0, file$9, 33, 4, 753);
    			attr_dev(h3, "class", "bubbles__title");
    			add_location(h3, file$9, 34, 4, 807);
    			attr_dev(div1, "class", "bubbles");
    			add_location(div1, file$9, 32, 2, 727);
    			attr_dev(div2, "class", "wrapper");
    			attr_dev(div2, "id", /*HTMLanchor*/ ctx[4]);
    			add_location(div2, file$9, 31, 0, 685);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, h3);
    			h3.innerHTML = /*title*/ ctx[1];
    			append_dev(div1, t2);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*overtitle*/ 1) set_data_dev(t0, /*overtitle*/ ctx[0]);
    			if (!current || dirty & /*title*/ 2) h3.innerHTML = /*title*/ ctx[1];			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const slideChange_handler$2 = () => {
    	
    };

    const swiper_handler$2 = e => {
    	
    };

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bubbles', slots, []);
    	let { overtitle = "overtitle" } = $$props;
    	let { title = "Title for hero component" } = $$props;
    	let { bubbles = ['first', 'second', 'third'] } = $$props;
    	let { slider = false } = $$props;
    	let { anchor } = $$props;
    	let HTMLanchor = anchor ? anchor : overtitle;
    	let navigation = { nextEl: '.bubbles__next' };

    	let breakpoints = {
    		'320': { slidesPerView: 1, spaceBetween: 20 },
    		'640': { slidesPerView: 2, spaceBetween: 40 },
    		'1200': { slidesPerView: 4, spaceBetween: 50 }
    	};

    	const writable_props = ['overtitle', 'title', 'bubbles', 'slider', 'anchor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bubbles> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('overtitle' in $$props) $$invalidate(0, overtitle = $$props.overtitle);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('bubbles' in $$props) $$invalidate(2, bubbles = $$props.bubbles);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    	};

    	$$self.$capture_state = () => ({
    		overtitle,
    		title,
    		bubbles,
    		slider,
    		anchor,
    		HTMLanchor,
    		generateBlob,
    		navigation,
    		breakpoints,
    		Navigation,
    		Swiper,
    		SwiperSlide: Swiper_slide
    	});

    	$$self.$inject_state = $$props => {
    		if ('overtitle' in $$props) $$invalidate(0, overtitle = $$props.overtitle);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('bubbles' in $$props) $$invalidate(2, bubbles = $$props.bubbles);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    		if ('HTMLanchor' in $$props) $$invalidate(4, HTMLanchor = $$props.HTMLanchor);
    		if ('navigation' in $$props) $$invalidate(5, navigation = $$props.navigation);
    		if ('breakpoints' in $$props) $$invalidate(6, breakpoints = $$props.breakpoints);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [overtitle, title, bubbles, slider, HTMLanchor, navigation, breakpoints, anchor];
    }

    class Bubbles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			overtitle: 0,
    			title: 1,
    			bubbles: 2,
    			slider: 3,
    			anchor: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bubbles",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*anchor*/ ctx[7] === undefined && !('anchor' in props)) {
    			console.warn("<Bubbles> was created without expected prop 'anchor'");
    		}
    	}

    	get overtitle() {
    		throw new Error("<Bubbles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overtitle(value) {
    		throw new Error("<Bubbles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Bubbles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Bubbles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bubbles() {
    		throw new Error("<Bubbles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bubbles(value) {
    		throw new Error("<Bubbles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slider() {
    		throw new Error("<Bubbles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slider(value) {
    		throw new Error("<Bubbles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchor() {
    		throw new Error("<Bubbles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchor(value) {
    		throw new Error("<Bubbles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Cards.svelte generated by Svelte v3.43.0 */
    const file$8 = "src/components/Cards.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (55:4) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let each_value_1 = /*cards*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "cards__container");
    			add_location(div, file$8, 55, 6, 1397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4) {
    				each_value_1 = /*cards*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(55:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if slider}
    function create_if_block$3(ctx) {
    	let swiper;
    	let t0;
    	let div;
    	let current;

    	swiper = new Swiper({
    			props: {
    				modules: [Navigation],
    				loop: true,
    				navigation: /*navigation*/ ctx[5],
    				class: "cards__container",
    				spaceBetween: 50,
    				slidesPerView: 4,
    				breakpoints: /*breakpoints*/ ctx[6],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("slideChange", slideChange_handler$1);
    	swiper.$on("swiper", swiper_handler$1);

    	const block = {
    		c: function create() {
    			create_component(swiper.$$.fragment);
    			t0 = space();
    			div = element("div");
    			div.textContent = "Next ->";
    			attr_dev(div, "class", "cards__next");
    			add_location(div, file$8, 53, 6, 1340);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiper, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};

    			if (dirty & /*$$scope, cards*/ 8196) {
    				swiper_changes.$$scope = { dirty, ctx };
    			}

    			swiper.$set(swiper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiper, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(33:4) {#if slider}",
    		ctx
    	});

    	return block;
    }

    // (57:8) {#each cards as card}
    function create_each_block_1$1(ctx) {
    	let div;
    	let h4;
    	let raw_value = /*card*/ ctx[8].title + "";
    	let t0;
    	let t1_value = /*card*/ ctx[8].description + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = space();
    			t1 = text$1(t1_value);
    			t2 = space();
    			attr_dev(h4, "class", "cards__card__title");
    			add_location(h4, file$8, 58, 12, 1506);
    			attr_dev(div, "class", "cards__card");
    			add_location(div, file$8, 57, 10, 1468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			h4.innerHTML = raw_value;
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4 && raw_value !== (raw_value = /*card*/ ctx[8].title + "")) h4.innerHTML = raw_value;			if (dirty & /*cards*/ 4 && t1_value !== (t1_value = /*card*/ ctx[8].description + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(57:8) {#each cards as card}",
    		ctx
    	});

    	return block;
    }

    // (46:10) <SwiperSlide>
    function create_default_slot_1$1(ctx) {
    	let div;
    	let h4;
    	let raw_value = /*card*/ ctx[8].title + "";
    	let t0;
    	let t1_value = /*card*/ ctx[8].description + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = space();
    			t1 = text$1(t1_value);
    			t2 = space();
    			attr_dev(h4, "class", "cards__card__title");
    			add_location(h4, file$8, 47, 14, 1170);
    			attr_dev(div, "class", "cards__card");
    			add_location(div, file$8, 46, 12, 1130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			h4.innerHTML = raw_value;
    			append_dev(div, t0);
    			append_dev(div, t1);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4 && raw_value !== (raw_value = /*card*/ ctx[8].title + "")) h4.innerHTML = raw_value;			if (dirty & /*cards*/ 4 && t1_value !== (t1_value = /*card*/ ctx[8].description + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(46:10) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (45:8) {#each cards as card}
    function create_each_block$2(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper_slide({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty & /*$$scope, cards*/ 8196) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(45:8) {#each cards as card}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Swiper         modules={[Navigation]}         loop="{true}"         navigation={navigation}         class="cards__container"         spaceBetween={50}         slidesPerView={4}         breakpoints={breakpoints}         on:slideChange={() => {}}         on:swiper={(e) => {}}       >
    function create_default_slot$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*cards*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cards*/ 4) {
    				each_value = /*cards*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(34:6) <Swiper         modules={[Navigation]}         loop=\\\"{true}\\\"         navigation={navigation}         class=\\\"cards__container\\\"         spaceBetween={50}         slidesPerView={4}         breakpoints={breakpoints}         on:slideChange={() => {}}         on:swiper={(e) => {}}       >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*slider*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text$1(/*overtitle*/ ctx[1]);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text$1(/*title*/ ctx[0]);
    			t3 = space();
    			if_block.c();
    			attr_dev(div0, "class", "cards__overtitle");
    			add_location(div0, file$8, 30, 4, 667);
    			attr_dev(h3, "class", "cards__title");
    			add_location(h3, file$8, 31, 4, 719);
    			attr_dev(div1, "class", "cards");
    			add_location(div1, file$8, 29, 2, 643);
    			attr_dev(div2, "class", "wrapper");
    			attr_dev(div2, "id", /*HTMLanchor*/ ctx[4]);
    			add_location(div2, file$8, 28, 0, 601);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, h3);
    			append_dev(h3, t2);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*overtitle*/ 2) set_data_dev(t0, /*overtitle*/ ctx[1]);
    			if (!current || dirty & /*title*/ 1) set_data_dev(t2, /*title*/ ctx[0]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const slideChange_handler$1 = () => {
    	
    };

    const swiper_handler$1 = e => {
    	
    };

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cards', slots, []);
    	let { title = "Title for hero component" } = $$props;
    	let { overtitle = "overtitle" } = $$props;
    	let { cards = [] } = $$props;
    	let { slider = false } = $$props;
    	let { anchor } = $$props;
    	let HTMLanchor = anchor ? anchor : overtitle;
    	let navigation = { nextEl: '.cards__next' };

    	let breakpoints = {
    		'320': { slidesPerView: 1, spaceBetween: 20 },
    		'640': { slidesPerView: 2, spaceBetween: 40 },
    		'1200': { slidesPerView: 4, spaceBetween: 50 }
    	};

    	const writable_props = ['title', 'overtitle', 'cards', 'slider', 'anchor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cards> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('overtitle' in $$props) $$invalidate(1, overtitle = $$props.overtitle);
    		if ('cards' in $$props) $$invalidate(2, cards = $$props.cards);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		overtitle,
    		cards,
    		slider,
    		anchor,
    		HTMLanchor,
    		navigation,
    		breakpoints,
    		Navigation,
    		Swiper,
    		SwiperSlide: Swiper_slide
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('overtitle' in $$props) $$invalidate(1, overtitle = $$props.overtitle);
    		if ('cards' in $$props) $$invalidate(2, cards = $$props.cards);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    		if ('HTMLanchor' in $$props) $$invalidate(4, HTMLanchor = $$props.HTMLanchor);
    		if ('navigation' in $$props) $$invalidate(5, navigation = $$props.navigation);
    		if ('breakpoints' in $$props) $$invalidate(6, breakpoints = $$props.breakpoints);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, overtitle, cards, slider, HTMLanchor, navigation, breakpoints, anchor];
    }

    class Cards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			title: 0,
    			overtitle: 1,
    			cards: 2,
    			slider: 3,
    			anchor: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cards",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*anchor*/ ctx[7] === undefined && !('anchor' in props)) {
    			console.warn("<Cards> was created without expected prop 'anchor'");
    		}
    	}

    	get title() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overtitle() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overtitle(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cards() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cards(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slider() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slider(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchor() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchor(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Carousel.svelte generated by Svelte v3.43.0 */
    const file$7 = "src/components/Carousel.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (59:4) {:else}
    function create_else_block(ctx) {
    	let div;
    	let each_value_1 = /*slides*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "carousel__slides carousel__slides--no-slider");
    			add_location(div, file$7, 59, 6, 1438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*slides*/ 4) {
    				each_value_1 = /*slides*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(59:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if slider}
    function create_if_block$2(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let swiper;
    	let t2;
    	let div;
    	let current;

    	swiper = new Swiper({
    			props: {
    				modules: [Navigation],
    				loop: true,
    				navigation: /*navigation*/ ctx[5],
    				class: "carousel__slides",
    				spaceBetween: 50,
    				slidesPerView: 4,
    				breakpoints: /*breakpoints*/ ctx[6],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("slideChange", slideChange_handler);
    	swiper.$on("swiper", swiper_handler);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text$1(/*title*/ ctx[0]);
    			t1 = space();
    			create_component(swiper.$$.fragment);
    			t2 = space();
    			div = element("div");
    			div.textContent = "Next ->";
    			attr_dev(h3, "class", "carousel__title");
    			add_location(h3, file$7, 37, 6, 798);
    			attr_dev(div, "class", "carousel__next");
    			add_location(div, file$7, 57, 6, 1378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(swiper, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			const swiper_changes = {};

    			if (dirty & /*$$scope, slides*/ 8196) {
    				swiper_changes.$$scope = { dirty, ctx };
    			}

    			swiper.$set(swiper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_component(swiper, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(37:4) {#if slider}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#each slides as slide}
    function create_each_block_1(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = /*slide*/ ctx[8].image + "";
    	let t0;
    	let h4;
    	let t1_value = /*slide*/ ctx[8].title + "";
    	let t1;
    	let t2;
    	let t3_value = /*slide*/ ctx[8].description + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			html_tag = new HtmlTag();
    			t0 = space();
    			h4 = element("h4");
    			t1 = text$1(t1_value);
    			t2 = space();
    			t3 = text$1(t3_value);
    			t4 = space();
    			html_tag.a = t0;
    			attr_dev(h4, "class", "carousel__slide__title");
    			add_location(h4, file$7, 63, 12, 1613);
    			attr_dev(div, "class", "carousel__slide");
    			add_location(div, file$7, 61, 10, 1539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(h4, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*slides*/ 4 && raw_value !== (raw_value = /*slide*/ ctx[8].image + "")) html_tag.p(raw_value);
    			if (dirty & /*slides*/ 4 && t1_value !== (t1_value = /*slide*/ ctx[8].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*slides*/ 4 && t3_value !== (t3_value = /*slide*/ ctx[8].description + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(61:8) {#each slides as slide}",
    		ctx
    	});

    	return block;
    }

    // (51:10) <SwiperSlide>
    function create_default_slot_1(ctx) {
    	let html_tag;
    	let raw_value = /*slide*/ ctx[8].image + "";
    	let t0;
    	let h4;
    	let t1_value = /*slide*/ ctx[8].title + "";
    	let t1;
    	let t2;
    	let t3_value = /*slide*/ ctx[8].description + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t0 = space();
    			h4 = element("h4");
    			t1 = text$1(t1_value);
    			t2 = space();
    			t3 = text$1(t3_value);
    			t4 = space();
    			html_tag.a = t0;
    			attr_dev(h4, "class", "carousel__slide__title");
    			add_location(h4, file$7, 52, 12, 1229);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*slides*/ 4 && raw_value !== (raw_value = /*slide*/ ctx[8].image + "")) html_tag.p(raw_value);
    			if (dirty & /*slides*/ 4 && t1_value !== (t1_value = /*slide*/ ctx[8].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*slides*/ 4 && t3_value !== (t3_value = /*slide*/ ctx[8].description + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(51:10) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (50:8) {#each slides as slide}
    function create_each_block$1(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper_slide({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty & /*$$scope, slides*/ 8196) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(50:8) {#each slides as slide}",
    		ctx
    	});

    	return block;
    }

    // (39:6) <Swiper         modules={[Navigation]}         loop="{true}"         navigation={navigation}         class="carousel__slides"         spaceBetween={50}         slidesPerView={4}         breakpoints={breakpoints}         on:slideChange={() => {}}         on:swiper={(e) => {}}       >
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*slides*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*slides*/ 4) {
    				each_value = /*slides*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(39:6) <Swiper         modules={[Navigation]}         loop=\\\"{true}\\\"         navigation={navigation}         class=\\\"carousel__slides\\\"         spaceBetween={50}         slidesPerView={4}         breakpoints={breakpoints}         on:slideChange={() => {}}         on:swiper={(e) => {}}       >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*slider*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text$1(/*overtitle*/ ctx[1]);
    			t1 = space();
    			if_block.c();
    			attr_dev(div0, "class", "carousel__overtitle");
    			add_location(div0, file$7, 33, 4, 712);
    			attr_dev(div1, "class", "carousel");
    			add_location(div1, file$7, 32, 2, 685);
    			attr_dev(div2, "class", "wrapper");
    			attr_dev(div2, "id", /*HTMLanchor*/ ctx[4]);
    			add_location(div2, file$7, 31, 0, 643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*overtitle*/ 2) set_data_dev(t0, /*overtitle*/ ctx[1]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const slideChange_handler = () => {
    	
    };

    const swiper_handler = e => {
    	
    };

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, []);
    	let { title = "Title for hero component" } = $$props;
    	let { overtitle = "overtitle" } = $$props;
    	let { slides = [] } = $$props;
    	let { slider = true } = $$props;
    	let { anchor } = $$props;
    	let HTMLanchor = anchor ? anchor : overtitle;
    	let navigation = { nextEl: '.carousel__next' };

    	let breakpoints = {
    		'320': { slidesPerView: 1, spaceBetween: 20 },
    		'640': { slidesPerView: 2, spaceBetween: 40 },
    		'1200': { slidesPerView: 4, spaceBetween: 50 }
    	};

    	const writable_props = ['title', 'overtitle', 'slides', 'slider', 'anchor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('overtitle' in $$props) $$invalidate(1, overtitle = $$props.overtitle);
    		if ('slides' in $$props) $$invalidate(2, slides = $$props.slides);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		overtitle,
    		slides,
    		slider,
    		anchor,
    		HTMLanchor,
    		navigation,
    		breakpoints,
    		Navigation,
    		Swiper,
    		SwiperSlide: Swiper_slide
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('overtitle' in $$props) $$invalidate(1, overtitle = $$props.overtitle);
    		if ('slides' in $$props) $$invalidate(2, slides = $$props.slides);
    		if ('slider' in $$props) $$invalidate(3, slider = $$props.slider);
    		if ('anchor' in $$props) $$invalidate(7, anchor = $$props.anchor);
    		if ('HTMLanchor' in $$props) $$invalidate(4, HTMLanchor = $$props.HTMLanchor);
    		if ('navigation' in $$props) $$invalidate(5, navigation = $$props.navigation);
    		if ('breakpoints' in $$props) $$invalidate(6, breakpoints = $$props.breakpoints);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, overtitle, slides, slider, HTMLanchor, navigation, breakpoints, anchor];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			title: 0,
    			overtitle: 1,
    			slides: 2,
    			slider: 3,
    			anchor: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*anchor*/ ctx[7] === undefined && !('anchor' in props)) {
    			console.warn("<Carousel> was created without expected prop 'anchor'");
    		}
    	}

    	get title() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overtitle() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overtitle(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slides() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slides(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slider() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slider(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchor() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchor(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Hero.svelte generated by Svelte v3.43.0 */
    const file$6 = "src/components/Hero.svelte";

    // (17:4) {#if cta}
    function create_if_block$1(ctx) {
    	let div;
    	let t0_value = /*cta*/ ctx[4].text + "";
    	let t0;
    	let t1;
    	let if_block = /*cta*/ ctx[4].arrow && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text$1(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "hero__cta");
    			add_location(div, file$6, 17, 6, 461);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cta*/ 16 && t0_value !== (t0_value = /*cta*/ ctx[4].text + "")) set_data_dev(t0, t0_value);

    			if (/*cta*/ ctx[4].arrow) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(17:4) {#if cta}",
    		ctx
    	});

    	return block;
    }

    // (20:8) {#if cta.arrow}
    function create_if_block_1(ctx) {
    	let div;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text$1("->");
    			attr_dev(div, "class", div_class_value = "arrow arrow--" + /*cta*/ ctx[4].arrow);
    			add_location(div, file$6, 20, 10, 538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cta*/ 16 && div_class_value !== (div_class_value = "arrow arrow--" + /*cta*/ ctx[4].arrow)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(20:8) {#if cta.arrow}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let t4;
    	let blobs;
    	let current;
    	let if_block = /*cta*/ ctx[4] && create_if_block$1(ctx);

    	blobs = new Blobs({
    			props: {
    				shapes: /*shapes*/ ctx[2],
    				colors: /*colors*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text$1(/*title*/ ctx[0]);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text$1(/*subtitle*/ ctx[1]);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			create_component(blobs.$$.fragment);
    			attr_dev(h1, "class", "hero__title");
    			add_location(h1, file$6, 13, 6, 344);
    			attr_dev(h3, "class", "hero__subtitle");
    			add_location(h3, file$6, 14, 6, 387);
    			attr_dev(div0, "class", "hero__content");
    			add_location(div0, file$6, 12, 4, 310);
    			attr_dev(div1, "class", "hero");
    			add_location(div1, file$6, 11, 2, 287);
    			attr_dev(div2, "class", "wrapper");
    			add_location(div2, file$6, 10, 0, 263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h3);
    			append_dev(h3, t2);
    			append_dev(div1, t3);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div2, t4);
    			mount_component(blobs, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*subtitle*/ 2) set_data_dev(t2, /*subtitle*/ ctx[1]);

    			if (/*cta*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const blobs_changes = {};
    			if (dirty & /*shapes*/ 4) blobs_changes.shapes = /*shapes*/ ctx[2];
    			if (dirty & /*colors*/ 8) blobs_changes.colors = /*colors*/ ctx[3];
    			blobs.$set(blobs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blobs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blobs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_component(blobs);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	let { title = "Title for hero component" } = $$props;
    	let { subtitle = "Subtitle for hero component" } = $$props;
    	let { shapes = 2 } = $$props;
    	let { colors = ['red', 'yellow', 'blue'] } = $$props;
    	let { cta = false } = $$props;
    	const writable_props = ['title', 'subtitle', 'shapes', 'colors', 'cta'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ('shapes' in $$props) $$invalidate(2, shapes = $$props.shapes);
    		if ('colors' in $$props) $$invalidate(3, colors = $$props.colors);
    		if ('cta' in $$props) $$invalidate(4, cta = $$props.cta);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		subtitle,
    		shapes,
    		colors,
    		cta,
    		Blobs
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ('shapes' in $$props) $$invalidate(2, shapes = $$props.shapes);
    		if ('colors' in $$props) $$invalidate(3, colors = $$props.colors);
    		if ('cta' in $$props) $$invalidate(4, cta = $$props.cta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, subtitle, shapes, colors, cta];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			shapes: 2,
    			colors: 3,
    			cta: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get title() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shapes() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shapes(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cta() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cta(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Spacer.svelte generated by Svelte v3.43.0 */

    const file$5 = "src/components/Spacer.svelte";

    function create_fragment$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "spacer");
    			set_style(div, "height", /*height*/ ctx[0] + "px");
    			add_location(div, file$5, 4, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*height*/ 1) {
    				set_style(div, "height", /*height*/ ctx[0] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spacer', slots, []);
    	let { height = 100 } = $$props;
    	const writable_props = ['height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spacer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({ height });

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [height];
    }

    class Spacer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { height: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spacer",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get height() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DedeLogo.svelte generated by Svelte v3.43.0 */

    const file$4 = "src/components/DedeLogo.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let path10;
    	let path11;
    	let path12;
    	let path13;
    	let path14;
    	let path15;
    	let path16;
    	let path17;
    	let path18;
    	let path19;
    	let path20;
    	let path21;
    	let path22;
    	let path23;
    	let path24;
    	let path25;
    	let path26;
    	let path27;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			path13 = svg_element("path");
    			path14 = svg_element("path");
    			path15 = svg_element("path");
    			path16 = svg_element("path");
    			path17 = svg_element("path");
    			path18 = svg_element("path");
    			path19 = svg_element("path");
    			path20 = svg_element("path");
    			path21 = svg_element("path");
    			path22 = svg_element("path");
    			path23 = svg_element("path");
    			path24 = svg_element("path");
    			path25 = svg_element("path");
    			path26 = svg_element("path");
    			path27 = svg_element("path");
    			attr_dev(path0, "d", "M4.23644 51.8377H6.43718C8.19452 51.8377 9.19929 50.7597 9.19929 48.8804V48.8722C9.19929 47.0335 8.18232 45.9677 6.43718 45.9677H4.23644V48.5183H3.51235V49.2831H4.23644V51.8377ZM5.28596 50.955V49.2831H6.49007V48.5183H5.28596V46.8505H6.29887C7.45009 46.8505 8.12943 47.599 8.12943 48.8885V48.8966C8.12943 50.2146 7.46636 50.955 6.29887 50.955H5.28596Z");
    			attr_dev(path0, "fill", "#214250");
    			add_location(path0, file$4, 1, 0, 98);
    			attr_dev(path1, "d", "M15.5477 46.8505H19.9289V45.9677H15.5477V46.8505ZM15.9017 49.2749H19.575V48.441H15.9017V49.2749ZM15.5477 51.8377H19.9289V50.955H15.5477V51.8377Z");
    			attr_dev(path1, "fill", "#214250");
    			add_location(path1, file$4, 2, 0, 476);
    			attr_dev(path2, "d", "M28.9784 51.9842C30.333 51.9842 31.3053 51.1991 31.4599 50.0234V49.995H30.4307L30.4266 50.0153C30.2761 50.6621 29.7229 51.077 28.9784 51.077C27.9777 51.077 27.3553 50.2431 27.3553 48.9048V48.8966C27.3553 47.5624 27.9777 46.7284 28.9744 46.7284C29.7147 46.7284 30.2761 47.1881 30.4266 47.8837L30.4307 47.9H31.4599V47.8674C31.3215 46.6674 30.3086 45.8213 28.9744 45.8213C27.3106 45.8213 26.2814 46.9969 26.2814 48.9007V48.9088C26.2814 50.8045 27.3147 51.9842 28.9784 51.9842Z");
    			attr_dev(path2, "fill", "#214250");
    			add_location(path2, file$4, 3, 0, 648);
    			attr_dev(path3, "d", "M37.9263 51.8377H41.7257V50.955H38.9758V49.2749H41.5752V48.441H38.9758V46.8505H41.7257V45.9677H37.9263V51.8377Z");
    			attr_dev(path3, "fill", "#214250");
    			add_location(path3, file$4, 4, 0, 1149);
    			attr_dev(path4, "d", "M48.3223 51.8377H49.3352V47.7942H49.4003L52.2844 51.8377H53.1916V45.9677H52.1828V50.0112H52.1177L49.2335 45.9677H48.3223V51.8377Z");
    			attr_dev(path4, "fill", "#214250");
    			add_location(path4, file$4, 5, 0, 1288);
    			attr_dev(path5, "d", "M61.3991 51.8377H62.4486V46.8505H64.2588V45.9677H59.5929V46.8505H61.3991V51.8377Z");
    			attr_dev(path5, "fill", "#214250");
    			add_location(path5, file$4, 6, 0, 1445);
    			attr_dev(path6, "d", "M70.652 51.8377H71.7015V49.6289H72.865L74.0162 51.8377H75.2162L73.9348 49.4702C74.6304 49.218 75.0413 48.5753 75.0413 47.7983V47.7902C75.0413 46.6715 74.2847 45.9677 73.0236 45.9677H70.652V51.8377ZM71.7015 48.8234V46.8179H72.8934C73.5606 46.8179 73.9633 47.2003 73.9633 47.8146V47.8227C73.9633 48.4532 73.5769 48.8234 72.9138 48.8234H71.7015Z");
    			attr_dev(path6, "fill", "#214250");
    			add_location(path6, file$4, 7, 0, 1554);
    			attr_dev(path7, "d", "M81.1742 51.8377H82.2725L82.7606 50.3204H84.9329L85.4251 51.8377H86.5235L84.4407 45.9677H83.2569L81.1742 51.8377ZM83.8142 47.0579H83.8834L84.6726 49.5109H83.0251L83.8142 47.0579Z");
    			attr_dev(path7, "fill", "#214250");
    			add_location(path7, file$4, 8, 0, 1924);
    			attr_dev(path8, "d", "M92.8272 51.8377H96.5696V50.955H93.8767V45.9677H92.8272V51.8377Z");
    			attr_dev(path8, "fill", "#214250");
    			add_location(path8, file$4, 9, 0, 2130);
    			attr_dev(path9, "d", "M102.995 51.8377H104.045V45.9677H102.995V51.8377Z");
    			attr_dev(path9, "fill", "#214250");
    			add_location(path9, file$4, 10, 0, 2222);
    			attr_dev(path10, "d", "M112.826 51.9842C114.233 51.9842 115.116 51.2682 115.116 50.1251V50.1211C115.116 49.2343 114.6 48.738 113.363 48.4776L112.732 48.3434C112 48.1888 111.703 47.9285 111.703 47.5135V47.5095C111.703 47.0091 112.167 46.704 112.818 46.704C113.489 46.7 113.924 47.0254 113.998 47.481L114.006 47.5298H115.01L115.006 47.4769C114.933 46.5332 114.124 45.8213 112.822 45.8213C111.553 45.8213 110.65 46.5291 110.65 47.5786V47.5827C110.65 48.4573 111.17 49.0187 112.37 49.2709L113.001 49.4011C113.758 49.5638 114.063 49.82 114.063 50.2431V50.2472C114.063 50.7516 113.566 51.1014 112.859 51.1014C112.114 51.1014 111.589 50.776 111.541 50.2838L111.536 50.2431H110.519L110.524 50.3001C110.597 51.313 111.463 51.9842 112.826 51.9842Z");
    			attr_dev(path10, "fill", "#214250");
    			add_location(path10, file$4, 11, 0, 2299);
    			attr_dev(path11, "d", "M121.591 51.8377H125.39V50.955H122.64V49.2749H125.24V48.441H122.64V46.8505H125.39V45.9677H121.591V51.8377Z");
    			attr_dev(path11, "fill", "#214250");
    			add_location(path11, file$4, 12, 0, 3041);
    			attr_dev(path12, "d", "M131.987 51.8377H134.188C135.945 51.8377 136.95 50.7597 136.95 48.8804V48.8722C136.95 47.0335 135.933 45.9677 134.188 45.9677H131.987V51.8377ZM133.036 50.955V46.8505H134.049C135.2 46.8505 135.88 47.599 135.88 48.8885V48.8966C135.88 50.2146 135.217 50.955 134.049 50.955H133.036Z");
    			attr_dev(path12, "fill", "#214250");
    			add_location(path12, file$4, 13, 0, 3175);
    			attr_dev(path13, "d", "M4.04587 63.8715H6.2466C8.00394 63.8715 9.00872 62.7935 9.00872 60.9141V60.906C9.00872 59.0673 7.99174 58.0015 6.2466 58.0015H4.04587V60.5521H3.32178V61.3169H4.04587V63.8715ZM5.09539 62.9888V61.3169H6.29949V60.5521H5.09539V58.8843H6.1083C7.25951 58.8843 7.93886 59.6327 7.93886 60.9223V60.9304C7.93886 62.2484 7.27579 62.9888 6.1083 62.9888H5.09539Z");
    			attr_dev(path13, "fill", "#214250");
    			add_location(path13, file$4, 14, 0, 3481);
    			attr_dev(path14, "d", "M17.7454 58.8843H22.1266V58.0015H17.7454V58.8843ZM18.0993 61.3087H21.7726V60.4748H18.0993V61.3087ZM17.7454 63.8715H22.1266V62.9888H17.7454V63.8715Z");
    			attr_dev(path14, "fill", "#214250");
    			add_location(path14, file$4, 15, 0, 3858);
    			attr_dev(path15, "d", "M33.1535 64.018C34.561 64.018 35.4437 63.302 35.4437 62.1589V62.1549C35.4437 61.2681 34.9271 60.7718 33.6904 60.5114L33.0599 60.3772C32.3277 60.2226 32.0307 59.9623 32.0307 59.5473V59.5433C32.0307 59.0429 32.4945 58.7378 33.1453 58.7378C33.8166 58.7337 34.2518 59.0592 34.325 59.5148L34.3332 59.5636H35.3379L35.3339 59.5107C35.2607 58.567 34.4511 57.8551 33.1494 57.8551C31.8802 57.8551 30.9771 58.5629 30.9771 59.6124V59.6165C30.9771 60.4911 31.4978 61.0525 32.6979 61.3047L33.3284 61.4348C34.085 61.5976 34.3901 61.8538 34.3901 62.2769V62.281C34.3901 62.7854 33.8938 63.1352 33.186 63.1352C32.4416 63.1352 31.9168 62.8098 31.868 62.3176L31.864 62.2769H30.847L30.851 62.3338C30.9243 63.3468 31.7907 64.018 33.1535 64.018Z");
    			attr_dev(path15, "fill", "#214250");
    			add_location(path15, file$4, 16, 0, 4033);
    			attr_dev(path16, "d", "M45.7669 63.8715H46.8164V58.8843H48.6266V58.0015H43.9607V58.8843H45.7669V63.8715Z");
    			attr_dev(path16, "fill", "#214250");
    			add_location(path16, file$4, 17, 0, 4783);
    			attr_dev(path17, "d", "M57.4081 63.8715H58.4576V58.0015H57.4081V63.8715Z");
    			attr_dev(path17, "fill", "#214250");
    			add_location(path17, file$4, 18, 0, 4892);
    			attr_dev(path18, "d", "M67.5889 63.8715H68.6018V59.828H68.6669L71.551 63.8715H72.4582V58.0015H71.4493V62.045H71.3842L68.5001 58.0015H67.5889V63.8715Z");
    			attr_dev(path18, "fill", "#214250");
    			add_location(path18, file$4, 19, 0, 4969);
    			attr_dev(path19, "d", "M81.1583 63.8715H82.2566L82.7448 62.3542H84.917L85.4092 63.8715H86.5076L84.4248 58.0015H83.241L81.1583 63.8715ZM83.7983 59.0917H83.8675L84.6567 61.5447H83.0092L83.7983 59.0917Z");
    			attr_dev(path19, "fill", "#214250");
    			add_location(path19, file$4, 20, 0, 5123);
    			attr_dev(path20, "d", "M96.009 63.8715H97.0585V58.8843H98.8688V58.0015H94.2029V58.8843H96.009V63.8715Z");
    			attr_dev(path20, "fill", "#214250");
    			add_location(path20, file$4, 21, 0, 5327);
    			attr_dev(path21, "d", "M107.65 63.8715H108.7V58.0015H107.65V63.8715Z");
    			attr_dev(path21, "fill", "#214250");
    			add_location(path21, file$4, 22, 0, 5434);
    			attr_dev(path22, "d", "M120.361 64.018C122.074 64.018 123.136 62.8261 123.136 60.9385V60.9304C123.136 59.0388 122.07 57.8551 120.361 57.8551C118.657 57.8551 117.583 59.0388 117.583 60.9304V60.9385C117.583 62.8261 118.641 64.018 120.361 64.018ZM120.361 63.1108C119.304 63.1108 118.653 62.2566 118.653 60.9385V60.9304C118.653 59.6043 119.32 58.7622 120.361 58.7622C121.403 58.7622 122.066 59.6043 122.066 60.9304V60.9385C122.066 62.2566 121.407 63.1108 120.361 63.1108Z");
    			attr_dev(path22, "fill", "#214250");
    			add_location(path22, file$4, 23, 0, 5507);
    			attr_dev(path23, "d", "M132.023 63.8715H133.036V59.828H133.101L135.985 63.8715H136.892V58.0015H135.883V62.045H135.818L132.934 58.0015H132.023V63.8715Z");
    			attr_dev(path23, "fill", "#214250");
    			add_location(path23, file$4, 24, 0, 5979);
    			attr_dev(path24, "d", "M4.30524 34.25H17.3903C27.8389 34.25 33.813 27.9602 33.813 16.9945V16.947C33.813 6.21864 27.7664 0 17.3903 0H4.30524V14.882H0V19.3442H4.30524V34.25ZM10.5454 29.0994V19.3442H17.7047V14.882H10.5454V5.15055H16.5679C23.4127 5.15055 27.4519 9.51784 27.4519 17.0419V17.0894C27.4519 24.7796 23.5095 29.0994 16.5679 29.0994H10.5454Z");
    			attr_dev(path24, "fill", "#214250");
    			add_location(path24, file$4, 25, 0, 6134);
    			attr_dev(path25, "d", "M40.0312 5.15055H66.0803V0H40.0312V5.15055ZM42.1354 19.2968H63.976V14.431H42.1354V19.2968ZM40.0312 34.25H66.0803V29.0994H40.0312V34.25Z");
    			attr_dev(path25, "fill", "#214250");
    			add_location(path25, file$4, 26, 0, 6486);
    			attr_dev(path26, "d", "M75.225 34.25H88.31C98.7587 34.25 104.733 27.9602 104.733 16.9945V16.947C104.733 6.21864 98.6861 0 88.31 0H75.225V14.882H70.9198V19.3442H75.225V34.25ZM81.4652 29.0994V19.3442H88.6244V14.882H81.4652V5.15055H87.4876C94.3325 5.15055 98.3717 9.51784 98.3717 17.0419V17.0894C98.3717 24.7796 94.4292 29.0994 87.4876 29.0994H81.4652Z");
    			attr_dev(path26, "fill", "#214250");
    			add_location(path26, file$4, 27, 0, 6649);
    			attr_dev(path27, "d", "M110.951 5.15055H137V0H110.951V5.15055ZM113.055 19.2968H134.896V14.431H113.055V19.2968ZM110.951 34.25H137V29.0994H110.951V34.25Z");
    			attr_dev(path27, "fill", "#214250");
    			add_location(path27, file$4, 28, 0, 7003);
    			attr_dev(svg, "width", "137");
    			attr_dev(svg, "height", "65");
    			attr_dev(svg, "viewBox", "0 0 137 65");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(svg, path6);
    			append_dev(svg, path7);
    			append_dev(svg, path8);
    			append_dev(svg, path9);
    			append_dev(svg, path10);
    			append_dev(svg, path11);
    			append_dev(svg, path12);
    			append_dev(svg, path13);
    			append_dev(svg, path14);
    			append_dev(svg, path15);
    			append_dev(svg, path16);
    			append_dev(svg, path17);
    			append_dev(svg, path18);
    			append_dev(svg, path19);
    			append_dev(svg, path20);
    			append_dev(svg, path21);
    			append_dev(svg, path22);
    			append_dev(svg, path23);
    			append_dev(svg, path24);
    			append_dev(svg, path25);
    			append_dev(svg, path26);
    			append_dev(svg, path27);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DedeLogo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DedeLogo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DedeLogo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DedeLogo",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* node_modules/svelte-hamburgers/src/Hamburger.svelte generated by Svelte v3.43.0 */

    const file$3 = "node_modules/svelte-hamburgers/src/Hamburger.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let span1;
    	let span0;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span1 = element("span");
    			span0 = element("span");
    			attr_dev(span0, "class", "hamburger-inner");
    			add_location(span0, file$3, 22, 8, 445);
    			attr_dev(span1, "class", "hamburger-box");
    			add_location(span1, file$3, 21, 4, 408);
    			attr_dev(button, "class", button_class_value = "hamburger hamburger--" + /*type*/ ctx[1] + " " + (/*open*/ ctx[0] && 'is-active'));
    			add_location(button, file$3, 17, 0, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span1);
    			append_dev(span1, span0);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*type, open*/ 3 && button_class_value !== (button_class_value = "hamburger hamburger--" + /*type*/ ctx[1] + " " + (/*open*/ ctx[0] && 'is-active'))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hamburger', slots, []);
    	let { open } = $$props;
    	let { type = 'spin' } = $$props;
    	const writable_props = ['open', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hamburger> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => $$invalidate(0, open = !open);

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ open, type });

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, type, click_handler, click_handler_1];
    }

    class Hamburger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { open: 0, type: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hamburger",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*open*/ ctx[0] === undefined && !('open' in props)) {
    			console.warn("<Hamburger> was created without expected prop 'open'");
    		}
    	}

    	get open() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/components/Header.svelte generated by Svelte v3.43.0 */
    const file$2 = "src/components/Header.svelte";

    // (35:2) {#if open}
    function create_if_block(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let span0;
    	let t1;
    	let li1;
    	let span1;
    	let t3;
    	let li2;
    	let span2;
    	let t5;
    	let li3;
    	let span3;
    	let t7;
    	let li4;
    	let span4;
    	let t9;
    	let li5;
    	let span5;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			span0.textContent = "Solution";
    			t1 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = "Why";
    			t3 = space();
    			li2 = element("li");
    			span2 = element("span");
    			span2.textContent = "How";
    			t5 = space();
    			li3 = element("li");
    			span3 = element("span");
    			span3.textContent = "What";
    			t7 = space();
    			li4 = element("li");
    			span4 = element("span");
    			span4.textContent = "Who";
    			t9 = space();
    			li5 = element("li");
    			span5 = element("span");
    			span5.textContent = "Micromaster";
    			attr_dev(span0, "data-smoothscroll", "#Solution");
    			add_location(span0, file$2, 37, 39, 1210);
    			attr_dev(li0, "class", "header__menu__item");
    			add_location(li0, file$2, 37, 8, 1179);
    			attr_dev(span1, "data-smoothscroll", "#Why");
    			add_location(span1, file$2, 38, 39, 1306);
    			attr_dev(li1, "class", "header__menu__item");
    			add_location(li1, file$2, 38, 8, 1275);
    			attr_dev(span2, "data-smoothscroll", "#How");
    			add_location(span2, file$2, 39, 39, 1392);
    			attr_dev(li2, "class", "header__menu__item");
    			add_location(li2, file$2, 39, 8, 1361);
    			attr_dev(span3, "data-smoothscroll", "#What");
    			add_location(span3, file$2, 40, 39, 1478);
    			attr_dev(li3, "class", "header__menu__item");
    			add_location(li3, file$2, 40, 8, 1447);
    			attr_dev(span4, "data-smoothscroll", "#Who");
    			add_location(span4, file$2, 41, 39, 1566);
    			attr_dev(li4, "class", "header__menu__item");
    			add_location(li4, file$2, 41, 8, 1535);
    			attr_dev(span5, "data-smoothscroll", "#Micromaster");
    			add_location(span5, file$2, 42, 39, 1652);
    			attr_dev(li5, "class", "header__menu__item");
    			add_location(li5, file$2, 42, 8, 1621);
    			attr_dev(ul, "class", "header__menu");
    			add_location(ul, file$2, 36, 6, 1145);
    			attr_dev(div, "class", "header__menu--mobile");
    			add_location(div, file$2, 35, 4, 1058);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, span1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, span2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, span3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(li4, span4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    			append_dev(li5, span5);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 200, duration: 500 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 200, duration: 500 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(35:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let header;
    	let dedelogo;
    	let t0;
    	let hamburger;
    	let updating_open;
    	let t1;
    	let t2;
    	let ul;
    	let li0;
    	let span0;
    	let t4;
    	let li1;
    	let span1;
    	let t6;
    	let li2;
    	let span2;
    	let t8;
    	let li3;
    	let span3;
    	let t10;
    	let li4;
    	let span4;
    	let t12;
    	let li5;
    	let span5;
    	let current;
    	dedelogo = new DedeLogo({ $$inline: true });

    	function hamburger_open_binding(value) {
    		/*hamburger_open_binding*/ ctx[1](value);
    	}

    	let hamburger_props = { type: "emphatic" };

    	if (/*open*/ ctx[0] !== void 0) {
    		hamburger_props.open = /*open*/ ctx[0];
    	}

    	hamburger = new Hamburger({ props: hamburger_props, $$inline: true });
    	binding_callbacks.push(() => bind(hamburger, 'open', hamburger_open_binding));
    	let if_block = /*open*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(dedelogo.$$.fragment);
    			t0 = space();
    			create_component(hamburger.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			span0.textContent = "Solution";
    			t4 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = "Why";
    			t6 = space();
    			li2 = element("li");
    			span2 = element("span");
    			span2.textContent = "How";
    			t8 = space();
    			li3 = element("li");
    			span3 = element("span");
    			span3.textContent = "What";
    			t10 = space();
    			li4 = element("li");
    			span4 = element("span");
    			span4.textContent = "Who";
    			t12 = space();
    			li5 = element("li");
    			span5 = element("span");
    			span5.textContent = "Micromaster";
    			attr_dev(span0, "data-smoothscroll", "#Solution");
    			add_location(span0, file$2, 48, 35, 1916);
    			attr_dev(li0, "class", "header__menu__item");
    			add_location(li0, file$2, 48, 4, 1885);
    			attr_dev(span1, "data-smoothscroll", "#Why");
    			add_location(span1, file$2, 49, 35, 2008);
    			attr_dev(li1, "class", "header__menu__item");
    			add_location(li1, file$2, 49, 4, 1977);
    			attr_dev(span2, "data-smoothscroll", "#How");
    			add_location(span2, file$2, 50, 35, 2090);
    			attr_dev(li2, "class", "header__menu__item");
    			add_location(li2, file$2, 50, 4, 2059);
    			attr_dev(span3, "data-smoothscroll", "#What");
    			add_location(span3, file$2, 51, 35, 2172);
    			attr_dev(li3, "class", "header__menu__item");
    			add_location(li3, file$2, 51, 4, 2141);
    			attr_dev(span4, "data-smoothscroll", "#Who");
    			add_location(span4, file$2, 52, 35, 2256);
    			attr_dev(li4, "class", "header__menu__item");
    			add_location(li4, file$2, 52, 4, 2225);
    			attr_dev(span5, "data-smoothscroll", "#Micromaster");
    			add_location(span5, file$2, 53, 35, 2338);
    			attr_dev(li5, "class", "header__menu__item");
    			add_location(li5, file$2, 53, 4, 2307);
    			attr_dev(ul, "class", "header__menu header__menu--desk");
    			add_location(ul, file$2, 47, 2, 1836);
    			attr_dev(header, "class", "wrapper header");
    			add_location(header, file$2, 31, 0, 943);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(dedelogo, header, null);
    			append_dev(header, t0);
    			mount_component(hamburger, header, null);
    			append_dev(header, t1);
    			if (if_block) if_block.m(header, null);
    			append_dev(header, t2);
    			append_dev(header, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span0);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, span1);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, span2);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, span3);
    			append_dev(ul, t10);
    			append_dev(ul, li4);
    			append_dev(li4, span4);
    			append_dev(ul, t12);
    			append_dev(ul, li5);
    			append_dev(li5, span5);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const hamburger_changes = {};

    			if (!updating_open && dirty & /*open*/ 1) {
    				updating_open = true;
    				hamburger_changes.open = /*open*/ ctx[0];
    				add_flush_callback(() => updating_open = false);
    			}

    			hamburger.$set(hamburger_changes);

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(header, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dedelogo.$$.fragment, local);
    			transition_in(hamburger.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dedelogo.$$.fragment, local);
    			transition_out(hamburger.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(dedelogo);
    			destroy_component(hamburger);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);

    	afterUpdate(() => {
    		let buttons = document.querySelectorAll('[data-smoothscroll]');

    		buttons.forEach(button => {
    			button.addEventListener('click', function () {
    				$$invalidate(0, open = false);
    				let target = this.getAttribute('data-smoothscroll');
    				let headerOffset = 20;

    				if (window.innerWidth < 1024) {
    					headerOffset = document.querySelector('header.header').offsetHeight + headerOffset;
    				}

    				let offsetPosition = document.querySelector(target).offsetTop - headerOffset;

    				// document.querySelector(target).scrollIntoView({ behavior: 'smooth' })
    				window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    			});
    		});
    	});

    	let open;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function hamburger_open_binding(value) {
    		open = value;
    		$$invalidate(0, open);
    	}

    	$$self.$capture_state = () => ({
    		DedeLogo,
    		Hamburger,
    		fly,
    		afterUpdate,
    		open
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, hamburger_open_binding];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.43.0 */

    const file$1 = "src/components/Footer.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let h3;
    	let t1;
    	let div0;
    	let a;
    	let t3;
    	let div1;
    	let small;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Get in touch with us";
    			t1 = space();
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "contact us";
    			t3 = space();
    			div1 = element("div");
    			small = element("small");
    			small.textContent = "Copyright 2021 of DEDE";
    			attr_dev(h3, "class", "footer__title");
    			add_location(h3, file$1, 5, 4, 69);
    			attr_dev(a, "href", "mailto:info@dede.is");
    			add_location(a, file$1, 7, 32, 384);
    			attr_dev(div0, "class", "footer__button");
    			add_location(div0, file$1, 7, 4, 356);
    			add_location(small, file$1, 8, 36, 471);
    			attr_dev(div1, "class", "footer__disclaimer");
    			add_location(div1, file$1, 8, 4, 439);
    			attr_dev(div2, "class", "wrapper");
    			add_location(div2, file$1, 4, 2, 43);
    			attr_dev(div3, "class", "footer");
    			add_location(div3, file$1, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, small);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (32:1) {#each components as component}
    function create_each_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*component*/ ctx[3], { colors: /*colors*/ ctx[0] }];
    	var switch_value = /*loadedComponents*/ ctx[2][/*component*/ ctx[3].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*components, colors*/ 3)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*components*/ 2 && get_spread_object(/*component*/ ctx[3]),
    					dirty & /*colors*/ 1 && { colors: /*colors*/ ctx[0] }
    				])
    			: {};

    			if (switch_value !== (switch_value = /*loadedComponents*/ ctx[2][/*component*/ ctx[3].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(32:1) {#each components as component}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	let each_value = /*components*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(main, file, 29, 0, 902);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t1);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loadedComponents, components, colors*/ 7) {
    				each_value = /*components*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_each(each_blocks, detaching);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let components;
    	let colors;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let loadedComponents = {
    		BgCards,
    		BlockWithImage,
    		Bubbles,
    		Cards,
    		Carousel,
    		Hero,
    		Spacer
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		data,
    		BgCards,
    		BlockWithImage,
    		Bubbles,
    		Cards,
    		Carousel,
    		Hero,
    		Spacer,
    		Header,
    		Footer,
    		loadedComponents,
    		colors,
    		components
    	});

    	$$self.$inject_state = $$props => {
    		if ('loadedComponents' in $$props) $$invalidate(2, loadedComponents = $$props.loadedComponents);
    		if ('colors' in $$props) $$invalidate(0, colors = $$props.colors);
    		if ('components' in $$props) $$invalidate(1, components = $$props.components);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, components = data.pages.filter(p => p.name == 'Home')[0].components);
    	$$invalidate(0, colors = data.colorPalette);
    	return [colors, components, loadedComponents];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
