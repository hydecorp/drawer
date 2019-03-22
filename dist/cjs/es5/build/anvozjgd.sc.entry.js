"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("../polyfills/tslib.js");
var hy_drawer_core_js_1 = require("../hy-drawer.core.js");
var extendStatics = function (t, e) { return (extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
    e.hasOwnProperty(r) && (t[r] = e[r]); })(t, e); };
function __extends(t, e) { function r() { this.constructor = t; } extendStatics(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }
function isFunction(t) { return "function" == typeof t; }
var _enable_super_gross_mode_that_will_cause_bad_things = !1, config = { Promise: void 0, set useDeprecatedSynchronousErrorHandling(t) { _enable_super_gross_mode_that_will_cause_bad_things = t; }, get useDeprecatedSynchronousErrorHandling() { return _enable_super_gross_mode_that_will_cause_bad_things; } };
function hostReportError(t) { setTimeout(function () { throw t; }); }
var empty = { closed: !0, next: function (t) { }, error: function (t) { if (config.useDeprecatedSynchronousErrorHandling)
        throw t; hostReportError(t); }, complete: function () { } }, isArray = Array.isArray || function (t) { return t && "number" == typeof t.length; };
function isObject(t) { return null !== t && "object" == typeof t; }
function UnsubscriptionErrorImpl(t) { return Error.call(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function (t, e) { return e + 1 + ") " + t.toString(); }).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t, this; }
UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
var UnsubscriptionError = UnsubscriptionErrorImpl, Subscription = function () { function t(t) { this.closed = !1, this._parent = null, this._parents = null, this._subscriptions = null, t && (this._unsubscribe = t); } var e; return t.prototype.unsubscribe = function () { var t, e = !1; if (!this.closed) {
    var r = this._parent, n = this._parents, i = this._unsubscribe, o = this._subscriptions;
    this.closed = !0, this._parent = null, this._parents = null, this._subscriptions = null;
    for (var s = -1, u = n ? n.length : 0; r;)
        r.remove(this), r = ++s < u && n[s] || null;
    if (isFunction(i))
        try {
            i.call(this);
        }
        catch (r) {
            e = !0, t = r instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(r.errors) : [r];
        }
    if (isArray(o))
        for (s = -1, u = o.length; ++s < u;) {
            var c = o[s];
            if (isObject(c))
                try {
                    c.unsubscribe();
                }
                catch (r) {
                    e = !0, t = t || [], r instanceof UnsubscriptionError ? t = t.concat(flattenUnsubscriptionErrors(r.errors)) : t.push(r);
                }
        }
    if (e)
        throw new UnsubscriptionError(t);
} }, t.prototype.add = function (e) { var r = e; switch (typeof e) {
    case "function": r = new t(e);
    case "object":
        if (r === this || r.closed || "function" != typeof r.unsubscribe)
            return r;
        if (this.closed)
            return r.unsubscribe(), r;
        if (!(r instanceof t)) {
            var n = r;
            (r = new t)._subscriptions = [n];
        }
        break;
    default:
        if (!e)
            return t.EMPTY;
        throw new Error("unrecognized teardown " + e + " added to Subscription.");
} if (r._addParent(this)) {
    var i = this._subscriptions;
    i ? i.push(r) : this._subscriptions = [r];
} return r; }, t.prototype.remove = function (t) { var e = this._subscriptions; if (e) {
    var r = e.indexOf(t);
    -1 !== r && e.splice(r, 1);
} }, t.prototype._addParent = function (t) { var e = this._parent, r = this._parents; return e !== t && (e ? r ? -1 === r.indexOf(t) && (r.push(t), !0) : (this._parents = [t], !0) : (this._parent = t, !0)); }, t.EMPTY = ((e = new t).closed = !0, e), t; }();
function flattenUnsubscriptionErrors(t) { return t.reduce(function (t, e) { return t.concat(e instanceof UnsubscriptionError ? e.errors : e); }, []); }
var rxSubscriber = "function" == typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random(), Subscriber = function (t) { function e(r, n, i) { var o = t.call(this) || this; switch (o.syncErrorValue = null, o.syncErrorThrown = !1, o.syncErrorThrowable = !1, o.isStopped = !1, arguments.length) {
    case 0:
        o.destination = empty;
        break;
    case 1:
        if (!r) {
            o.destination = empty;
            break;
        }
        if ("object" == typeof r) {
            r instanceof e ? (o.syncErrorThrowable = r.syncErrorThrowable, o.destination = r, r.add(o)) : (o.syncErrorThrowable = !0, o.destination = new SafeSubscriber(o, r));
            break;
        }
    default: o.syncErrorThrowable = !0, o.destination = new SafeSubscriber(o, r, n, i);
} return o; } return __extends(e, t), e.prototype[rxSubscriber] = function () { return this; }, e.create = function (t, r, n) { var i = new e(t, r, n); return i.syncErrorThrowable = !1, i; }, e.prototype.next = function (t) { this.isStopped || this._next(t); }, e.prototype.error = function (t) { this.isStopped || (this.isStopped = !0, this._error(t)); }, e.prototype.complete = function () { this.isStopped || (this.isStopped = !0, this._complete()); }, e.prototype.unsubscribe = function () { this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this)); }, e.prototype._next = function (t) { this.destination.next(t); }, e.prototype._error = function (t) { this.destination.error(t), this.unsubscribe(); }, e.prototype._complete = function () { this.destination.complete(), this.unsubscribe(); }, e.prototype._unsubscribeAndRecycle = function () { var t = this._parent, e = this._parents; return this._parent = null, this._parents = null, this.unsubscribe(), this.closed = !1, this.isStopped = !1, this._parent = t, this._parents = e, this; }, e; }(Subscription), SafeSubscriber = function (t) { function e(e, r, n, i) { var o, s = t.call(this) || this; s._parentSubscriber = e; var u = s; return isFunction(r) ? o = r : r && (o = r.next, n = r.error, i = r.complete, r !== empty && (isFunction((u = Object.create(r)).unsubscribe) && s.add(u.unsubscribe.bind(u)), u.unsubscribe = s.unsubscribe.bind(s))), s._context = u, s._next = o, s._error = n, s._complete = i, s; } return __extends(e, t), e.prototype.next = function (t) { if (!this.isStopped && this._next) {
    var e = this._parentSubscriber;
    config.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable ? this.__tryOrSetError(e, this._next, t) && this.unsubscribe() : this.__tryOrUnsub(this._next, t);
} }, e.prototype.error = function (t) { if (!this.isStopped) {
    var e = this._parentSubscriber, r = config.useDeprecatedSynchronousErrorHandling;
    if (this._error)
        r && e.syncErrorThrowable ? (this.__tryOrSetError(e, this._error, t), this.unsubscribe()) : (this.__tryOrUnsub(this._error, t), this.unsubscribe());
    else if (e.syncErrorThrowable)
        r ? (e.syncErrorValue = t, e.syncErrorThrown = !0) : hostReportError(t), this.unsubscribe();
    else {
        if (this.unsubscribe(), r)
            throw t;
        hostReportError(t);
    }
} }, e.prototype.complete = function () { var t = this; if (!this.isStopped) {
    var e = this._parentSubscriber;
    if (this._complete) {
        var r = function () { return t._complete.call(t._context); };
        config.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable ? (this.__tryOrSetError(e, r), this.unsubscribe()) : (this.__tryOrUnsub(r), this.unsubscribe());
    }
    else
        this.unsubscribe();
} }, e.prototype.__tryOrUnsub = function (t, e) { try {
    t.call(this._context, e);
}
catch (t) {
    if (this.unsubscribe(), config.useDeprecatedSynchronousErrorHandling)
        throw t;
    hostReportError(t);
} }, e.prototype.__tryOrSetError = function (t, e, r) { if (!config.useDeprecatedSynchronousErrorHandling)
    throw new Error("bad call"); try {
    e.call(this._context, r);
}
catch (e) {
    return config.useDeprecatedSynchronousErrorHandling ? (t.syncErrorValue = e, t.syncErrorThrown = !0, !0) : (hostReportError(e), !0);
} return !1; }, e.prototype._unsubscribe = function () { var t = this._parentSubscriber; this._context = null, this._parentSubscriber = null, t.unsubscribe(); }, e; }(Subscriber);
function canReportError(t) { for (; t;) {
    var e = t.destination;
    if (t.closed || t.isStopped)
        return !1;
    t = e && e instanceof Subscriber ? e : null;
} return !0; }
function toSubscriber(t, e, r) { if (t) {
    if (t instanceof Subscriber)
        return t;
    if (t[rxSubscriber])
        return t[rxSubscriber]();
} return t || e || r ? new Subscriber(t, e, r) : new Subscriber(empty); }
var observable = "function" == typeof Symbol && Symbol.observable || "@@observable";
function noop() { }
function pipeFromArray(t) { return t ? 1 === t.length ? t[0] : function (e) { return t.reduce(function (t, e) { return e(t); }, e); } : noop; }
var Observable = function () { function t(t) { this._isScalar = !1, t && (this._subscribe = t); } return t.prototype.lift = function (e) { var r = new t; return r.source = this, r.operator = e, r; }, t.prototype.subscribe = function (t, e, r) { var n = this.operator, i = toSubscriber(t, e, r); if (i.add(n ? n.call(i, this.source) : this.source || config.useDeprecatedSynchronousErrorHandling && !i.syncErrorThrowable ? this._subscribe(i) : this._trySubscribe(i)), config.useDeprecatedSynchronousErrorHandling && i.syncErrorThrowable && (i.syncErrorThrowable = !1, i.syncErrorThrown))
    throw i.syncErrorValue; return i; }, t.prototype._trySubscribe = function (t) { try {
    return this._subscribe(t);
}
catch (e) {
    config.useDeprecatedSynchronousErrorHandling && (t.syncErrorThrown = !0, t.syncErrorValue = e), canReportError(t) ? t.error(e) : console.warn(e);
} }, t.prototype.forEach = function (t, e) { var r = this; return new (e = getPromiseCtor(e))(function (e, n) { var i; i = r.subscribe(function (e) { try {
    t(e);
}
catch (t) {
    n(t), i && i.unsubscribe();
} }, n, e); }); }, t.prototype._subscribe = function (t) { var e = this.source; return e && e.subscribe(t); }, t.prototype[observable] = function () { return this; }, t.prototype.pipe = function () { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; return 0 === t.length ? this : pipeFromArray(t)(this); }, t.prototype.toPromise = function (t) { var e = this; return new (t = getPromiseCtor(t))(function (t, r) { var n; e.subscribe(function (t) { return n = t; }, function (t) { return r(t); }, function () { return t(n); }); }); }, t.create = function (e) { return new t(e); }, t; }();
function getPromiseCtor(t) { if (t || (t = config.Promise || Promise), !t)
    throw new Error("no Promise impl found"); return t; }
function ObjectUnsubscribedErrorImpl() { return Error.call(this), this.message = "object unsubscribed", this.name = "ObjectUnsubscribedError", this; }
ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl, SubjectSubscription = function (t) { function e(e, r) { var n = t.call(this) || this; return n.subject = e, n.subscriber = r, n.closed = !1, n; } return __extends(e, t), e.prototype.unsubscribe = function () { if (!this.closed) {
    this.closed = !0;
    var t = this.subject, e = t.observers;
    if (this.subject = null, e && 0 !== e.length && !t.isStopped && !t.closed) {
        var r = e.indexOf(this.subscriber);
        -1 !== r && e.splice(r, 1);
    }
} }, e; }(Subscription), SubjectSubscriber = function (t) { function e(e) { var r = t.call(this, e) || this; return r.destination = e, r; } return __extends(e, t), e; }(Subscriber), Subject = function (t) { function e() { var e = t.call(this) || this; return e.observers = [], e.closed = !1, e.isStopped = !1, e.hasError = !1, e.thrownError = null, e; } return __extends(e, t), e.prototype[rxSubscriber] = function () { return new SubjectSubscriber(this); }, e.prototype.lift = function (t) { var e = new AnonymousSubject(this, this); return e.operator = t, e; }, e.prototype.next = function (t) { if (this.closed)
    throw new ObjectUnsubscribedError; if (!this.isStopped)
    for (var e = this.observers, r = e.length, n = e.slice(), i = 0; i < r; i++)
        n[i].next(t); }, e.prototype.error = function (t) { if (this.closed)
    throw new ObjectUnsubscribedError; this.hasError = !0, this.thrownError = t, this.isStopped = !0; for (var e = this.observers, r = e.length, n = e.slice(), i = 0; i < r; i++)
    n[i].error(t); this.observers.length = 0; }, e.prototype.complete = function () { if (this.closed)
    throw new ObjectUnsubscribedError; this.isStopped = !0; for (var t = this.observers, e = t.length, r = t.slice(), n = 0; n < e; n++)
    r[n].complete(); this.observers.length = 0; }, e.prototype.unsubscribe = function () { this.isStopped = !0, this.closed = !0, this.observers = null; }, e.prototype._trySubscribe = function (e) { if (this.closed)
    throw new ObjectUnsubscribedError; return t.prototype._trySubscribe.call(this, e); }, e.prototype._subscribe = function (t) { if (this.closed)
    throw new ObjectUnsubscribedError; return this.hasError ? (t.error(this.thrownError), Subscription.EMPTY) : this.isStopped ? (t.complete(), Subscription.EMPTY) : (this.observers.push(t), new SubjectSubscription(this, t)); }, e.prototype.asObservable = function () { var t = new Observable; return t.source = this, t; }, e.create = function (t, e) { return new AnonymousSubject(t, e); }, e; }(Observable), AnonymousSubject = function (t) { function e(e, r) { var n = t.call(this) || this; return n.destination = e, n.source = r, n; } return __extends(e, t), e.prototype.next = function (t) { var e = this.destination; e && e.next && e.next(t); }, e.prototype.error = function (t) { var e = this.destination; e && e.error && this.destination.error(t); }, e.prototype.complete = function () { var t = this.destination; t && t.complete && this.destination.complete(); }, e.prototype._subscribe = function (t) { return this.source ? this.source.subscribe(t) : Subscription.EMPTY; }, e; }(Subject);
function refCount() { return function (t) { return t.lift(new RefCountOperator(t)); }; }
var RefCountOperator = function () { function t(t) { this.connectable = t; } return t.prototype.call = function (t, e) { var r = this.connectable; r._refCount++; var n = new RefCountSubscriber(t, r), i = e.subscribe(n); return n.closed || (n.connection = r.connect()), i; }, t; }(), RefCountSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.connectable = r, n; } return __extends(e, t), e.prototype._unsubscribe = function () { var t = this.connectable; if (t) {
    this.connectable = null;
    var e = t._refCount;
    if (e <= 0)
        this.connection = null;
    else if (t._refCount = e - 1, e > 1)
        this.connection = null;
    else {
        var r = this.connection, n = t._connection;
        this.connection = null, !n || r && n !== r || n.unsubscribe();
    }
}
else
    this.connection = null; }, e; }(Subscriber), ConnectableObservable = function (t) { function e(e, r) { var n = t.call(this) || this; return n.source = e, n.subjectFactory = r, n._refCount = 0, n._isComplete = !1, n; } return __extends(e, t), e.prototype._subscribe = function (t) { return this.getSubject().subscribe(t); }, e.prototype.getSubject = function () { var t = this._subject; return t && !t.isStopped || (this._subject = this.subjectFactory()), this._subject; }, e.prototype.connect = function () { var t = this._connection; return t || (this._isComplete = !1, (t = this._connection = new Subscription).add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this))), t.closed ? (this._connection = null, t = Subscription.EMPTY) : this._connection = t), t; }, e.prototype.refCount = function () { return refCount()(this); }, e; }(Observable), connectableProto = ConnectableObservable.prototype, connectableObservableDescriptor = { operator: { value: null }, _refCount: { value: 0, writable: !0 }, _subject: { value: null, writable: !0 }, _connection: { value: null, writable: !0 }, _subscribe: { value: connectableProto._subscribe }, _isComplete: { value: connectableProto._isComplete, writable: !0 }, getSubject: { value: connectableProto.getSubject }, connect: { value: connectableProto.connect }, refCount: { value: connectableProto.refCount } }, ConnectableSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.connectable = r, n; } return __extends(e, t), e.prototype._error = function (e) { this._unsubscribe(), t.prototype._error.call(this, e); }, e.prototype._complete = function () { this.connectable._isComplete = !0, this._unsubscribe(), t.prototype._complete.call(this); }, e.prototype._unsubscribe = function () { var t = this.connectable; if (t) {
    this.connectable = null;
    var e = t._connection;
    t._refCount = 0, t._subject = null, t._connection = null, e && e.unsubscribe();
} }, e; }(SubjectSubscriber), BehaviorSubject = function (t) { function e(e) { var r = t.call(this) || this; return r._value = e, r; } return __extends(e, t), Object.defineProperty(e.prototype, "value", { get: function () { return this.getValue(); }, enumerable: !0, configurable: !0 }), e.prototype._subscribe = function (e) { var r = t.prototype._subscribe.call(this, e); return r && !r.closed && e.next(this._value), r; }, e.prototype.getValue = function () { if (this.hasError)
    throw this.thrownError; if (this.closed)
    throw new ObjectUnsubscribedError; return this._value; }, e.prototype.next = function (e) { t.prototype.next.call(this, this._value = e); }, e; }(Subject), Action = function (t) { function e(e, r) { return t.call(this) || this; } return __extends(e, t), e.prototype.schedule = function (t, e) { return void 0 === e && (e = 0), this; }, e; }(Subscription), AsyncAction = function (t) { function e(e, r) { var n = t.call(this, e, r) || this; return n.scheduler = e, n.work = r, n.pending = !1, n; } return __extends(e, t), e.prototype.schedule = function (t, e) { if (void 0 === e && (e = 0), this.closed)
    return this; this.state = t; var r = this.id, n = this.scheduler; return null != r && (this.id = this.recycleAsyncId(n, r, e)), this.pending = !0, this.delay = e, this.id = this.id || this.requestAsyncId(n, this.id, e), this; }, e.prototype.requestAsyncId = function (t, e, r) { return void 0 === r && (r = 0), setInterval(t.flush.bind(t, this), r); }, e.prototype.recycleAsyncId = function (t, e, r) { if (void 0 === r && (r = 0), null !== r && this.delay === r && !1 === this.pending)
    return e; clearInterval(e); }, e.prototype.execute = function (t, e) { if (this.closed)
    return new Error("executing a cancelled action"); this.pending = !1; var r = this._execute(t, e); if (r)
    return r; !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null)); }, e.prototype._execute = function (t, e) { var r = !1, n = void 0; try {
    this.work(t);
}
catch (t) {
    r = !0, n = !!t && t || new Error(t);
} if (r)
    return this.unsubscribe(), n; }, e.prototype._unsubscribe = function () { var t = this.id, e = this.scheduler, r = e.actions, n = r.indexOf(this); this.work = null, this.state = null, this.pending = !1, this.scheduler = null, -1 !== n && r.splice(n, 1), null != t && (this.id = this.recycleAsyncId(e, t, null)), this.delay = null; }, e; }(Action), Scheduler = function () { function t(e, r) { void 0 === r && (r = t.now), this.SchedulerAction = e, this.now = r; } return t.prototype.schedule = function (t, e, r) { return void 0 === e && (e = 0), new this.SchedulerAction(this, t).schedule(r, e); }, t.now = function () { return Date.now(); }, t; }(), AsyncScheduler = function (t) { function e(r, n) { void 0 === n && (n = Scheduler.now); var i = t.call(this, r, function () { return e.delegate && e.delegate !== i ? e.delegate.now() : n(); }) || this; return i.actions = [], i.active = !1, i.scheduled = void 0, i; } return __extends(e, t), e.prototype.schedule = function (r, n, i) { return void 0 === n && (n = 0), e.delegate && e.delegate !== this ? e.delegate.schedule(r, n, i) : t.prototype.schedule.call(this, r, n, i); }, e.prototype.flush = function (t) { var e = this.actions; if (this.active)
    e.push(t);
else {
    var r;
    this.active = !0;
    do {
        if (r = t.execute(t.state, t.delay))
            break;
    } while (t = e.shift());
    if (this.active = !1, r) {
        for (; t = e.shift();)
            t.unsubscribe();
        throw r;
    }
} }, e; }(Scheduler), EMPTY = new Observable(function (t) { return t.complete(); });
function empty$1(t) { return t ? emptyScheduled(t) : EMPTY; }
function emptyScheduled(t) { return new Observable(function (e) { return t.schedule(function () { return e.complete(); }); }); }
function isScheduler(t) { return t && "function" == typeof t.schedule; }
var subscribeToArray = function (t) { return function (e) { for (var r = 0, n = t.length; r < n && !e.closed; r++)
    e.next(t[r]); e.closed || e.complete(); }; };
function fromArray(t, e) { return new Observable(e ? function (r) { var n = new Subscription, i = 0; return n.add(e.schedule(function () { i !== t.length ? (r.next(t[i++]), r.closed || n.add(this.schedule())) : r.complete(); })), n; } : subscribeToArray(t)); }
function scalar(t) { var e = new Observable(function (e) { e.next(t), e.complete(); }); return e._isScalar = !0, e.value = t, e; }
function of() { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; var r = t[t.length - 1]; switch (isScheduler(r) ? t.pop() : r = void 0, t.length) {
    case 0: return empty$1(r);
    case 1: return r ? fromArray(t, r) : scalar(t[0]);
    default: return fromArray(t, r);
} }
var async = new AsyncScheduler(AsyncAction);
function identity(t) { return t; }
function ArgumentOutOfRangeErrorImpl() { return Error.call(this), this.message = "argument out of range", this.name = "ArgumentOutOfRangeError", this; }
ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
var ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
function map(t, e) { return function (r) { if ("function" != typeof t)
    throw new TypeError("argument is not a function. Are you looking for `mapTo()`?"); return r.lift(new MapOperator(t, e)); }; }
var MapOperator = function () { function t(t, e) { this.project = t, this.thisArg = e; } return t.prototype.call = function (t, e) { return e.subscribe(new MapSubscriber(t, this.project, this.thisArg)); }, t; }(), MapSubscriber = function (t) { function e(e, r, n) { var i = t.call(this, e) || this; return i.project = r, i.count = 0, i.thisArg = n || i, i; } return __extends(e, t), e.prototype._next = function (t) { var e; try {
    e = this.project.call(this.thisArg, t, this.count++);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(e); }, e; }(Subscriber), OuterSubscriber = function (t) { function e() { return null !== t && t.apply(this, arguments) || this; } return __extends(e, t), e.prototype.notifyNext = function (t, e, r, n, i) { this.destination.next(e); }, e.prototype.notifyError = function (t, e) { this.destination.error(t); }, e.prototype.notifyComplete = function (t) { this.destination.complete(); }, e; }(Subscriber), InnerSubscriber = function (t) { function e(e, r, n) { var i = t.call(this) || this; return i.parent = e, i.outerValue = r, i.outerIndex = n, i.index = 0, i; } return __extends(e, t), e.prototype._next = function (t) { this.parent.notifyNext(this.outerValue, t, this.outerIndex, this.index++, this); }, e.prototype._error = function (t) { this.parent.notifyError(t, this), this.unsubscribe(); }, e.prototype._complete = function () { this.parent.notifyComplete(this), this.unsubscribe(); }, e; }(Subscriber), subscribeToPromise = function (t) { return function (e) { return t.then(function (t) { e.closed || (e.next(t), e.complete()); }, function (t) { return e.error(t); }).then(null, hostReportError), e; }; };
function getSymbolIterator() { return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"; }
var iterator = getSymbolIterator(), subscribeToIterable = function (t) { return function (e) { for (var r = t[iterator]();;) {
    var n = r.next();
    if (n.done) {
        e.complete();
        break;
    }
    if (e.next(n.value), e.closed)
        break;
} return "function" == typeof r.return && e.add(function () { r.return && r.return(); }), e; }; }, subscribeToObservable = function (t) { return function (e) { var r = t[observable](); if ("function" != typeof r.subscribe)
    throw new TypeError("Provided object does not correctly implement Symbol.observable"); return r.subscribe(e); }; }, isArrayLike = function (t) { return t && "number" == typeof t.length && "function" != typeof t; };
function isPromise(t) { return !!t && "function" != typeof t.subscribe && "function" == typeof t.then; }
var subscribeTo = function (t) { if (t instanceof Observable)
    return function (e) { return t._isScalar ? (e.next(t.value), void e.complete()) : t.subscribe(e); }; if (t && "function" == typeof t[observable])
    return subscribeToObservable(t); if (isArrayLike(t))
    return subscribeToArray(t); if (isPromise(t))
    return subscribeToPromise(t); if (t && "function" == typeof t[iterator])
    return subscribeToIterable(t); var e = isObject(t) ? "an invalid object" : "'" + t + "'"; throw new TypeError("You provided " + e + " where a stream was expected. You can provide an Observable, Promise, Array, or Iterable."); };
function subscribeToResult(t, e, r, n, i) { if (void 0 === i && (i = new InnerSubscriber(t, r, n)), !i.closed)
    return subscribeTo(e)(i); }
var NONE = {};
function combineLatest() { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; var r = null, n = null; return isScheduler(t[t.length - 1]) && (n = t.pop()), "function" == typeof t[t.length - 1] && (r = t.pop()), 1 === t.length && isArray(t[0]) && (t = t[0]), fromArray(t, n).lift(new CombineLatestOperator(r)); }
var CombineLatestOperator = function () { function t(t) { this.resultSelector = t; } return t.prototype.call = function (t, e) { return e.subscribe(new CombineLatestSubscriber(t, this.resultSelector)); }, t; }(), CombineLatestSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.resultSelector = r, n.active = 0, n.values = [], n.observables = [], n; } return __extends(e, t), e.prototype._next = function (t) { this.values.push(NONE), this.observables.push(t); }, e.prototype._complete = function () { var t = this.observables, e = t.length; if (0 === e)
    this.destination.complete();
else {
    this.active = e, this.toRespond = e;
    for (var r = 0; r < e; r++) {
        var n = t[r];
        this.add(subscribeToResult(this, n, n, r));
    }
} }, e.prototype.notifyComplete = function (t) { 0 == (this.active -= 1) && this.destination.complete(); }, e.prototype.notifyNext = function (t, e, r, n, i) { var o = this.values, s = this.toRespond ? o[r] === NONE ? --this.toRespond : this.toRespond : 0; o[r] = e, 0 === s && (this.resultSelector ? this._tryResultSelector(o) : this.destination.next(o.slice())); }, e.prototype._tryResultSelector = function (t) { var e; try {
    e = this.resultSelector.apply(this, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(e); }, e; }(OuterSubscriber);
function isInteropObservable(t) { return t && "function" == typeof t[observable]; }
function isIterable(t) { return t && "function" == typeof t[iterator]; }
function fromPromise(t, e) { return new Observable(e ? function (r) { var n = new Subscription; return n.add(e.schedule(function () { return t.then(function (t) { n.add(e.schedule(function () { r.next(t), n.add(e.schedule(function () { return r.complete(); })); })); }, function (t) { n.add(e.schedule(function () { return r.error(t); })); }); })), n; } : subscribeToPromise(t)); }
function fromIterable(t, e) { if (!t)
    throw new Error("Iterable cannot be null"); return new Observable(e ? function (r) { var n, i = new Subscription; return i.add(function () { n && "function" == typeof n.return && n.return(); }), i.add(e.schedule(function () { n = t[iterator](), i.add(e.schedule(function () { if (!r.closed) {
    var t, e;
    try {
        var i = n.next();
        t = i.value, e = i.done;
    }
    catch (t) {
        return void r.error(t);
    }
    e ? r.complete() : (r.next(t), this.schedule());
} })); })), i; } : subscribeToIterable(t)); }
function fromObservable(t, e) { return new Observable(e ? function (r) { var n = new Subscription; return n.add(e.schedule(function () { var i = t[observable](); n.add(i.subscribe({ next: function (t) { n.add(e.schedule(function () { return r.next(t); })); }, error: function (t) { n.add(e.schedule(function () { return r.error(t); })); }, complete: function () { n.add(e.schedule(function () { return r.complete(); })); } })); })), n; } : subscribeToObservable(t)); }
function from(t, e) { if (!e)
    return t instanceof Observable ? t : new Observable(subscribeTo(t)); if (null != t) {
    if (isInteropObservable(t))
        return fromObservable(t, e);
    if (isPromise(t))
        return fromPromise(t, e);
    if (isArrayLike(t))
        return fromArray(t, e);
    if (isIterable(t) || "string" == typeof t)
        return fromIterable(t, e);
} throw new TypeError((null !== t && typeof t || t) + " is not observable"); }
function mergeMap(t, e, r) { return void 0 === r && (r = Number.POSITIVE_INFINITY), "function" == typeof e ? function (n) { return n.pipe(mergeMap(function (r, n) { return from(t(r, n)).pipe(map(function (t, i) { return e(r, t, n, i); })); }, r)); } : ("number" == typeof e && (r = e), function (e) { return e.lift(new MergeMapOperator(t, r)); }); }
var MergeMapOperator = function () { function t(t, e) { void 0 === e && (e = Number.POSITIVE_INFINITY), this.project = t, this.concurrent = e; } return t.prototype.call = function (t, e) { return e.subscribe(new MergeMapSubscriber(t, this.project, this.concurrent)); }, t; }(), MergeMapSubscriber = function (t) { function e(e, r, n) { void 0 === n && (n = Number.POSITIVE_INFINITY); var i = t.call(this, e) || this; return i.project = r, i.concurrent = n, i.hasCompleted = !1, i.buffer = [], i.active = 0, i.index = 0, i; } return __extends(e, t), e.prototype._next = function (t) { this.active < this.concurrent ? this._tryNext(t) : this.buffer.push(t); }, e.prototype._tryNext = function (t) { var e, r = this.index++; try {
    e = this.project(t, r);
}
catch (t) {
    return void this.destination.error(t);
} this.active++, this._innerSub(e, t, r); }, e.prototype._innerSub = function (t, e, r) { var n = new InnerSubscriber(this, void 0, void 0); this.destination.add(n), subscribeToResult(this, t, e, r, n); }, e.prototype._complete = function () { this.hasCompleted = !0, 0 === this.active && 0 === this.buffer.length && this.destination.complete(), this.unsubscribe(); }, e.prototype.notifyNext = function (t, e, r, n, i) { this.destination.next(e); }, e.prototype.notifyComplete = function (t) { var e = this.buffer; this.remove(t), this.active--, e.length > 0 ? this._next(e.shift()) : 0 === this.active && this.hasCompleted && this.destination.complete(); }, e; }(OuterSubscriber);
function mergeAll(t) { return void 0 === t && (t = Number.POSITIVE_INFINITY), mergeMap(identity, t); }
function concatAll() { return mergeAll(1); }
function concat() { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; return concatAll()(of.apply(void 0, t)); }
function defer(t) { return new Observable(function (e) { var r; try {
    r = t();
}
catch (t) {
    return void e.error(t);
} return (r ? from(r) : empty$1()).subscribe(e); }); }
function fromEvent(t, e, r, n) { return isFunction(r) && (n = r, r = void 0), n ? fromEvent(t, e, r).pipe(map(function (t) { return isArray(t) ? n.apply(void 0, t) : n(t); })) : new Observable(function (n) { setupSubscription(t, e, function (t) { n.next(arguments.length > 1 ? Array.prototype.slice.call(arguments) : t); }, n, r); }); }
function setupSubscription(t, e, r, n, i) { var o; if (isEventTarget(t)) {
    var s = t;
    t.addEventListener(e, r, i), o = function () { return s.removeEventListener(e, r, i); };
}
else if (isJQueryStyleEventEmitter(t)) {
    var u = t;
    t.on(e, r), o = function () { return u.off(e, r); };
}
else if (isNodeStyleEventEmitter(t)) {
    var c = t;
    t.addListener(e, r), o = function () { return c.removeListener(e, r); };
}
else {
    if (!t || !t.length)
        throw new TypeError("Invalid event target");
    for (var a = 0, p = t.length; a < p; a++)
        setupSubscription(t[a], e, r, n, i);
} n.add(o); }
function isNodeStyleEventEmitter(t) { return t && "function" == typeof t.addListener && "function" == typeof t.removeListener; }
function isJQueryStyleEventEmitter(t) { return t && "function" == typeof t.on && "function" == typeof t.off; }
function isEventTarget(t) { return t && "function" == typeof t.addEventListener && "function" == typeof t.removeEventListener; }
function merge() { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; var r = Number.POSITIVE_INFINITY, n = null, i = t[t.length - 1]; return isScheduler(i) ? (n = t.pop(), t.length > 1 && "number" == typeof t[t.length - 1] && (r = t.pop())) : "number" == typeof i && (r = t.pop()), null === n && 1 === t.length && t[0] instanceof Observable ? t[0] : mergeAll(r)(fromArray(t, n)); }
var NEVER = new Observable(noop);
function filter(t, e) { return function (r) { return r.lift(new FilterOperator(t, e)); }; }
var FilterOperator = function () { function t(t, e) { this.predicate = t, this.thisArg = e; } return t.prototype.call = function (t, e) { return e.subscribe(new FilterSubscriber(t, this.predicate, this.thisArg)); }, t; }(), FilterSubscriber = function (t) { function e(e, r, n) { var i = t.call(this, e) || this; return i.predicate = r, i.thisArg = n, i.count = 0, i; } return __extends(e, t), e.prototype._next = function (t) { var e; try {
    e = this.predicate.call(this.thisArg, t, this.count++);
}
catch (t) {
    return void this.destination.error(t);
} e && this.destination.next(t); }, e; }(Subscriber);
function tap(t, e, r) { return function (n) { return n.lift(new DoOperator(t, e, r)); }; }
var DoOperator = function () { function t(t, e, r) { this.nextOrObserver = t, this.error = e, this.complete = r; } return t.prototype.call = function (t, e) { return e.subscribe(new TapSubscriber(t, this.nextOrObserver, this.error, this.complete)); }, t; }(), TapSubscriber = function (t) { function e(e, r, n, i) { var o = t.call(this, e) || this; return o._tapNext = noop, o._tapError = noop, o._tapComplete = noop, o._tapError = n || noop, o._tapComplete = i || noop, isFunction(r) ? (o._context = o, o._tapNext = r) : r && (o._context = r, o._tapNext = r.next || noop, o._tapError = r.error || noop, o._tapComplete = r.complete || noop), o; } return __extends(e, t), e.prototype._next = function (t) { try {
    this._tapNext.call(this._context, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(t); }, e.prototype._error = function (t) { try {
    this._tapError.call(this._context, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.error(t); }, e.prototype._complete = function () { try {
    this._tapComplete.call(this._context);
}
catch (t) {
    return void this.destination.error(t);
} return this.destination.complete(); }, e; }(Subscriber);
function take(t) { return function (e) { return 0 === t ? empty$1() : e.lift(new TakeOperator(t)); }; }
var TakeOperator = function () { function t(t) { if (this.total = t, this.total < 0)
    throw new ArgumentOutOfRangeError; } return t.prototype.call = function (t, e) { return e.subscribe(new TakeSubscriber(t, this.total)); }, t; }(), TakeSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.total = r, n.count = 0, n; } return __extends(e, t), e.prototype._next = function (t) { var e = this.total, r = ++this.count; r <= e && (this.destination.next(t), r === e && (this.destination.complete(), this.unsubscribe())); }, e; }(Subscriber);
function mapTo(t) { return function (e) { return e.lift(new MapToOperator(t)); }; }
var MapToOperator = function () { function t(t) { this.value = t; } return t.prototype.call = function (t, e) { return e.subscribe(new MapToSubscriber(t, this.value)); }, t; }(), MapToSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.value = r, n; } return __extends(e, t), e.prototype._next = function (t) { this.destination.next(this.value); }, e; }(Subscriber);
function multicast(t, e) { return function (r) { var n; if (n = "function" == typeof t ? t : function () { return t; }, "function" == typeof e)
    return r.lift(new MulticastOperator(n, e)); var i = Object.create(r, connectableObservableDescriptor); return i.source = r, i.subjectFactory = n, i; }; }
var MulticastOperator = function () { function t(t, e) { this.subjectFactory = t, this.selector = e; } return t.prototype.call = function (t, e) { var r = this.selector, n = this.subjectFactory(), i = r(n).subscribe(t); return i.add(e.subscribe(n)), i; }, t; }();
function pairwise() { return function (t) { return t.lift(new PairwiseOperator); }; }
var PairwiseOperator = function () { function t() { } return t.prototype.call = function (t, e) { return e.subscribe(new PairwiseSubscriber(t)); }, t; }(), PairwiseSubscriber = function (t) { function e(e) { var r = t.call(this, e) || this; return r.hasPrev = !1, r; } return __extends(e, t), e.prototype._next = function (t) { this.hasPrev ? this.destination.next([this.prev, t]) : this.hasPrev = !0, this.prev = t; }, e; }(Subscriber);
function repeatWhen(t) { return function (e) { return e.lift(new RepeatWhenOperator(t)); }; }
var RepeatWhenOperator = function () { function t(t) { this.notifier = t; } return t.prototype.call = function (t, e) { return e.subscribe(new RepeatWhenSubscriber(t, this.notifier, e)); }, t; }(), RepeatWhenSubscriber = function (t) { function e(e, r, n) { var i = t.call(this, e) || this; return i.notifier = r, i.source = n, i.sourceIsBeingSubscribedTo = !0, i; } return __extends(e, t), e.prototype.notifyNext = function (t, e, r, n, i) { this.sourceIsBeingSubscribedTo = !0, this.source.subscribe(this); }, e.prototype.notifyComplete = function (e) { if (!1 === this.sourceIsBeingSubscribedTo)
    return t.prototype.complete.call(this); }, e.prototype.complete = function () { if (this.sourceIsBeingSubscribedTo = !1, !this.isStopped) {
    if (this.retries || this.subscribeToRetries(), !this.retriesSubscription || this.retriesSubscription.closed)
        return t.prototype.complete.call(this);
    this._unsubscribeAndRecycle(), this.notifications.next();
} }, e.prototype._unsubscribe = function () { var t = this.notifications, e = this.retriesSubscription; t && (t.unsubscribe(), this.notifications = null), e && (e.unsubscribe(), this.retriesSubscription = null), this.retries = null; }, e.prototype._unsubscribeAndRecycle = function () { var e = this._unsubscribe; return this._unsubscribe = null, t.prototype._unsubscribeAndRecycle.call(this), this._unsubscribe = e, this; }, e.prototype.subscribeToRetries = function () { var e; this.notifications = new Subject; try {
    e = (0, this.notifier)(this.notifications);
}
catch (e) {
    return t.prototype.complete.call(this);
} this.retries = e, this.retriesSubscription = subscribeToResult(this, e); }, e; }(OuterSubscriber);
function sample(t) { return function (e) { return e.lift(new SampleOperator(t)); }; }
var SampleOperator = function () { function t(t) { this.notifier = t; } return t.prototype.call = function (t, e) { var r = new SampleSubscriber(t), n = e.subscribe(r); return n.add(subscribeToResult(r, this.notifier)), n; }, t; }(), SampleSubscriber = function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.hasValue = !1, e; } return __extends(e, t), e.prototype._next = function (t) { this.value = t, this.hasValue = !0; }, e.prototype.notifyNext = function (t, e, r, n, i) { this.emitValue(); }, e.prototype.notifyComplete = function () { this.emitValue(); }, e.prototype.emitValue = function () { this.hasValue && (this.hasValue = !1, this.destination.next(this.value)); }, e; }(OuterSubscriber);
function shareSubjectFactory() { return new Subject; }
function share() { return function (t) { return refCount()(multicast(shareSubjectFactory)(t)); }; }
function skip(t) { return function (e) { return e.lift(new SkipOperator(t)); }; }
var SkipOperator = function () { function t(t) { this.total = t; } return t.prototype.call = function (t, e) { return e.subscribe(new SkipSubscriber(t, this.total)); }, t; }(), SkipSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.total = r, n.count = 0, n; } return __extends(e, t), e.prototype._next = function (t) { ++this.count > this.total && this.destination.next(t); }, e; }(Subscriber);
function skipWhile(t) { return function (e) { return e.lift(new SkipWhileOperator(t)); }; }
var SkipWhileOperator = function () { function t(t) { this.predicate = t; } return t.prototype.call = function (t, e) { return e.subscribe(new SkipWhileSubscriber(t, this.predicate)); }, t; }(), SkipWhileSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.predicate = r, n.skipping = !0, n.index = 0, n; } return __extends(e, t), e.prototype._next = function (t) { var e = this.destination; this.skipping && this.tryCallPredicate(t), this.skipping || e.next(t); }, e.prototype.tryCallPredicate = function (t) { try {
    var e = this.predicate(t, this.index++);
    this.skipping = Boolean(e);
}
catch (t) {
    this.destination.error(t);
} }, e; }(Subscriber);
function startWith() { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; return function (e) { var r = t[t.length - 1]; isScheduler(r) ? t.pop() : r = null; var n = t.length; return concat(1 !== n || r ? n > 0 ? fromArray(t, r) : empty$1(r) : scalar(t[0]), e); }; }
function switchMap(t, e) { return "function" == typeof e ? function (r) { return r.pipe(switchMap(function (r, n) { return from(t(r, n)).pipe(map(function (t, i) { return e(r, t, n, i); })); })); } : function (e) { return e.lift(new SwitchMapOperator(t)); }; }
var SwitchMapOperator = function () { function t(t) { this.project = t; } return t.prototype.call = function (t, e) { return e.subscribe(new SwitchMapSubscriber(t, this.project)); }, t; }(), SwitchMapSubscriber = function (t) { function e(e, r) { var n = t.call(this, e) || this; return n.project = r, n.index = 0, n; } return __extends(e, t), e.prototype._next = function (t) { var e, r = this.index++; try {
    e = this.project(t, r);
}
catch (t) {
    return void this.destination.error(t);
} this._innerSub(e, t, r); }, e.prototype._innerSub = function (t, e, r) { var n = this.innerSubscription; n && n.unsubscribe(); var i = new InnerSubscriber(this, void 0, void 0); this.destination.add(i), this.innerSubscription = subscribeToResult(this, t, e, r, i); }, e.prototype._complete = function () { var e = this.innerSubscription; e && !e.closed || t.prototype._complete.call(this), this.unsubscribe(); }, e.prototype._unsubscribe = function () { this.innerSubscription = null; }, e.prototype.notifyComplete = function (e) { this.destination.remove(e), this.innerSubscription = null, this.isStopped && t.prototype._complete.call(this); }, e.prototype.notifyNext = function (t, e, r, n, i) { this.destination.next(e); }, e; }(OuterSubscriber);
function takeUntil(t) { return function (e) { return e.lift(new TakeUntilOperator(t)); }; }
var TakeUntilOperator = function () { function t(t) { this.notifier = t; } return t.prototype.call = function (t, e) { var r = new TakeUntilSubscriber(t), n = subscribeToResult(r, this.notifier); return n && !r.seenValue ? (r.add(n), e.subscribe(r)) : r; }, t; }(), TakeUntilSubscriber = function (t) { function e(e) { var r = t.call(this, e) || this; return r.seenValue = !1, r; } return __extends(e, t), e.prototype.notifyNext = function (t, e, r, n, i) { this.seenValue = !0, this.complete(); }, e.prototype.notifyComplete = function () { }, e; }(OuterSubscriber);
function timestamp(t) { return void 0 === t && (t = async), map(function (e) { return new Timestamp(e, t.now()); }); }
var Timestamp = function () { return function (t, e) { this.value = t, this.timestamp = e; }; }();
function withLatestFrom() { for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e]; return function (e) { var r; return "function" == typeof t[t.length - 1] && (r = t.pop()), e.lift(new WithLatestFromOperator(t, r)); }; }
var WithLatestFromOperator = function () { function t(t, e) { this.observables = t, this.project = e; } return t.prototype.call = function (t, e) { return e.subscribe(new WithLatestFromSubscriber(t, this.observables, this.project)); }, t; }(), WithLatestFromSubscriber = function (t) { function e(e, r, n) { var i = t.call(this, e) || this; i.observables = r, i.project = n, i.toRespond = []; var o = r.length; i.values = new Array(o); for (var s = 0; s < o; s++)
    i.toRespond.push(s); for (s = 0; s < o; s++) {
    var u = r[s];
    i.add(subscribeToResult(i, u, u, s));
} return i; } return __extends(e, t), e.prototype.notifyNext = function (t, e, r, n, i) { this.values[r] = e; var o = this.toRespond; if (o.length > 0) {
    var s = o.indexOf(r);
    -1 !== s && o.splice(s, 1);
} }, e.prototype.notifyComplete = function () { }, e.prototype._next = function (t) { if (0 === this.toRespond.length) {
    var e = [t].concat(this.values);
    this.project ? this._tryProject(e) : this.destination.next(e);
} }, e.prototype._tryProject = function (t) { var e; try {
    e = this.project.apply(this, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(e); }, e; }(OuterSubscriber);
function createTween(t, e, r, n, i) { return Observable.create(function (o) { var s, u = requestAnimationFrame(function c(a) { var p = a - (s = s || a); p < n ? (o.next(t(p, e, r, n, i)), u = requestAnimationFrame(c)) : (o.next(t(n, e, r, n, i)), u = requestAnimationFrame(function () { return o.complete(); })); }); return function () { u && cancelAnimationFrame(u); }; }); }
var BASE_DURATION = 200, WIDTH_CONTRIBUTION = .15, VELOCITY_THRESHOLD = .15;
function easeOutSine(t, e, r, n) { return r * Math.sin(t / n * (Math.PI / 2)) + e; }
function applyMixins(t, e) { e.forEach(function (e) { Object.getOwnPropertyNames(e.prototype).forEach(function (r) { t.prototype[r] = e.prototype[r]; }); }); }
function subscribeWhen(t) { return function (e) { return t.pipe(switchMap(function (t) { return t ? e : NEVER; })); }; }
function filterWhen(t) { for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r]; return function (r) { return 0 === e.length ? r.pipe(withLatestFrom(t), filter(function (t) { return t[1]; }), map(function (t) { return t[0]; })) : r.pipe(withLatestFrom.apply(void 0, [t].concat(e)), filter(function (t) { return t.slice(1).every(function (t) { return t; }); }), map(function (t) { return t[0]; })); }; }
function createResizeObservable(t) { return Observable.create(function (e) { var r = new window.ResizeObserver(function (t) { return t.forEach(function (t) { return e.next(t); }); }); return r.observe(t), function () { r.unobserve(t); }; }); }
var abs = Math.abs.bind(Math), ObservablesMixin = function () { function t() { } return t.prototype.getStartObservable = function () { return combineLatest(this.touchEvents$, this.mouseEvents$).pipe(switchMap(function (t) { var e = t[1]; return merge(t[0] ? fromEvent(document, "touchstart", { passive: !0 }).pipe(filter(function (t) { return 1 === t.touches.length; }), map(function (t) { return t.touches[0]; })) : NEVER, e ? fromEvent(document, "mousedown").pipe(map(function (t) { return t.event = t, t; })) : NEVER); })); }, t.prototype.getMoveObservable = function (t, e) { return combineLatest(this.touchEvents$, this.mouseEvents$, this.preventDefault$).pipe(switchMap(function (r) { var n = r[1], i = r[2], o = r[0] ? fromEvent(document, "touchmove", { passive: !i }).pipe(map(function (t) { return t.touches[0].event = t, t.touches[0]; })) : NEVER, s = n ? fromEvent(document, "mousemove", { passive: !i }).pipe(subscribeWhen(merge(t.pipe(mapTo(!0)), e.pipe(mapTo(!1)))), map(function (t) { return t.event = t, t; })) : NEVER; return merge(o, s); })); }, t.prototype.getEndObservable = function () { return combineLatest(this.touchEvents$, this.mouseEvents$).pipe(switchMap(function (t) { var e = t[1]; return merge(t[0] ? fromEvent(document, "touchend", { passive: !0 }).pipe(filter(function (t) { return 0 === t.touches.length; }), map(function (t) { return t.changedTouches[0]; })) : NEVER, e ? fromEvent(document, "mouseup", { passive: !0 }) : NEVER); })); }, t.prototype.getIsSlidingObservable = function (t, e, r) { return this.getIsSlidingObservableInner(t, e).pipe(take(1), startWith(void 0), repeatWhen(function () { return r; })); }, t.prototype.getIsSlidingObservableInner = function (t, e) { var r = this; return this.threshold ? t.pipe(withLatestFrom(e), skipWhile(function (t) { var e = t[0], n = e.clientX, i = t[1], o = i.clientX; return abs(i.clientY - e.clientY) < r.threshold && abs(o - n) < r.threshold; }), map(function (t) { var e = t[0], r = e.clientY, n = t[1], i = n.clientY; return abs(n.clientX - e.clientX) >= abs(i - r); })) : t.pipe(withLatestFrom(e), map(function (t) { var e = t[0], n = e.clientY, i = e.event, o = t[1], s = o.clientY, u = abs(o.clientX - e.clientX) >= abs(s - n); return r.preventDefault && u && i.preventDefault(), u; })); }, t; }(), min = Math.min.bind(Math), max = Math.max.bind(Math), CalcMixin = function () { function t() { } return t.prototype.calcIsInRange = function (t, e) { var r = t.clientX; switch (this.align) {
    case "left":
        var n = this.range, i = n[1];
        return r > (o = n[0]) && (e || r < i);
    case "right":
        i = window.innerWidth - this.range[0];
        var o = window.innerWidth - this.range[1];
        return r < i && (e || r > o);
    default: throw Error();
} }, t.prototype.calcIsSwipe = function (t, e, r, n, i) { return e.clientX !== t.clientX || r > 0 && r < n; }, t.prototype.calcWillOpen = function (t, e, r, n, i) { switch (this.align) {
    case "left": return i > VELOCITY_THRESHOLD || !(i < -VELOCITY_THRESHOLD) && r >= n / 2;
    case "right": return -i > VELOCITY_THRESHOLD || !(-i < -VELOCITY_THRESHOLD) && r <= -n / 2;
    default: throw Error();
} }, t.prototype.calcTranslateX = function (t, e, r, n) { var i = t.clientX, o = e.clientX; switch (this.align) {
    case "left": return max(0, min(n, r + (i - o)));
    case "right": return min(0, max(-n, r + (i - o)));
    default: throw Error();
} }, t; }(), UpdateMixin = function () { function t() { } return t.prototype.updateDOM = function (t, e) { var r = t / e * ("left" === this.align ? 1 : -1) || 0; this.translateX = t, this.opacity = r, this.moveCallback && this.moveCallback({ translateX: t, opacity: r }), this.updater.updateDOM(t, r); }, t; }(), Updater = function (t) { this.contentEl = t.contentEl, this.scrimEl = t.scrimEl; }, StyleUpdater = function (t) { function e(e) { return t.call(this, e) || this; } return tslib_1.__extends(e, t), e.prototype.updateDOM = function (t, e) { this.contentEl.style.transform = "translate(" + t + "px, 0px)", this.scrimEl.style.opacity = "" + e; }, e; }(Updater), AttributeStyleMapUpdater = function (t) { function e(e) { var r = t.call(this, e) || this; return r.transformValue = new CSSTransformValue([new CSSTranslate(CSS.px(0), CSS.px(0))]), r; } return tslib_1.__extends(e, t), e.prototype.updateDOM = function (t, e) { this.transformValue[0].x = CSS.px(t), this.contentEl.attributeStyleMap.set("transform", this.transformValue), this.scrimEl.attributeStyleMap.set("opacity", e); }, e; }(Updater), HyDrawer = function () { function t() { this.opened = !1, this.align = "left", this.persistent = !1, this.threshold = 10, this.preventDefault = !1, this.touchEvents = !1, this.mouseEvents = !1, this.range = [0, 100], this.isSliding = !1, this.willChange = !1; } return t.prototype.setOpened = function (t) { this.opened$.next(t); }, t.prototype.setAlign = function (t) { this.align$.next(t); }, t.prototype.setPersistent = function (t) { this.persistent$.next(t); }, t.prototype.setPreventDefault = function (t) { this.preventDefault$.next(t); }, t.prototype.setTouchEvents = function (t) { this.touchEvents$.next(t); }, t.prototype.setMouseEvents = function (t) { this.mouseEvents$.next(t); }, t.prototype.getDrawerWidth = function () { var t = ("ResizeObserver" in window ? createResizeObservable(this.contentEl) : of({ contentRect: { width: this.contentEl.clientWidth } })).pipe(map(function (t) { return t.contentRect.width; }), share()); return this._peek$ ? combineLatest(t, this._peek$).pipe(map(function (t) { return t[0] - t[1]; })) : t; }, t.prototype.componentWillLoad = function () { this.opened$ = new BehaviorSubject(this.opened), this.align$ = new BehaviorSubject(this.align), this.persistent$ = new BehaviorSubject(this.persistent), this.preventDefault$ = new BehaviorSubject(this.preventDefault), this.touchEvents$ = new BehaviorSubject(this.touchEvents), this.mouseEvents$ = new BehaviorSubject(this.mouseEvents), this.animateTo$ = new Subject; }, t.prototype.componentDidLoad = function () { var t = this; this.scrimEl = this.el.shadowRoot.querySelector(".scrim"), this.contentEl = this.el.shadowRoot.querySelector(".content"); var e = "attributeStyleMap" in Element.prototype && "CSS" in window && "number" in CSS; this.updater = e ? new AttributeStyleMapUpdater(this) : new StyleUpdater(this); var r = this.getDrawerWidth(), n = this.persistent$.pipe(map(function (t) { return !t; })), i = this.getStartObservable().pipe(filterWhen(n), share()), o = {}, s = defer(function () { return o.translateX$.pipe(map(function (t) { return 0 !== t; })); }), u = i.pipe(withLatestFrom(s), map(function (e) { return t.calcIsInRange.apply(t, e); }), tap(function (e) { e && (t.willChange = !0); }), share()), c = this.getEndObservable().pipe(filterWhen(n, u), share()), a = this.getMoveObservable(i, c).pipe(filterWhen(n, u), share()), p = this.getIsSlidingObservable(a, i, c).pipe(tap(function (e) { t.isSliding = e, e && t.slideStart.emit(t.opened); })), l = o.translateX$ = defer(function () { var e = combineLatest(t.opened$, t.align$, r).pipe(tap(function () { return t.willChange = !1; }), map(function (t) { var e = t[0], r = t[1], n = t[2]; return console.log(n), e ? n * ("left" === r ? 1 : -1) : 0; })), n = a.pipe(filterWhen(p), tap(function (e) { return t.preventDefault && e.event.preventDefault(); }), withLatestFrom(i, o.startTranslateX$, r), map(function (e) { return t.calcTranslateX.apply(t, e); })); return merge(o.tweenTranslateX$, e, n); }).pipe(share()); o.startTranslateX$ = l.pipe(sample(i)); var h = l.pipe(timestamp(), pairwise(), filter(function (t) { return t[1].timestamp - t[0].timestamp > 0; }), map(function (t) { var e = t[0], r = t[1]; return (r.value - e.value) / (r.timestamp - e.timestamp); }), startWith(0)), b = c.pipe(tap(function () { return t.willChange = !1; }), withLatestFrom(i, l, r, h), filter(function (e) { return t.calcIsSwipe.apply(t, e); }), map(function (e) { return t.calcWillOpen.apply(t, e); }), tap(function (e) { return t.slideEnd.emit(e); })); o.tweenTranslateX$ = merge(b, this.animateTo$).pipe(tap(function () { return t.willChange = !0; }), withLatestFrom(l, r), switchMap(function (e) { var r = e[0], n = e[1], o = e[2]; return createTween(easeOutSine, n, (r ? o * ("left" === t.align ? 1 : -1) : 0) - n, BASE_DURATION + o * WIDTH_CONTRIBUTION).pipe(tap({ complete: function () { return t.opened = r, t.willChange = !1; } }), takeUntil(i), takeUntil(t.align$.pipe(skip(1))), share()); })), l.pipe(withLatestFrom(r)).subscribe(function (e) { t.updateDOM.apply(t, e); }), n.pipe().subscribe(function (e) { t.scrimEl.style.display = e ? "block" : "none"; }), this.mouseEvents$.pipe(switchMap(function (t) { return t ? i.pipe(withLatestFrom(u)) : NEVER; }), filter(function (t) { return t[1] && null != t[0].event; })).subscribe(function (t) { return t[0].event.preventDefault(); }); }, t.prototype.render = function () { var t, e = ((t = { content: !0 })[this.align] = !0, t.grab = this.mouseEvents, t.grabbing = this.mouseEvents && this.isSliding, t); return [hy_drawer_core_js_1.h("div", { class: "scrim", style: { willChange: this.willChange ? "opacity" : "", pointerEvents: this.opened ? "all" : "" } }), hy_drawer_core_js_1.h("div", { class: e, style: { willChange: this.willChange ? "transform" : "" } }, hy_drawer_core_js_1.h("div", { class: "overflow" }, hy_drawer_core_js_1.h("slot", null)))]; }, t.prototype.open = function () { this.animateTo$.next(!0); }, t.prototype.close = function () { this.animateTo$.next(!1); }, t.prototype.toggle = function () { this.animateTo$.next(!this.opened); }, Object.defineProperty(t, "is", { get: function () { return "hy-drawer"; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "encapsulation", { get: function () { return "shadow"; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "properties", { get: function () { return { align: { type: String, attr: "align", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setAlign"] }, close: { method: !0 }, el: { elementRef: !0 }, isSliding: { state: !0 }, mouseEvents: { type: Boolean, attr: "mouse-events", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setMouseEvents"] }, opacity: { type: Number, attr: "opacity", mutable: !0 }, open: { method: !0 }, opened: { type: Boolean, attr: "opened", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setOpened"] }, persistent: { type: Boolean, attr: "persistent", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setPersistent"] }, preventDefault: { type: Boolean, attr: "prevent-default", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setPreventDefault"] }, range: { type: "Any", attr: "range", mutable: !0 }, threshold: { type: Number, attr: "threshold", reflectToAttr: !0, mutable: !0 }, toggle: { method: !0 }, touchEvents: { type: Boolean, attr: "touch-events", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setTouchEvents"] }, translateX: { type: Number, attr: "translate-x", mutable: !0 }, willChange: { state: !0 } }; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "events", { get: function () { return [{ name: "slideStart", method: "slideStart", bubbles: !0, cancelable: !0, composed: !0 }, { name: "slideEnd", method: "slideEnd", bubbles: !0, cancelable: !0, composed: !0 }]; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "style", { get: function () { return "\@media screen{.scrim.sc-hy-drawer{left:0;width:100vw;opacity:0;pointer-events:none;-webkit-tap-highlight-color:transparent;background:var(--hy-drawer-scrim-background,rgba(0,0,0,.5));z-index:var(--hy-drawer-scrim-z-index,20)}.content.sc-hy-drawer, .scrim.sc-hy-drawer{position:fixed;top:0;height:100vh;-webkit-transform:translateX(0);transform:translateX(0)}.content.sc-hy-drawer{contain:strict;width:var(--hy-drawer-width,300px);background:var(--hy-drawer-background,inherit);-webkit-box-shadow:var(--hy-drawer-box-shadow,0 0 15px rgba(0,0,0,.25));box-shadow:var(--hy-drawer-box-shadow,0 0 15px rgba(0,0,0,.25));z-index:var(--hy-drawer-z-index,30)}.content.left.sc-hy-drawer{left:calc(-1 * var(--hy-drawer-width, 300px))}.content.right.sc-hy-drawer{right:calc(-1 * var(--hy-drawer-width, 300px))}.content.sc-hy-drawer   .overflow.sc-hy-drawer{position:absolute;top:0;right:0;bottom:0;left:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;will-change:scroll-position}.grab.sc-hy-drawer{cursor:move;cursor:-webkit-grab;cursor:grab}.grabbing.sc-hy-drawer{cursor:-webkit-grabbing;cursor:grabbing}}\@media print{.scrim.sc-hy-drawer{display:none!important}.content.sc-hy-drawer{-webkit-transform:none!important;transform:none!important}}"; }, enumerable: !0, configurable: !0 }), t; }();
exports.HyDrawer = HyDrawer;
applyMixins(HyDrawer, [ObservablesMixin, UpdateMixin, CalcMixin]);
