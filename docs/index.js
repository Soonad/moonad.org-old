/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/decode-uri-component/index.js":
/*!****************************************************!*\
  !*** ./node_modules/decode-uri-component/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),

/***/ "./node_modules/formality-lang/package.json":
/*!**************************************************!*\
  !*** ./node_modules/formality-lang/package.json ***!
  \**************************************************/
/*! exports provided: _args, _development, _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _spec, _where, author, bin, bugs, dependencies, description, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"_args\":[[\"formality-lang@0.1.180\",\"/Users/maisa/Documents/Provit\"]],\"_development\":true,\"_from\":\"formality-lang@0.1.180\",\"_id\":\"formality-lang@0.1.180\",\"_inBundle\":false,\"_integrity\":\"sha512-sFf9AcLX0nkvOQPvFVMvAeuDVqWLzRn9ndDeT2nCfx3YbXKW/wBacAsBsWXjHNpq0dlhGxfNi8RoD8Gn4bwjtA==\",\"_location\":\"/formality-lang\",\"_phantomChildren\":{},\"_requested\":{\"type\":\"version\",\"registry\":true,\"raw\":\"formality-lang@0.1.180\",\"name\":\"formality-lang\",\"escapedName\":\"formality-lang\",\"rawSpec\":\"0.1.180\",\"saveSpec\":null,\"fetchSpec\":\"0.1.180\"},\"_requiredBy\":[\"#DEV:/\"],\"_resolved\":\"https://registry.npmjs.org/formality-lang/-/formality-lang-0.1.180.tgz\",\"_spec\":\"0.1.180\",\"_where\":\"/Users/maisa/Documents/Provit\",\"author\":{\"name\":\"Victor Maia\"},\"bin\":{\"fm\":\"src/main.js\"},\"bugs\":{\"url\":\"https://github.com/moonad/formality-core/issues\"},\"dependencies\":{\"xhr-request-promise\":\"^0.1.2\"},\"description\":\"![](archive/images/formality-banner-white.png)\",\"homepage\":\"https://github.com/moonad/formality-core#readme\",\"license\":\"MIT\",\"main\":\"src/fm-lib.js\",\"name\":\"formality-lang\",\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/moonad/formality-core.git\"},\"scripts\":{\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\"},\"version\":\"0.1.180\"}");

/***/ }),

/***/ "./node_modules/formality-lang/src/fm-core.js":
/*!****************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-core.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An FM-Lang term is an ADT represented as a JSON.
// - Var: a variable
// - Typ: the type of types, `Type`
// - All: the dependent function type, `{x : A} -> B`, optionally erased
// - Lam: a lambda, `{x} => B`, optionally erased/annotated
// - App: an application `f(a)`, optionally erased
// - Box: a boxed type, `!A`
// - Put: a boxed value, `#a`
// - Tak: unboxes a boxed value, `<>a`
// - Dup: copies a boxed value, `dup x = a; b`
// - Dbl: type of a native number
// - Val: value of a native number
// - Op1: partially applied binary numeric operation, `|n + k|`, with `k` fixed
// - Op2: binary numeric operation, `|x + y|`
// - Ite: if-then-else, `if n p`,  with a numeric conditional `n`, and two branches in a pair `p`
// - Cpy: copies a number, `cpy x = a; b`
// - Sig: type of a dependent pair, `[x : A, B(x)]`, or of a subset type, `[x : A ~ B(x)]`
// - Par: value of a dependent pair, `[a, b]`, or of a dependent intersection `[a ~ b]`
// - Fst: extracts 1st value of a dependent pair, `fst p`, or of a dependent intersection, `~fst p`
// - Snd: extracts 2nd value of a dependent pair, `snd p`, or of a dependent intersection, `~snd p`
// - Prj: projects a dependent pair, `get [x , y] = a; b`, or a dependent intersection, `get [x ~ y] = a; b`
// - Ann: an explicit type annotaion, `: A a`
// - Log: debug-prints a term during evaluation
// - Hol: a type-hole
// - Ref: a reference to a global def
const Var = (index, loc)                          => ["Var", {index},                        MEMO && ("^" + index)                             , loc];
const Typ = (loc)                                 => ["Typ", {},                             MEMO && ("ty")                                    , loc];
const Tid = (expr, loc)                           => ["Tid", {expr},                         MEMO && expr[2]                                   , loc];
const Utt = (expr, loc)                           => ["Utt", {expr},                         MEMO && ("ut" + expr[2])                          , loc];
const Utv = (expr, loc)                           => ["Utv", {expr},                         MEMO && ("uv" + expr[2])                          , loc];
const Ute = (expr, loc)                           => ["Ute", {expr},                         MEMO && ("ue" + expr[2])                          , loc];
const All = (name, bind, body, eras, loc)         => ["All", {name, bind, body, eras},       MEMO && ("al" + (eras?"~":"") + bind[2] + body[2]), loc];
const Lam = (name, bind, body, eras, loc)         => ["Lam", {name, bind, body, eras},       MEMO && ("lm" + (eras?"~":"") + body[2])          , loc];
const App = (func, argm, eras, loc)               => ["App", {func, argm, eras},             MEMO && ("ap" + (eras?"~":"") + func[2] + argm[2]), loc];
const Box = (expr, loc)                           => ["Box", {expr},                         MEMO && ("bx" + expr[2])                          , loc];
const Put = (expr, loc)                           => ["Put", {expr},                         MEMO && ("pt" + expr[2])                          , loc];
const Tak = (expr, loc)                           => ["Tak", {expr},                         MEMO && ("tk" + expr[2])                          , loc];
const Dup = (name, expr, body, loc)               => ["Dup", {name, expr, body},             MEMO && ("dp" + expr[2] + body[2])                , loc];
const Num = (loc)                                 => ["Num", {},                             MEMO && ("wd")                                    , loc];
const Val = (numb, loc)                           => ["Val", {numb},                         MEMO && ("[" + numb + "]")                        , loc];
const Op1 = (func, num0, num1, loc)               => ["Op1", {func, num0, num1},             MEMO && ("o1" + func + num0[2] + num1[2])         , loc];
const Op2 = (func, num0, num1, loc)               => ["Op2", {func, num0, num1},             MEMO && ("o2" + func + num0[2] + num1[2])         , loc];
const Ite = (cond, pair, loc)                     => ["Ite", {cond, pair},                   MEMO && ("ie" + cond[2] + pair[2])                , loc];
const Cpy = (name, numb, body, loc)               => ["Cpy", {name, numb, body},             MEMO && ("cy" + numb[2] + body[2])                , loc];
const Sig = (name, typ0, typ1, eras, loc)         => ["Sig", {name, typ0, typ1, eras},       MEMO && ("sg" + eras + typ0[2] + typ1[2])         , loc];
const Par = (val0, val1, eras, loc)               => ["Par", {val0, val1, eras},             MEMO && ("pr" + eras + val0[2] + val1[2])         , loc];
const Fst = (pair, eras=0, loc)                   => ["Fst", {pair, eras},                   MEMO && ("ft" + eras + pair[2])                   , loc];
const Snd = (pair, eras=0, loc)                   => ["Snd", {pair, eras},                   MEMO && ("sd" + eras + pair[2])                   , loc];
const Prj = (nam0, nam1, pair, body, eras=0, loc) => ["Prj", {nam0, nam1, pair, body, eras}, MEMO && ("pj" + eras + pair[2] + body[2])         , loc];
const Slf = (name, type, loc)                     => ["Slf", {name, type},                   MEMO && ("sf" + type[2])                          , loc];
const New = (type, expr, loc)                     => ["New", {type, expr},                   MEMO && expr[2]                                   , loc];
const Use = (expr, loc)                           => ["Use", {expr},                         MEMO && expr[2]                                   , loc];
const Ann = (type, expr, done, loc)               => ["Ann", {type, expr, done},             MEMO && expr[2]                                   , loc];
const Log = (msge, expr, loc)                     => ["Log", {msge, expr},                   MEMO && expr[2]                                   , loc];
const Hol = (name, loc)                           => ["Hol", {name},                         MEMO && ("{?" + name + "?}")                      , loc];
const Ref = (name, eras, loc)                     => ["Ref", {name, eras},                   MEMO && ("{" + name + "}")                        , loc];
var MEMO  = true;

// ::::::::::::::::::
// :: Substitution ::
// ::::::::::::::::::

// Shifts a term
// shift : Maybe(Term) -> Nat -> Nat -> Maybe(Term)
const shift = (term, inc, depth) => {
  if  (!term) {
    return null;
  } else {
    const [f, [c, t, h, l], i, d] = [shift, term, inc, depth];
    switch (c) {
      case "Var": return Var(t.index < d ? t.index : t.index + i, l);
      case "Typ": return Typ(l);
      case "Tid": return Tid(f(t.expr, i, d), l);
      case "Utt": return Utt(f(t.expr, i, d), l);
      case "Utv": return Utv(f(t.expr, i, d), l);
      case "Ute": return Ute(f(t.expr, i, d), l);
      case "All": return All(t.name, f(t.bind, i, d), f(t.body, i, d+1), t.eras, l);
      case "Lam": return Lam(t.name, f(t.bind, i, d), f(t.body, i, d+1), t.eras, l);
      case "App": return App(f(t.func, i, d), f(t.argm, i, d), t.eras, l);
      case "Box": return Box(f(t.expr, i, d), l);
      case "Put": return Put(f(t.expr, i, d), l);
      case "Tak": return Tak(f(t.expr, i, d), l);
      case "Dup": return Dup(t.name, f(t.expr, i, d), f(t.body, i, d+1), l);
      case "Num": return Num(l);
      case "Val": return Val(t.numb, l);
      case "Op1": return Op1(t.func, f(t.num0, i, d), f(t.num1, i, d), l);
      case "Op2": return Op2(t.func, f(t.num0, i, d), f(t.num1, i, d), l);
      case "Ite": return Ite(f(t.cond, i, d), f(t.pair, i, d), l);
      case "Cpy": return Cpy(t.name, f(t.numb, i, d), f(t.body, i, d+1), l);
      case "Sig": return Sig(t.name, f(t.typ0, i, d), f(t.typ1, i, d+1),  t.eras, l);
      case "Par": return Par(f(t.val0, i, d), f(t.val1, i, d), t.eras, l);
      case "Fst": return Fst(f(t.pair, i, d), t.eras, l);
      case "Snd": return Snd(f(t.pair, i, d), t.eras, l);
      case "Prj": return Prj(t.nam0, t.nam1, f(t.pair, i,  d), f(t.body, i, d+2), t.eras, l);
      case "Slf": return Slf(t.name, f(t.type, i, d+1), l);
      case "New": return New(f(t.type, i, d), f(t.expr, i, d), l);
      case "Use": return Use(f(t.expr, i, d), l);
      case "Ann": return Ann(f(t.type, i, d), f(t.expr, i, d), t.done, l);
      case "Log": return Log(f(t.msge, i, d), f(t.expr, i, d), l);
      case "Hol": return Hol(t.name, l);
      case "Ref": return Ref(t.name, t.eras, l);
    }
  }
}

// shift : Maybe(Term) -> Term -> Nat -> Maybe(Term)
const subst = (term, val, depth) => {
  if  (!term) {
    return null;
  } else {
    const [s, f, [c, t, h, l], v, d] = [shift, subst, term, val, depth];
    switch (c) {
      case "Var": return d === t.index ? v : Var(t.index - (t.index > d ? 1 : 0), l);
      case "Typ": return Typ(l);
      case "Tid": return Tid(f(t.expr, v, d), l);
      case "Utt": return Utt(f(t.expr, v, d), l);
      case "Utv": return Utv(f(t.expr, v, d), l);
      case "Ute": return Ute(f(t.expr, v, d), l);
      case "All": return All(t.name, f(t.bind, v, d), f(t.body, s(v,1,0), d+1), t.eras, l);
      case "Lam": return Lam(t.name, f(t.bind, v, d), f(t.body, s(v,1,0), d+1), t.eras, l);
      case "App": return App(f(t.func, v, d), f(t.argm, v, d), t.eras, l);
      case "Box": return Box(f(t.expr, v, d), l);
      case "Put": return Put(f(t.expr, v, d), l);
      case "Tak": return Tak(f(t.expr, v, d), l);
      case "Dup": return Dup(t.name, f(t.expr, v, d), f(t.body, s(v,1,0), d+1), l);
      case "Num": return Num(l);
      case "Val": return Val(t.numb, l);
      case "Op1": return Op1(t.func, f(t.num0, v, d), f(t.num1, v, d), l);
      case "Op2": return Op2(t.func, f(t.num0, v, d), f(t.num1, v, d), l);
      case "Ite": return Ite(f(t.cond, v, d), f(t.pair, v, d), l);
      case "Cpy": return Cpy(t.name, f(t.numb, v, d), f(t.body, s(v,1,0), d+1), l);
      case "Sig": return Sig(t.name, f(t.typ0, v, d), f(t.typ1, s(v,1,0), d+1),  t.eras, l);
      case "Par": return Par(f(t.val0, v, d), f(t.val1, v, d), t.eras, l);
      case "Fst": return Fst(f(t.pair, v, d), t.eras, l);
      case "Snd": return Snd(f(t.pair, v, d), t.eras, l);
      case "Prj": return Prj(t.nam0, t.nam1, f(t.pair, v, d), f(t.body, s(v,2,0), d+2), t.eras, l);
      case "Slf": return Slf(t.name, f(t.type, s(v,1,0), d+1), l);
      case "New": return New(f(t.type, v, d), f(t.expr, v, d), l);
      case "Use": return Use(f(t.expr, v, d), l);
      case "Ann": return Ann(f(t.type, v, d), f(t.expr, v, d), t.done, l);
      case "Log": return Log(f(t.msge, v, d), f(t.expr, v, d), l);
      case "Hol": return Hol(t.name, l);
      case "Ref": return Ref(t.name, t.eras, l);
    }
  }
}

// subst_many : Term -> [Term] -> Nat -> Term
const subst_many = (term, vals, depth) => {
  for (var i = 0; i < vals.length; ++i) {
    term = subst(term, shift(vals[i], vals.length - i - 1, 0), depth + vals.length - i - 1);
  }
  return term;
}

// ::::::::::::::::
// :: Evaluation ::
// ::::::::::::::::

// Reduces a term to normal form or head normal form
// Opts: weak, unbox, logging, eta
const reduce = (term, opts = {}) => {
  const names_new = null;
  const names_ext = (bind, name, rest) => {
    return {bind, name, rest};
  }
  const names_get = (i, names) => {
    for (var k = 0; k < i; ++k) {
      names = names ? names.rest : null;
    }
    return names ? {bind: names.bind, name: names.name} : null;
  };
  const names_len = (names) => {
    for (var i = 0; names; ++i) {
      names = names.rest;
    }
    return i;
  };
  const names_arr = names => {
    return names ? [names.name].concat(names_arr(names.rest)) : [];
  };
  const names_var = (i, names) => {
    const got = names_get(i, names);
    return got ? got.bind : Var(names_len(names) - i - 1);
  };
  const apply = (func, argm, eras, names) => {
    var func = reduce(func, names);
    if (!opts.no_app && func[0] === "Lam") {
      return reduce(func[1].body(argm), names);
    } else if (!opts.no_app && func[0] === "Dup") {
      return Dup(func[1].name, func[1].expr, x => weak_reduce(App(func[1].body(x), argm, eras), names_ext(x, func[1].name, names)));
    } else {
      return App(func, weak_reduce(argm, names), eras);
    }
  };
  const take = (expr, names) => {
    var expr = reduce(expr, names);
    if (!opts.no_tak && expr[0] === "Put") {
      return reduce(expr[1].expr, names);
    } else if (!opts.no_tak && expr[0] === "Dup"){
      return Dup(expr[1].name, expr[1].expr, x => weak_reduce(Tak(expr[1].body(x)), names_ext(x, expr[1].name, names)));
    } else {
      return Tak(expr);
    }
  };
  const duplicate = (name, expr, body, names) => {
    var expr = reduce(expr, names);
    if (!opts.dup && expr[0] === "Put") {
      return reduce(body(expr[1].expr), names);
    } else if (!opts.no_dup && expr[0] === "Dup") {
      return Dup(expr[1].name, expr[1].expr, x => weak_reduce(Dup(name, expr[1].body(x), x => body(x)), names_ext(x, name, expr[1].name)));
    } else {
      if (opts.undup) {
        return reduce(body(Tak(expr)), names);
      } else {
        return Dup(name, expr, x => weak_reduce(body(x), names_ext(x, name, names)));
      }
    }
  };
  const dereference = (name, eras, names) => {
    if (!opts.no_ref && (opts.defs||{})[name]) {
      return reduce(unquote(eras ? erase((opts.defs||{})[name]) : (opts.defs||{})[name]), names_new);
    } else {
      return Ref(name, eras);
    }
  };
  const op1 = (func, num0, num1, names) => {
    var num0 = reduce(num0, names);
    if (!opts.no_op1 && num0[0] === "Val") {
      switch (func) {
        case ".+."   : return Val(num0[1].numb + num1[1].numb);
        case ".-."   : return Val(num0[1].numb - num1[1].numb);
        case ".*."   : return Val(num0[1].numb * num1[1].numb);
        case "./."   : return Val(num0[1].numb / num1[1].numb);
        case ".%."   : return Val(num0[1].numb % num1[1].numb);
        case ".**."  : return Val(num0[1].numb ** num1[1].numb);
        case ".&."   : return Val((num0[1].numb & num1[1].numb) >>> 0);
        case ".|."   : return Val((num0[1].numb | num1[1].numb) >>> 0);
        case ".^."   : return Val((num0[1].numb ^ num1[1].numb) >>> 0);
        case ".~."   : return Val(~ num1[1].numb);
        case ".>>>." : return Val((num0[1].numb >>> num1[1].numb));
        case ".<<."  : return Val((num0[1].numb << num1[1].numb));
        case ".>."   : return Val(num0[1].numb > num1[1].numb ? 1 : 0);
        case ".<."   : return Val(num0[1].numb < num1[1].numb ? 1 : 0);
        case ".==."  : return Val(num0[1].numb === num1[1].numb ? 1 : 0);
        default      : throw "[NORMALIZATION-ERROR]\nUnknown primitive: " + func + ".";
      }
    } else {
      return Op1(func, num0, num1);
    }
  };
  const op2 = (func, num0, num1, names) => {
    var num1 = reduce(num1, names);
    if (!opts.no_op2 && num1[0] === "Val") {
      return reduce(Op1(func, num0, num1, null), names);
    } else {
      return Op2(func, weak_reduce(num0, names), num1);
    }
  };
  const if_then_else = (cond, pair, names) => {
    var cond = reduce(cond, names);
    if (!opts.no_ite && cond[0] === "Val") {
      return cond[1].numb > 0 ? reduce(Fst(pair, false, null), names) : reduce(Snd(pair, false, null), names);
    } else {
      return Ite(cond, weak_reduce(pair, names));
    }
  };
  const copy = (name, numb, body, names) => {
    var numb = reduce(numb, names);
    if (!opts.no_cpy && numb[0] === "Val") {
      return reduce(body(numb), names);
    } else {
      return Cpy(name, numb, x => weak_reduce(body(x), names_ext(x, name, names)));
    }
  };
  const first = (pair, eras, names) => {
    var pair = reduce(pair, names);
    if (!opts.no_fst && pair[0] === "Par") {
      return reduce(pair[1].val0, names);
    } else {
      return Fst(pair, eras);
    }
  };
  const second = (pair, eras, names) => {
    var pair = reduce(pair, names);
    if (!opts.no_snd && pair[0] === "Par") {
      return reduce(pair[1].val1, names);
    } else {
      return Snd(pair, eras);
    }
  };
  const project = (nam0, nam1, pair, body, eras, names) => {
    var pair = reduce(pair, names);
    if (!opts.no_prj && pair[0] === "Par") {
      return reduce(body(pair[1].val0, pair[1].val1), names);
    } else {
      return Prj(nam0, nam1, pair, (x,y) => weak_reduce(body(x,y), names_ext(y, nam0, names_ext(x, nam1, names))), eras);
    }
  };
  //const restrict = (expr, names) => {
    //var expr = reduce(expr, names);
    //if (expr[0] === "Utv") {
      //return reduce(expr[1].expr, names);
    //} else {
      //return Ute(expr);
    //}
  //};
  //const unrestrict = (expr, names) => {
    //var expr = reduce(expr, names);
    //if (expr[0] === "Ute") {
      //return reduce(expr[1].expr, names);
    //} else {
      //return Ute(expr);
    //}
  //};
  const log = (msge, expr, names) => {
    var msge = reduce(msge, names);
    var expr = reduce(expr, names);
    if (opts.logging) {
      var nams = names_arr(names).reverse();
    }
    if (opts.show) {
      console.log(opts.show(quote(msge, 0), names || null));
    }
    return expr;
  };
  const unquote = (term, names = null) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return names_var(term.index, names);
      case "Typ": return Typ();
      case "Tid": return Tid(unquote(term.expr, names));
      case "Utt": return Utt(unquote(term.expr, names));
      case "Utv": return Utv(unquote(term.expr, names));
      case "Ute": return Ute(unquote(term.expr, names));
      case "All": return All(term.name, unquote(term.bind, names), x => unquote(term.body, names_ext(x, null, names)), term.eras);
      case "Lam": return Lam(term.name, term.bind && unquote(term.bind, names), x => unquote(term.body, names_ext(x, null, names)), term.eras);
      case "App": return App(unquote(term.func, names), unquote(term.argm, names), term.eras);
      case "Box": return Box(unquote(term.expr, names));
      case "Put": return Put(unquote(term.expr, names));
      case "Tak": return Tak(unquote(term.expr, names));
      case "Dup": return Dup(term.name, unquote(term.expr, names), x => unquote(term.body, names_ext(x, null, names)));
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return Op1(term.func, unquote(term.num0, names), unquote(term.num1, names));
      case "Op2": return Op2(term.func, unquote(term.num0, names), unquote(term.num1, names));
      case "Ite": return Ite(unquote(term.cond, names), unquote(term.pair, names));
      case "Cpy": return Cpy(term.name, unquote(term.numb, names), x => unquote(term.body, names_ext(x, null, names)));
      case "Sig": return Sig(term.name, unquote(term.typ0, names), x => unquote(term.typ1, names_ext(x, null, names)), term.eras);
      case "Par": return Par(unquote(term.val0, names), unquote(term.val1, names), term.eras);
      case "Fst": return Fst(unquote(term.pair, names), term.eras);
      case "Snd": return Snd(unquote(term.pair, names), term.eras);
      case "Prj": return Prj(term.nam0, term.nam1, unquote(term.pair, names), (x,y) => unquote(term.body, names_ext(y, null, names_ext(x, null, names)), term.eras));
      case "Slf": return Slf(term.name, x => unquote(term.type, names_ext(x, null, names)));
      case "New": return New(unquote(term.type, names), unquote(term.expr, names));
      case "Use": return Use(unquote(term.expr, names));
      case "Ann": return Ann(unquote(term.type, names), unquote(term.expr, names), term.done);
      case "Log": return Log(unquote(term.msge, names), unquote(term.expr, names));
      case "Hol": return Hol(term.name);
      case "Ref": return Ref(term.name, term.eras);
    }
  };
  const reduce = (term, names = null) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(term.index);
      case "Typ": return Typ();
      case "Tid": return reduce(term.expr, names);
      case "Utt": return Utt(reduce(term.expr, names));
      case "Utv": return reduce(term.expr, names);
      case "Ute": return reduce(term.expr, names);
      case "All": return All(term.name, weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(x, term.name, names)), term.eras);
      case "Lam": return Lam(term.name, term.bind && weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(x, term.name, names)), term.eras);
      case "App": return apply(term.func, term.argm, term.eras, names);
      case "Box": return Box(weak_reduce(term.expr, names));
      case "Put": return opts.unbox ? reduce(term.expr, names) : Put(weak_reduce(term.expr, names));
      case "Tak": return opts.unbox ? reduce(term.expr, names) : take(weak_reduce(term.expr, names), names);
      case "Dup": return opts.unbox ? reduce(term.body(term.expr), names) : duplicate(term.name, term.expr, term.body, names);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return op1(term.func, term.num0, term.num1, names);
      case "Op2": return op2(term.func, term.num0, term.num1, names);
      case "Ite": return if_then_else(term.cond, term.pair, names);
      case "Cpy": return opts.unbox ? reduce(term.body(term.numb), names) : copy(term.name, term.numb, term.body, names);
      case "Sig": return Sig(term.name, weak_reduce(term.typ0, names), x => weak_reduce(term.typ1(x), names_ext(x, term.name, names)), term.eras);
      case "Par": return Par(weak_reduce(term.val0, names), weak_reduce(term.val1, names), term.eras);
      case "Fst": return first(term.pair, term.eras, names);
      case "Snd": return second(term.pair, term.eras, names);
      case "Prj": return project(term.nam0, term.nam1, term.pair, term.body, term.eras, names);
      case "Slf": return Slf(term.name, x => weak_reduce(term.type(x), names_ext(x, term.name, names)));
      case "New": return reduce(term.expr, names);
      case "Use": return reduce(term.expr, names);
      case "Ann": return reduce(term.expr, names);
      case "Log": return log(term.msge, term.expr, names);
      case "Hol": return Hol(term.name);
      case "Ref": return dereference(term.name, term.eras, names);
    }
  };
  const quote = (term, depth) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(depth - 1 - term.index);
      case "Typ": return Typ();
      case "Tid": return Tid(quote(term.expr, depth));
      case "Utt": return Utt(quote(term.expr, depth));
      case "Utv": return Utv(quote(term.expr, depth));
      case "Ute": return Ute(quote(term.expr, depth));
      case "All": return All(term.name, quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "Lam": return Lam(term.name, term.bind && quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "App": return App(quote(term.func, depth), quote(term.argm, depth), term.eras);
      case "Box": return Box(quote(term.expr, depth));
      case "Put": return Put(quote(term.expr, depth));
      case "Tak": return Tak(quote(term.expr, depth));
      case "Dup": return Dup(term.name, quote(term.expr, depth), quote(term.body(Var(depth)), depth + 1));
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return Op1(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Op2": return Op2(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Ite": return Ite(quote(term.cond, depth), quote(term.pair, depth));
      case "Cpy": return Cpy(term.name, quote(term.numb, depth), quote(term.body(Var(depth)), depth + 1));
      case "Sig": return Sig(term.name, quote(term.typ0, depth), quote(term.typ1(Var(depth)), depth + 1), term.eras);
      case "Par": return Par(quote(term.val0, depth), quote(term.val1, depth), term.eras);
      case "Fst": return Fst(quote(term.pair, depth), term.eras);
      case "Snd": return Snd(quote(term.pair, depth), term.eras);
      case "Prj": return Prj(term.nam0, term.nam1, quote(term.pair, depth), quote(term.body(Var(depth), Var(depth + 1)), depth + 2), term.eras);
      case "Slf": return Slf(term.name, quote(term.type(Var(depth)), depth + 1));
      case "New": return New(quote(term.type, depth), quote(term.expr, depth));
      case "Use": return Use(quote(term.expr, depth));
      case "Ann": return Ann(quote(term.type, depth), quote(term.expr, depth), term.done);
      case "Log": return Log(quote(term.msge, depth), quote(term.expr, depth));
      case "Hol": return Hol(term.name);
      case "Ref": return Ref(term.name, term.eras);
    }
  };
  const weak_reduce = (term, names) => {
    return opts.weak ? term : reduce(term, names);
  };
  MEMO = false;
  var unquoted = unquote(term);
  var reduced = reduce(unquoted);
  MEMO = true;
  var quoted = quote(reduced, 0);
  return quoted;
};

// erase : Term -> Term
const erase = (term) => {
  const [f,[c,t],e] = [erase, term, Put(Hol(""))];
  switch (c) {
    case "Var": return Var(t.index);
    case "Typ": return Typ();
    case "Tid": return f(t.expr);
    case "Utt": return Utt(f(t.expr));
    case "Utv": return f(t.expr);
    case "Ute": return f(t.expr);
    case "All": return All(t.name, f(t.bind), f(t.body), t.eras);
    case "Lam": return t.eras ? f(subst(t.body, e, 0)) : Lam(t.name, null, f(t.body), t.eras);
    case "App": return t.eras ? f(t.func)              : App(f(t.func), f(t.argm), t.eras);
    case "Box": return Box(f(t.expr));
    case "Put": return Put(f(t.expr));
    case "Tak": return Tak(f(t.expr));
    case "Dup": return Dup(t.name, f(t.expr), f(t.body));
    case "Num": return Num();
    case "Val": return Val(t.numb);
    case "Op1": return Op1(t.func, f(t.num0), f(t.num1));
    case "Op2": return Op2(t.func, f(t.num0), f(t.num1));
    case "Ite": return Ite(f(t.cond), f(t.pair));
    case "Cpy": return Cpy(t.name, f(t.numb), f(t.body));
    case "Sig": return Sig(t.name, f(t.typ0), f(t.typ1), t.eras);
    case "Par": return (t.eras === 1 ? f(t.val1) : t.eras === 2 ? f(t.val0) : Par(f(t.val0), f(t.val1), t.eras));
    case "Fst": return (t.eras === 1 ? e         : t.eras === 2 ? f(t.pair) : Fst(f(t.pair), t.eras));
    case "Snd": return (t.eras === 1 ? f(t.pair) : t.eras === 2 ? e         : Snd(f(t.pair), t.eras));
    case "Prj": return (
      t.eras === 1 ? f(subst_many(t.body, [e, f(t.pair)]), 0) :
      t.eras === 2 ? f(subst_many(t.body, [f(t.pair), e]), 0) :
      Prj(t.nam0, t.nam1, f(t.pair), f(t.body), t.eras));
    case "Slf": return Slf(t.name, f(t.type));
    case "New": return f(t.expr);
    case "Use": return f(t.expr);
    case "Ann": return f(t.expr);
    case "Log": return Log(f(t.msge), f(t.expr));
    case "Hol": return Hol(t.name);
    case "Ref": return Ref(t.name, true);
  }
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

// equal : Term -> Term -> Opts -> Bool
const equal = (a, b, d, opts) => {
  const Eqs = (a, b, d) => ["Eqs", {a, b, d}];
  const Bop = (v, x, y) => ["Bop", {v, x, y}];
  const And = (x,y)     => Bop(false, x, y);
  const Or  = (x,y)     => Bop(true, x, y);
  const Val = (v)       => ["Val", {v}];

  const step = (node) => {
    switch (node[0]) {
      // An equality test
      case "Eqs":
        var {a, b, d} = node[1];

        // Gets whnfs with and without dereferencing
        // Note: can't use weak:true because it won't give opportunity to eta...
        var ax = reduce(a, {show: null, defs: opts.defs, weak: true, undup: true, defs: {}});
        var bx = reduce(b, {show: null, defs: opts.defs, weak: true, undup: true, defs: {}});
        var ay = reduce(a, {show: null, defs: opts.defs, weak: true, undup: true});
        var by = reduce(b, {show: null, defs: opts.defs, weak: true, undup: true});

        // Optimization: if hashes are equal, then a == b prematurely
        if (a[2] === b[2] || ax[2] === bx[2] || ay[2] === by[2]) {
          return Val(true);
        }

        // If non-deref whnfs are app and fields are equal, then a == b
        var x = null;
        if (ax[0] === "Ref" && bx[0] === "Ref" && ax[1].name === bx[1].name) {
          x = Val(true);
        } else if (ax[0] === "App" && bx[0] === "App") {
          var func = Eqs(ax[1].func, bx[1].func, d);
          var argm = Eqs(ax[1].argm, bx[1].argm, d);
          x = Bop(false, func, argm);
        }

        // If whnfs are equal and fields are equal, then a == b
        var y = null;
        switch (ay[0] + "-" + by[0]) {
          case "Var-Var": y = Val(ay[1].index === by[1].index); break;
          case "Typ-Typ": y = Val(true); break;
          case "Tid-Tid": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Utt-Utt": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Utv-Utv": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Ute-Ute": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "All-All": y = And(And(Eqs(ay[1].bind, by[1].bind, d), Eqs(ay[1].body, by[1].body, d+1)), Val(ay[1].eras === by[1].eras)); break;
          case "Lam-Lam": y = And(Eqs(ay[1].body, by[1].body, d+1), Val(ay[1].eras === by[1].eras)); break;
          case "App-App": y = And(And(Eqs(ay[1].func, by[1].func, d), Eqs(ay[1].argm, by[1].argm, d)), Val(ay[1].eras === by[1].eras)); break;
          case "Box-Box": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Put-Put": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Tak-Tak": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Dup-Dup": y = And(Eqs(ay[1].expr, by[1].expr, d), Eqs(ay[1].body, by[1].body, d+1)); break;
          case "Num-Num": y = Val(true); break;
          case "Val-Val": y = Val(ay[1].numb === by[1].numb); break;
          case "Op1-Op1": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0, d), Val(ay[1].num1[1].numb === ay[1].num1[1].numb))); break;
          case "Op2-Op2": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0, d), Eqs(ay[1].num1, by[1].num1, d))); break;
          case "Ite-Ite": y = And(Eqs(ay[1].cond, by[1].cond, d), Eqs(ay[1].pair, by[1].pair, d)); break;
          case "Cpy-Cpy": y = And(Eqs(ay[1].numb, by[1].numb, d), Eqs(ay[1].body, by[1].body, d+1)); break;
          case "Sig-Sig": y = And(Eqs(ay[1].typ0, by[1].typ0, d), Eqs(ay[1].typ1, by[1].typ1, d+1)); break;
          case "Par-Par": y = And(Eqs(ay[1].val0, by[1].val0, d), Eqs(ay[1].val1, by[1].val1, d)); break;
          case "Fst-Fst": y = And(Eqs(ay[1].pair, by[1].pair, d), Val(ay[1].eras === by[1].eras)); break;
          case "Snd-Snd": y = And(Eqs(ay[1].pair, by[1].pair, d), Val(ay[1].eras === by[1].eras)); break;
          case "Prj-Prj": y = And(Eqs(ay[1].pair, by[1].pair, d), Eqs(ay[1].body, by[1].body, d+2)); break;
          case "Slf-Slf": y = Eqs(ay[1].type, by[1].type, d+1); break;
          case "New-New": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Use-Use": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Log-Log": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Ann-Ann": y = Eqs(ay[1].expr, by[1].expr, d); break;
          default:
            if (ay[0] === "Hol") {
              y = Val(true);
            } else if (by[0] === "Hol") {
              y = Val(true);
            } else {
              y = Val(false);
            }
        }

        return x ? Bop(true, x, y) : y;

      // A binary operation (or / and)
      case "Bop":
        var {v, x, y} = node[1];
        if (x[0] === "Val") {
          return x[1].v === v ? Val(v) : y;
        } else if (y[0] === "Val") {
          return y[1].v === v ? Val(v) : x;
        } else {
          var X = step(x);
          var Y = step(y);
          return Bop(v, X, Y);
        }

      // A result value (true / false)
      case "Val":
        return node;
    }
  }

  // Expands the search tree until it finds an answer
  var tree = Eqs(erase(a), erase(b), d);
  while (tree[0] !== "Val") {
    var tree = step(tree);
  }
  return tree[1].v;
}

// :::::::::::::::::::
// :: Type Checking ::
// :::::::::::::::::::

const {marked_code, random_excuse} = __webpack_require__(/*! ./fm-error.js */ "./node_modules/formality-lang/src/fm-error.js");

// Type-checks a term and returns both its type and its program (an erased
// copy of the term with holes filled and adjustments made). Does NOT check
// termination, so a well-typed term may be bottom. Use haltcheck for that.
// typecheck : Term -> Term -> Opts -> [Term, Term]
const typecheck = (term, expect, opts = {}) => {
  var type_memo  = {};
  var hole_msg   = {};
  var hole_depth = {};
  var found_anns = [];

  const pad_right = (len, chr, str) => {
    while (str.length < len) {
      str += chr;
    }
    return str;
  };

  const highlight = (str)  => {
    return "\x1b[2m" + str + "\x1b[0m";
  };

  const ctx_new = null;

  const ctx_ext = (name, term, type, eras, many, lvel, ctx) => {
    return {name, term, type, eras, many, lvel, uses: 0, rest: ctx};
  };

  const ctx_get = (i, ctx, use) => {
    if (i < 0) return null;
    for (var k = 0; k < i; ++k) {
      if (!ctx.rest) return null;
      ctx = ctx.rest;
    }
    var got = {
      name: ctx.name,
      term: ctx.term ? shift(ctx.term, i + 1, 0) : Var(i),
      type: shift(ctx.type, i + 1, 0),
      eras: ctx.eras,
      many: ctx.many,
      uses: ctx.uses,
      lvel: ctx.lvel,
    };
    if (use) {
      ctx.uses += 1;
    }
    return got;
  };

  const ctx_str = (ctx) => {
    var txt = [];
    var idx = 0;
    var max_len = 0;
    for (var c = ctx; c !== null; c = c.rest) {
      max_len = Math.max(c.name.length, max_len);
    }
    for (var c = ctx; c !== null; c = c.rest) {
      var name = c.name;
      var type = c.type;
      var tstr = opts.show(reduce(type, {defs: {}, undup: true}) , ctx_names(c.rest));
      txt.push("\x1b[2m- " + pad_right(max_len, " ", c.name) + " : " + tstr + "\x1b[0m");
    }
    return txt.reverse().join("\n");
  };

  const ctx_names = (ctx) => {
    var names = [];
    while (ctx !== null) {
      names.push(ctx.name);
      ctx = ctx.rest;
    }
    return names.reverse();
  };


  const ctx_cpy = ctx => {
    if (ctx === null) {
      return null;
    } else {
      return {
        name: ctx.name,
        term: ctx.term,
        type: ctx.type,
        eras: ctx.eras,
        many: ctx.many,
        uses: ctx.uses,
        lvel: ctx.lvel,
        rest: ctx_cpy(ctx.rest)
      }
    }
  };

  const ctx_subst = (ctx, term) => {
    var vals = [];
    for (var c = ctx, i = 0; c !== null; c = c.rest, ++i) {
      vals.push(c.term ? shift(c.term, i + 1, 0) : Var(i));
    }
    var term = shift(term, vals.length, vals.length);
    var term = subst_many(term, vals.reverse(), 0)
    return term;
  };

  const weak_normal = (term) => {
    return reduce(term, {defs: opts.defs, undup: true, weak: true});
  };

  const display_normal = (term) => {
    return reduce(term, {defs: opts.defs, defs: {}, undup: true, weak: false});
  };

  const format = (ctx, term) => {
    return opts.show ? highlight(opts.show(display_normal(term), ctx_names(ctx))) : "?";
  };

  // Checks and returns the type of a term
  const typecheck = (term, expect, ctx = ctx_new, affine = true, lvel = 0) => {
    const do_error = (str)  => {
      var err_msg = "";
      err_msg += "[ERROR]\n" + str;
      err_msg += "\n- When checking " + format(ctx, term)
      if (ctx !== null) {
        err_msg += "\n- With context:\n" + ctx_str(ctx);
      }
      if (term[3]) {
        err_msg += "\n- On line " + (term[3].row+1) + ", col " + (term[3].col) + ", file \x1b[4m" + term[3].file + ".fm\x1b[0m:";
        err_msg += "\n" + marked_code(term[3]);
      }
      throw err_msg;
    };

    const do_match = (a, b) => {
      if (!equal(a, b, ctx_names(ctx).length, {show: opts.show, defs: opts.defs, hole_depth})) {
        do_error("Type mismatch."
          + "\n- Found type... " + format(ctx, a)
          + "\n- Instead of... " + format(ctx, b));
      }
    };

    if (expect) {
      var expect_nf = weak_normal(expect);
      if (expect[0] === "Typ" || expect[0] === "Utt") {
        affine = false;
      }
    } else {
      var expect_nf = null;
    }

    var ctx_arg = ctx_cpy(ctx);

    var type;
    switch (term[0]) {
      case "Var":
        var got = ctx_get(term[1].index, ctx, affine);
        if (got) {
          if (affine) {
            if (got.eras) {
              do_error("Use of erased variable `" + got.name + "` in proof-relevant position.");
            }
            if (got.uses > 0 && !got.many && !(expect_nf !== null && expect_nf[0] === "Num")) {
              do_error("Use of affine variable `" + got.name + "` more than once in proof-relevant position.");
            }
            if (got.lvel !== lvel) {
              do_error("Use of variable `" + got.name + "` would change its level in proof-relevant position.");
            }
          }
          type = got.type;
        } else {
          do_error("Unbound variable.");
        }
        break;
      case "Typ":
        type = Typ();
        break;
      case "Tid":
        var expr_t = typecheck(term[1].expr, Typ(), ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Utt":
        if (expect_nf !== null && expect_nf[0] !== "Typ") {
          do_error("The inferred type of an unrestricted type (example: "
            + format(ctx, Utt(Ref("A"))) + ") isn't "
            + format(ctx, Typ())
            + ".\n- Inferred type is " + format(ctx, expect_nf));
        }
        var expr_t = typecheck(term[1].expr, Typ(), ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Utv":
        if (expect_nf !== null && expect_nf[0] !== "Utt") {
          do_error("The inferred type of an unrestricted term (example: "
            + format(ctx, Utv(Ref("x")))
            + ") isn't an unrestricted type (example: "
            + format(ctx, Utt(Ref("A")))
            + ").\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var expr_t = expect_nf && expect_nf[0] === "Utt" ? expect_nf[1].expr : null;
        var expr_t = typecheck(term[1].expr, expr_t, ctx, false, lvel, [term, ctx]);
        type = Utt(expr_t);
        break;
      case "Ute":
        if (affine) {
          do_error("Attempted to unrestrict a term (ex: "
            + format(ctx, Ute(Ref("+x")))
            + ") in a proof-relevant position.");
        }
        var expr_t = typecheck(term[1].expr, null, ctx, false, lvel, [term, ctx]);
        var expr_t = weak_normal(expr_t);
        if (expr_t[0] !== "Utt") {
          do_error("Expected an unrestricted type (example: "
            + format(ctx, Utt(Ref("A")))
            + ").\n- Found type... "
            + format(ctx, expr_t));
        }
        type = expr_t[1].expr;
        break;
      case "All":
        if (expect_nf && expect_nf[0] !== "Typ") {
          do_error("The inferred type of a forall (example: "
            + format(ctx, All("x", Ref("A"), Ref("B"), false))
            + ") isn't "
            + format(ctx, Typ())
            + ".\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var bind_t = typecheck(term[1].bind, Typ(), ctx, false, lvel, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, null, term[1].bind, term[1].eras, false, lvel, ctx);
        var body_t = typecheck(term[1].body, Typ(), ex_ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Lam":
        var bind_v = expect_nf && expect_nf[0] === "All" ? expect_nf[1].bind : term[1].bind;
        if (bind_v === null && expect_nf === null) {
          do_error("Can't infer non-annotated lambda.");
        }
        if (bind_v === null && expect_nf !== null) {
          do_error("The inferred type of a lambda (example: "
            + format(ctx, Lam("x",null,Ref("f"),false))
            + ") isn't forall (example: "
            + format(ctx, All("x", Ref("A"), Ref("B"), false))
            + ").\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var bind_t = typecheck(bind_v, Typ(), ctx, false, lvel, ctx);
        var ex_ctx = ctx_ext(term[1].name, null, bind_v, term[1].eras, false, lvel, ctx);
        var body_t = typecheck(term[1].body, expect_nf && expect_nf[0] === "All" ? expect_nf[1].body : null, ex_ctx, affine, lvel, [term, ctx]);
        var body_T = typecheck(body_t, Typ(), ex_ctx, false, lvel, ctx);
        type = All(term[1].name, bind_v, body_t, term[1].eras);
        break;
      case "App":
        var func_t = typecheck(term[1].func, null, ctx, affine, lvel, [term, ctx]);
        var func_t = weak_normal(func_t);
        if (func_t[0] !== "All") {
          do_error("Attempted to apply a value that isn't a function.");
        }
        var argm_t = typecheck(term[1].argm, func_t[1].bind, ctx, affine, lvel, [term, ctx]);
        if (func_t[1].eras !== term[1].eras) {
          do_error("Mismatched erasure.");
        }
        type = subst(func_t[1].body, Ann(func_t[1].bind, term[1].argm, false), 0);
        break;
      case "Box":
        if (expect_nf !== null && expect_nf[0] !== "Typ") {
          do_error("The inferred type of a box (example: "
            + format(ctx, Box(Ref("A")))
            + ") isn't "
            + format(ctx, Typ())
            + ".\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var expr_t = typecheck(term[1].expr, Typ(), ctx, affine, lvel, [term, ctx]);
        var expr_t = weak_normal(expr_t);
        type = Typ();
        break;
      case "Put":
        if (expect_nf !== null && expect_nf[0] !== "Box") {
          do_error("The inferred type of a boxed value (example: "
            + format(ctx, Put(Ref("x")))
            + ") isn't a box (example: "
            + format(ctx, Box(Ref("A")))
            + ").\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var expr_t = expect_nf && expect_nf[0] === "Box" ? expect_nf[1].expr : null;
        var term_t = typecheck(term[1].expr, expr_t, ctx, affine, lvel + 1, [term, ctx]);
        type = Box(term_t);
        break;
      case "Tak":
        var expr_t = typecheck(term[1].expr, null, ctx, affine, lvel - 1, [term, ctx]);
        var expr_t = weak_normal(expr_t);
        if (expr_t[0] !== "Box") {
          do_error("Expected a boxed type (example: "
            + format(ctx, Box(Ref("A")))
            + ").\n- Found type... "
            + format(ctx, expr_t));
        }
        type = expr_t[1].expr;
        break;
      case "Dup":
        var expr_t = typecheck(term[1].expr, null, ctx, affine, lvel, [term, ctx]);
        var expr_t = weak_normal(expr_t);
        if (expr_t[0] !== "Box") {
          do_error("Expected a boxed type (example: "
            + format(ctx, Box(Ref("A")))
            + ").\n- Found type... "
            + format(ctx, expr_t));
        }
        var ex_ctx = ctx_ext(term[1].name, Tak(term[1].expr), expr_t[1].expr, false, true, lvel + 1, ctx);
        var body_t = typecheck(term[1].body, expect_nf && shift(expect_nf, 1, 0), ex_ctx, affine, lvel, [term, ctx]);
        type = subst(body_t, Tak(term[1].expr), 0);
        break;
      case "Num":
        type = Typ();
        break;
      case "Val":
        type = Num();
        break;
      case "Op1":
      case "Op2":
        if (expect_nf !== null && expect_nf[0] !== "Num") {
          do_error("The inferred type of a numeric operation (example: "
            + format(ctx, Op2(term[1].func, Ref("x"), Ref("y")))
            + ") isn't "
            + format(ctx, Num())
            + ".\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var num0_t = typecheck(term[1].num0, Num(), ctx, affine, lvel, [term, ctx]);
        var num1_t = typecheck(term[1].num1, Num(), ctx, affine, lvel, [term, ctx]);
        type = Num();
        break;
      case "Ite":
        var cond_t = typecheck(term[1].cond, null, ctx, affine, lvel, [term, ctx]);
        var cond_t = weak_normal(cond_t);
        if (cond_t[0] !== "Num") {
          do_error("Attempted to use if on a non-numeric value.");
        }
        var pair_t = expect_nf ? Sig("x", expect_nf, shift(expect_nf, 1, 0), 0) : null;
        var pair_t = typecheck(term[1].pair, pair_t, ctx, affine, lvel, [term, ctx]);
        var pair_t = weak_normal(pair_t);
        if (pair_t[0] !== "Sig") {
          do_error("The body of an if must be a pair.");
        }
        var typ0_v = pair_t[1].typ0;
        var typ1_v = subst(pair_t[1].typ1, Typ(), 0);
        if (!equal(typ0_v, typ1_v, ctx_names(ctx).length, {defs: opts.defs, hole_depth})) {
          do_error("Both branches of if must have the same type.");
        }
        type = expect_nf || typ0_v;
        break;
      case "Cpy":
        var numb_t = typecheck(term[1].numb, null, ctx, affine, lvel, [term, ctx]);
        var numb_t = weak_normal(numb_t);
        if (numb_t[0] !== "Num") {
          do_error("Atempted to copy a non-numeric value.");
        }
        var ex_ctx = ctx_ext(term[1].name, term[1].numb, Num(), false, true, lvel, ctx);
        var body_t = typecheck(term[1].body, expect_nf && shift(expect_nf, 1, 0), ex_ctx, affine, lvel, [term, ctx]);
        type = subst(body_t, term[1].numb, 0);
        break;
      case "Sig":
        if (expect_nf && expect_nf[0] !== "Typ") {
          do_error("The inferred type of a sigma (example: "
            + format(ctx, Sig("x", Ref("A"), Ref("B")))
            + ") isn't "
            + format(ctx, Typ())
            + ".\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var typ0_t = typecheck(term[1].typ0, Typ(), ctx, false, lvel, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, null, term[1].typ0, false, false, lvel, ctx);
        var typ1_t = typecheck(term[1].typ1, Typ(), ex_ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Par":
        if (expect_nf && expect_nf[0] !== "Sig") {
          do_error("Inferred type of a pair (example: "
            + format(ctx, Par(Ref("a"),Ref("b")))
            + ") isn't "
            + format(ctx, Sig("x", Ref("A"), Ref("B")))
            + ".\n- Inferred type is "
            + format(ctx, expect_nf));
        }
        var val0_t = typecheck(term[1].val0, expect_nf && expect_nf[1].typ0, ctx, affine, lvel, [term, ctx]);
        if (expect_nf) {
          var val1_t = typecheck(term[1].val1, subst(expect_nf[1].typ1, term[1].val0, 0), ctx, affine, lvel, [term, ctx]);
        } else {
          var val1_t = typecheck(term[1].val1, null, ctx, affine, lvel, [term, ctx]);
          var val1_t = shift(val1_t, 1, 0);
        }
        var eras = expect_nf ? expect_nf[1].eras : term[1].eras;
        if (term[1].eras !== eras) {
          do_error("Mismatched erasure.");
        }
        type = expect_nf || Sig("x", val0_t, val1_t, term[1].eras);
        break;
      case "Fst":
        if (term[1].eras === 1) {
          do_error("Attempted to extract erased first element.");
        }
        var pair_t = typecheck(term[1].pair, null, ctx, affine, lvel, [term, ctx]);
        var pair_t = weak_normal(pair_t);
        if (pair_t[0] !== "Sig") {
          do_error("Attempted to extract the first element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          do_error("Mismatched erasure.");
        }
        type = pair_t[1].typ0;
        break;
      case "Snd":
        if (term[1].eras === 2) {
          do_error("Attempted to extract erased second element.");
        }
        var pair_t = typecheck(term[1].pair, null, ctx, affine, lvel, [term, ctx]);
        var pair_t = weak_normal(pair_t);
        if (pair_t[0] !== "Sig") {
          do_error("Attempted to extract the second element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          do_error("Mismatched erasure.");
        }
        type = subst(pair_t[1].typ1, Fst(term[1].pair, term[1].eras), 0);
        break;
      case "Prj":
        var pair_t = typecheck(term[1].pair, null, ctx, affine, lvel, [term, ctx]);
        var pair_t = weak_normal(pair_t);
        if (pair_t[0] !== "Sig") {
          do_error("Attempted to project the elements of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          do_error("Mismatched erasure.");
        }
        var ex_ctx = ctx_ext(term[1].nam0, null, pair_t[1].typ0, pair_t[1].eras === 1, false, lvel, ctx);
        var ex_ctx = ctx_ext(term[1].nam1, null, pair_t[1].typ1, pair_t[1].eras === 2, false, lvel, ex_ctx);
        try {
          var tp_ctx = ctx_cpy(ex_ctx);
          var body_t = typecheck(term[1].body, shift(expect, 2, 0), tp_ctx, affine, lvel, [term, ctx]);
          var ex_ctx = tp_ctx;
        } catch (e) {
          var tp_ctx = ctx_cpy(ex_ctx);
          var body_t = typecheck(term[1].body, null, ex_ctx, affine, lvel, [term, ctx]);
          var ex_ctx = tp_ctx;
        }
        type = subst(subst(body_t, Snd(shift(term[1].pair, 1, 0), term[1].eras), 0), Fst(term[1].pair, term[1].eras), 0);
        break;
      case "Slf":
        var ex_ctx = ctx_ext(term[1].name, null, term, false, false, lvel, ctx);
        var type_t = typecheck(term[1].type, Typ(), ex_ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "New":
        var ttyp = weak_normal(term[1].type);
        if (ttyp[0] !== "Slf") {
          do_error("Attempted to make an instance of a type that isn't self.");
        }
        var ttyp_t = typecheck(ttyp, null, ctx, false, lvel, [term, ctx]);
        var expr_t = typecheck(term[1].expr, subst(ttyp[1].type, Ann(ttyp, term, true), 0), ctx, affine, lvel, [term, ctx]);
        type = term[1].type;
        break;
      case "Use":
        var expr_t = typecheck(term[1].expr, null, ctx, affine, lvel, [term, ctx]);
        var expr_t = weak_normal(expr_t);
        if (expr_t[0] !== "Slf") {
          do_error("Attempted to use a value that isn't a self type.");
        }
        type = subst(expr_t[1].type, term[1].expr, 0);
        break;
      case "Ann":
        if (!term[1].done) {
          term[1].done = true;
          found_anns.push(term);
          try {
            var type_t = typecheck(term[1].type, Typ(), ctx, affine, lvel, [term, ctx]);
            var expr_t = typecheck(term[1].expr, term[1].type, ctx, affine, lvel, [term, ctx]);
            //if (term[1].expr[0] === "Ref" && is_recursive((opts.defs||{})[term[1].expr[1].name], term[1].expr[1].name)) {
              //do_error("Recursive occurrence of '" + term[1].expr[1].name + "'.");
            //}
            type = term[1].type;
          } catch (e) {
            term[1].done = false;
            throw e;
          }
        } else {
          type = term[1].type;
        }
        break;
      case "Log":
        var msge_v = term[1].msge;
        try {
          var msge_t = typecheck(msge_v, null, ctx, false, lvel, [term, ctx]);
          var msge_t = display_normal(erase(msge_t));
        } catch (e) {
          console.log(e);
          var msge_t = Hol("");
        }
        if (!opts.no_logs) {
          console.log("[LOG]");
          console.log("Term: " + opts.show(msge_v, ctx_names(ctx)));
          console.log("Type: " + opts.show(msge_t, ctx_names(ctx)) + "\n");
        }
        var expr_t = typecheck(term[1].expr, expect, ctx, affine, lvel);
        type = expr_t;
        break;
      case "Hol":
        if (!hole_msg[term[1].name]) {
          hole_msg[term[1].name] = {ctx, name: term[1].name, expect};
          hole_depth[term[1].name] = ctx_names(ctx).length;
        }
        if (expect) {
          type = expect;
        } else {
          throw new Error("Untyped hole.");
        }
        break;
      case "Ref":
        if (!(opts.defs||{})[term[1].name]) {
          do_error("Undefined reference: `" + term[1].name + "`.");
        } else if (!type_memo[term[1].name]) {
          var dref_t = typecheck((opts.defs||{})[term[1].name], null, ctx, affine, lvel, [term, ctx]);
          type_memo[term[1].name] = dref_t;
        }
        type = type_memo[term[1].name];
        break;
      default:
        throw "TODO: type checker for " + term[0] + ".";
    }
    if (expect) {
      var type_nf = weak_normal(type);
      // Fill an Utv
      if (expect_nf[0] === "Utt" && type_nf[0] !== "Utt") {
        return typecheck(Utv(term), expect_nf, ctx_arg, affine, lvel)
      }
      // Fill an Ute
      if (expect_nf[0] !== "Utt" && type_nf[0] === "Utt") {
        return typecheck(Ute(term), expect_nf, ctx_arg, affine, lvel)
      }
      // Check if inferred and expected types match
      do_match(type, expect);
    }
    return type;
  };

  try {
    // Type-checks the term
    var type = typecheck(term, expect);

    // Afterwards, prints hole msgs
    for (var hole_name in hole_msg) {
      var info = hole_msg[hole_name];
      var msg = "";
      msg += "Found hole" + (info.name ? ": '" + info.name + "'" : "") + ".\n";
      if (info.expect) {
        msg += "- With goal... " + format(info.ctx, info.expect) + "\n";
      }
      var cstr = ctx_str(info.ctx);
      msg += "- With context:\n" + (cstr.length > 0 ? cstr + "\n" : "");
      if (!opts.no_logs) {
        console.log(msg);
      }
    }

    // If so, normalize it to an user-friendly form and return
    type = display_normal(type);

    // Cleans side-effects
    for (var i = 0; i < found_anns.length; ++i) {
      found_anns[i][1].done = false;
    }

    return type;

  // In case there is an error, adjust and throw
  } catch (e) {
    if (typeof e === "string") {
      throw e;
    } else {
      console.log(e);
      throw "Sorry, the type-checker couldn't handle your input.";
    }
  }
};

// Checks if a well-typed term terminates. Since well-typed terms must be
// elementary affine, the only way they can fail to halt is through recursion.
// This conservative check excludes any kind of recursion. Further work may be
// done to identify and allow well-founded recursion.
const haltcheck = (term, defs, seen = {}) => {
  switch (term[0]) {
    case "Utv": return haltcheck(term[1].expr, defs, seen);
    case "Ute": return haltcheck(term[1].expr, defs, seen);
    case "Lam": return haltcheck(term[1].body, defs, seen);
    case "App": return haltcheck(term[1].func, defs, seen) && (term[1].eras ? true : haltcheck(term[1].argm, defs, seen));
    case "Put": return haltcheck(term[1].expr, defs, seen);
    case "Dup": return haltcheck(term[1].expr, defs, seen) && haltcheck(term[1].body, defs, seen);
    case "Op1": return haltcheck(term[1].num0, defs, seen) && haltcheck(term[1].num1, defs, seen);
    case "Op2": return haltcheck(term[1].num0, defs, seen) && haltcheck(term[1].num1, defs, seen);
    case "Ite": return haltcheck(term[1].cond, defs, seen) && haltcheck(term[1].pair, defs, seen);
    case "Cpy": return haltcheck(term[1].numb, defs, seen) && haltcheck(term[1].body, defs, seen);
    case "Par": return (term[1].eras === 1 ? true : haltcheck(term[1].val0, defs, seen)) && (term[1].eras === 2 ? true : haltcheck(term[1].val1, defs, seen));
    case "Fst": return haltcheck(term[1].pair, defs, seen);
    case "Snd": return haltcheck(term[1].pair, defs, seen);
    case "Prj": return haltcheck(term[1].pair, defs, seen) && haltcheck(term[1].body, defs, seen);
    case "Ann": return haltcheck(term[1].expr, defs, seen);
    case "New": return haltcheck(term[1].expr, defs, seen);
    case "Use": return haltcheck(term[1].expr, defs, seen);
    case "Log": return haltcheck(term[1].expr, defs, seen);
    case "Ref":
      if (seen[term[1].name]) {
        return false;
      } else {
        return haltcheck(defs[term[1].name], defs, {...seen, [term[1].name]: true});
      }
    default: return true;
  }
};

module.exports = {
  Var, Typ, Tid, Utt, Utv, Ute, All, Lam,
  App, Box, Put, Tak, Dup, Num, Val, Op1,
  Op2, Ite, Cpy, Sig, Par, Fst, Snd, Prj,
  Slf, New, Use, Ann, Log, Hol, Ref,
  equal,
  erase,
  reduce,
  shift,
  subst,
  subst_many,
  typecheck,
  haltcheck,
};


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-error.js":
/*!*****************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-error.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function marked_code(loc) {
  var text = "";
  var idx = 0;
  var lines = loc.code.split("\n");
  var from_line = Math.max(loc.row - 4, 0);
  var to_line = Math.min(loc.row + 4, lines.length - 1);
  for (var line = 0; line < lines.length; ++line) {
    var write = line >= from_line && line <= to_line;
    if (write) text += "\x1b[2m" + ("    " + (line + 1)).slice(-4) + "| \x1b[0m";
    for (var i = 0; i < lines[line].length; ++i) {
      if (idx >= loc.idx && idx < loc.idx + loc.len) {
        if (write) text += "\x1b[31m\x1b[4m" + lines[line][i] + "\x1b[0m";
        idx += 1;
      } else {
        if (write) text += "\x1b[2m" + lines[line][i] + "\x1b[0m";
        idx += 1;
      }
    }
    if (write) text += "\n";
    idx += 1;
  }
  return text;
}

function random_excuse() {
  var excuses = [
    "My parse-robot brain isn't perfect, sorry.",
    "What? If you can't get this right, don't expect me to!",
    "I'm doing my best, ok?",
    "I hope you figure it out!",
    "I can't help any further. But I can pray for you!",
    "I with I could be more precise...",
    "Hey, at least I'm showing a location.",
    "Why programming needs to be so hard?",
    "I hope this doesn't affect your deadlines!",
    "If this is hard, consider relaxing. You deserve it!",
    "It takes me some time to process things. Have patience with me!"
  ];
  return excuses[Math.floor(Math.random() * excuses.length)];
}

module.exports = {marked_code, random_excuse};


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-json.js":
/*!****************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-json.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const lang = __webpack_require__(/*! ./fm-lang */ "./node_modules/formality-lang/src/fm-lang.js");
const to_js = __webpack_require__(/*! ./fm-to-js */ "./node_modules/formality-lang/src/fm-to-js.js");
const core = __webpack_require__(/*! ./fm-core */ "./node_modules/formality-lang/src/fm-core.js");

// For now, we are converting the terms from and to JS-compiled Formality
// In the future we may convert from and to directly the Formality Core AST
const to = (val) => to_js.decompile(json.to(val));
const from = (term) => json.from(to_js.compile(term));

const call = (term_or_name, defs, argument, opts = {}) => {
  const term =
    typeof term_or_name === 'string'
      ? defs[term_or_name] || Ref(term_or_name)
      : term_or_name;

  lang.typecheck(term, json_to_json_type_term, defs);

  const argument_term = to(argument);
  const default_reducer = term => lang.run("OPTIMAL", term, {defs});
  const reducer = opts.reducer || default_reducer;
  const app_term = lang.App(term, argument_term, false);
  return from(reducer(app_term));
}

// A Mapper is responsible for mapping between JS and Formality types.
// It's basically two functions, to and from. To converts from JS to FormalityJS and from does the
// other way around.
// Some mappers are polymorphic (for polymorphic types, for example). Here they are represented as
// functions which return mappers.

const word = {
  to: (x) => x,
  from: (x) => x
}

const js_number = {
  to: (val) => (js_number) => js_number(val),
  from: (enc) => enc
}

const list = (type) => ({
  to: (val) => (nil) => (cons) => val.length == 0 ? nil : cons(type.to(val[0]))(list(type).to(val.slice(1))),
  from: (val) => {
    const cons = (head) => (tail) => [type.from(head)].concat(list(type).from(tail));
    const nil = [];
    return val(nil)(cons);
  }
})

const string = {
  to: (str) => {
    var nums = [];
    for (var i = 0; i < str.length; ++i) {
      nums.push(str.charCodeAt(i));
    }
    return list(word).to(nums);
  },
  from: (enc) => {
    const nums = list(word).from(enc);
    var str = "";
    for (var i = 0; i < nums.length; ++i) {
      str += String.fromCharCode(nums[i]);
    }
    return str;
  }
}

const pair = (tfst, tsnd) => ({
  to: ([fst, snd]) => [tfst.to(fst), tsnd.to(snd)],
  from: ([fst, snd]) => [tfst.from(fst), tsnd.from(snd)]
})

// This is the main mapper of this module, which enables converting almost all JS objects
const json = {
  to: (val) => (j_null) => (j_number) => (j_string) => (j_list) => (j_object) => {
    if(val === null) {
      return j_null;
    } else if(typeof val === "number") {
      return j_number(js_number.to(val));
    } else if(typeof val === "string") {
      return j_string(string.to(val));
    } else if (Array.isArray(val)) {
      return j_list(list(json).to(val));
    } else {
      return j_object(list(pair(string, json)).to(obj_to_kw(val)));
    }
  },
  from: (enc) => {
    const j_null = null;
    const j_number = js_number.from;
    const j_string = string.from;
    const j_list = list(json).from;
    const j_object = (o) => kw_to_obj(list(pair(string, json)).from(o));
    return enc(j_null)(j_number)(j_string)(j_list)(j_object);
  }
}

// Object to keyword list conversion
const obj_to_kw = (obj) => Object.keys(obj).map((key) => [key.toString(), obj[key]]);
const kw_to_obj = (kw) => kw.reduce((obj, [k, v]) => ({[k]: v, ...obj}), {});

module.exports = { to, from, native_to: json.to, native_from: json.from, call };


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-lang.js":
/*!****************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-lang.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// WARNING: here shall be dragons!
// This is the parser for Formality-Lang. This is NOT fm-core, which is meant
// to be small, elegant and portable. Instead, it is our user-facing language,
// which is meant to be big and fully-featured, including several syntax-sugars
// meant to make programming easier. As such, this file is complex and involves
// hard transformations of terms, Bruijn-index shifts, crazy parsing flows.
// You've been warned (:

const {
  Var, Typ, Tid, Utt, Utv, Ute, All, Lam,
  App, Box, Put, Tak, Dup, Num, Val, Op1,
  Op2, Ite, Cpy, Sig, Par, Fst, Snd, Prj,
  Slf, New, Use, Ann, Log, Hol, Ref,
  reduce: core_reduce,
  typecheck: core_typecheck,
  haltcheck,
  ctx_ext,
  ctx_get,
  ctx_names,
  ctx_new,
  ctx_str,
  equal,
  erase,
  shift,
  subst,
  subst_many,
} = __webpack_require__(/*! ./fm-core.js */ "./node_modules/formality-lang/src/fm-core.js");

const version = __webpack_require__(/*! ./../package.json */ "./node_modules/formality-lang/package.json").version;
const to_net = __webpack_require__(/*! ./fm-to-net.js */ "./node_modules/formality-lang/src/fm-to-net.js");
const to_js = __webpack_require__(/*! ./fm-to-js.js */ "./node_modules/formality-lang/src/fm-to-js.js");
const net = __webpack_require__(/*! ./fm-net.js */ "./node_modules/formality-lang/src/fm-net.js");
const {load_file} = __webpack_require__(/*! ./forall.js */ "./node_modules/formality-lang/src/forall.js");
const {marked_code, random_excuse} = __webpack_require__(/*! ./fm-error.js */ "./node_modules/formality-lang/src/fm-error.js");

// :::::::::::::::::::::
// :: Stringification ::
// :::::::::::::::::::::

// Converts a term to a string
const show = ([ctor, args], nams = [], opts = {}) => {
  const print_output = (term) => {
    try {
      if (term[1].val0[1].numb === 0x53484f57) {
        term = term[1].val1;
        var nums = [];
        while (term[1].body[1].body[0] !== "Var") {
          term = term[1].body[1].body;
          nums.push(term[1].func[1].argm[1].numb);
          term = term[1].argm;
        }
        var str = "";
        for (var i = 0; i < nums.length; ++i) {
          str += String.fromCharCode(nums[i]);
        }
        return str;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  switch (ctor) {
    case "Var":
      var name = nams[nams.length - args.index - 1];
      if (!name) {
        return "^" + args.index;
      } else {
        var suff = "";
        for (var i = 0; i < args.index; ++i) {
          if (nams[nams.length - i - 1] === name) {
            var suff = suff + "^";
          }
        }
        return name + suff;
      }
    case "Typ":
      return "Type";
    case "Tid":
      var expr = show(args.expr, nams, opts);
      return "&" + expr;
    case "Utt":
      var expr = show(args.expr, nams, opts);
      return "-" + expr;
    case "Utv":
      var expr = show(args.expr, nams, opts);
      return "%" + expr;
    case "Ute":
      var expr = show(args.expr, nams, opts);
      return "+" + expr;
    case "All":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "All") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(show(term[1].bind, nams.concat(names.slice(0,-1)), opts));
        term = term[1].body;
      }
      var text = "(";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + (names[i].length > 0 ? " : " : ":") + types[i];
        text += i < names.length - 1 ? ", " : "";
      }
      text += ") -> ";
      text += show(term, nams.concat(names), opts);
      return text;
    case "Lam":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "Lam") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(term[1].bind && term[1].bind[0] !== "Hol" ? show(term[1].bind, nams.concat(names.slice(0,-1)), opts) : null);
        term = term[1].body;
      }
      var text = "(";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + (types[i] !== null ? " : " + types[i] : "");
        text += i < names.length - 1 ? ", " : "";
      }
      text += ") => ";
      text += show(term, nams.concat(names), opts);
      return text;
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = (term[1].func[0] === "App" ? ", " : "")
             + (term[1].eras ? "~" : "")
             + show(term[1].argm, nams, opts)
             + text;
        term = term[1].func;
      }
      if (term[0] === "Ref" || term[0] === "Var" || term[0] === "Tak") {
        var func = show(term, nams, opts);
      } else {
        var func = "(" + show(term,nams, opts) + ")";
      }
      return func + "(" + text;
    case "Box":
      var expr = show(args.expr, nams, opts);
      return "!" + expr;
    case "Put":
      var expr = show(args.expr, nams, opts);
      return "#" + expr;
    case "Tak":
      var expr = show(args.expr, nams, opts);
      return "$" + expr;
    case "Dup":
      var name = args.name;
      var expr = show(args.expr, nams, opts);
      if (args.body[0] === "Var" && args.body[1].index === 0) {
        return "$" + expr;
      } else {
        var body = show(args.body, nams.concat([name]), opts);
        return "dup " + name + " = " + expr + "; " + body;
      }
    case "Num":
      return "Number";
    case "Val":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, nams, opts);
      var num1 = show(args.num1, nams, opts);
      return num0 + " " + func + " " + num1;
    case "Ite":
      var cond = show(args.cond, nams, opts);
      var pair = show(args.pair, nams, opts);
      return "if " + cond + " " + pair;
    case "Cpy":
      var name = args.name;
      var numb = show(args.numb, nams, opts);
      var body = show(args.body, nams.concat([name]), opts);
      return "cpy " + name + " = " + numb + "; " + body;
    case "Sig":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "Sig") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(show(term[1].typ0, nams.concat(names.slice(0,-1)), opts));
        term = term[1].typ1;
      }
      var text = "[";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] === 1 ? "~" : "";
        text += names[i] + " : " + types[i];
        text += erase[i] === 2 ? " ~ " : ", ";
      }
      text += show(term, nams.concat(names), opts);
      text += "]";
      return text;
    case "Par":
      var output;
      var term  = [ctor, args];
      var erase = [];
      var terms = [];
      while (term[0] === "Par") {
        if (output = print_output(term)) {
          break;
        } else {
          erase.push(term[1].eras);
          terms.push(show(term[1].val0, nams, opts));
          term = term[1].val1;
        }
      }
      if (terms.length > 0) {
        var text = "[";
      } else {
        var text = "";
      }
      for (var i = 0; i < terms.length; ++i) {
        text += erase[i] === 1 ? "~" : "";
        text += terms[i];
        text += erase[i] === 2 ? " ~ " : ", ";
      }
      if (output) {
        text += output;
      } else {
        text += show(term, nams, opts);
      }
      if (terms.length > 0) {
        text += "]";
      }
      return text;
    case "Fst":
      var pair = show(args.pair, nams, opts);
      switch (args.eras) {
        case 0: return "fst(" + pair + ")";
        case 1: return "~fst(" + pair + ")";
        case 2: return "fst~(" + pair + ")";
        case 3: return "~fst~(" + pair + ")";
      }
    case "Snd":
      var pair = show(args.pair, nams, opts);
      switch (args.eras) {
        case 0: return "snd(" + pair + ")";
        case 1: return "~snd(" + pair + ")";
        case 2: return "snd~(" + pair + ")";
        case 3: return "~snd~(" + pair + ")";
      }
    case "Prj":
      var nam0 = args.nam0;
      var nam1 = args.nam1;
      var pair = show(args.pair, nams, opts);
      var body = show(args.body, nams.concat([nam0, nam1]), opts);
      var era1 = args.eras === 1 ? "~" : "";
      var era2 = args.eras === 2 ? "~" : "";
      return "get [" + era1 + nam0 + "," + era2 + nam1 + "] = " + pair + "; " + body;
    case "Slf":
      var name = args.name;
      var type = show(args.type, nams.concat([name]), opts);
      return "${" + name + "} " + type;
    case "New":
      var type = show(args.type, nams, opts);
      var expr = show(args.expr, nams, opts);
      return "new(~" + type + ") " + expr;
    case "Use":
      var expr = show(args.expr, nams, opts);
      return "use(" + expr + ")";
    case "Ann":
      var expr = show(args.expr, nams, opts);
      return expr;
    case "Log":
      var expr = show(args.expr, nams, opts);
      return expr;
    case "Hol":
      return "?" + args.name;
    case "Ref":
      return !opts.full_refs ? args.name.replace(new RegExp(".*/", "g"), "") : args.name;
  }
};

// :::::::::::::
// :: Parsing ::
// :::::::::::::

// Converts a string to a term
const parse = async (code, opts, root = true, loaded = {}) => {
  const file = opts.file || "main";
  const loader = opts.loader || load_file;
  const tokenify = opts.tokenify;

  // Imports a local/global file, merging its definitions
  async function do_import(import_file) {
    if (import_file.indexOf("@") === -1) {
      local_imports[import_file] = true;
    }
    if (!loaded[import_file]) {
      try {
        var file_code = await loader(import_file);
        loaded[import_file] = await parse(file_code, {file: import_file, tokenify, loader}, false, loaded);
      } catch (e) {
        throw e;
      }
    }
    var {defs: file_defs
      , adts: file_adts
      , open_imports: file_open_imports
      } = loaded[import_file];
    for (let term_path in file_defs) {
      defs[term_path] = file_defs[term_path];
    }
    for (let term_path in file_adts) {
      adts[term_path] = file_adts[term_path];
    }
    for (let open_import in file_open_imports) {
      open_imports[open_import] = true;
    }
    return true;
  }

  // Finds all imports with a given name
  function find_name_in_imports(name) {
    var found = [];
    for (var open_import in open_imports) {
      if (defs[open_import + "/" + name]) {
        found.push(open_import + "/" + name);
      }
    }
    return found;
  }

  // Returns current location
  function loc(len = 1) {
    return {idx: idx - len, col, row, len, file, code};
  }

  // Attempts to resolve a name into a full path
  function ref_path(str) {
    var result = (function () {
      if (str.indexOf("/") === -1) {
        var [str_file, str_name] = [null, str];
      } else {
        var [str_file, str_name] = str.split("/");
      }
      // If the reference includes the file...
      if (str_file) {
        // If it points to a qualified import, expand it
        if (qual_imports[str_file]) {
          return qual_imports[str_file] + "/" + str_name;
        // Otherwise, return an undefined reference, as written
        } else {
          return str_file + "/" + str_name;
        }
      // Otherwise, if the reference is missing the file...
      } else {
        // If there is a local definition with that name, point to it
        if (defs[file + "/" + str_name]) {
          return file + "/" + str_name;
        }
        // Otherwise, if there are many defs with that name, it is ambiguous
        var found = find_name_in_imports(str_name);
        if (found.length > 1) {
          var err_str = "Ambiguous reference: '" + str + "' could refer to:";
          for (var i = 0; i < found.length; ++i) {
            err_str += "\n- " + found[i];
          }
          err_str += "\nType its full name to prevent this error.";
          error(err_str);
        }
        // Otherwise, if there is exactly 1 open def with that name, point to it
        if (found.length === 1) {
          return found[0];
        }
      }
      // Otherwise, return an undefined reference to hte same file
      return file + "/" + str_name;
    })();
    return result;
  }

  // Makes a ref given a name
  function ref(str) {
    return Ref(ref_path(str), false, loc(str.length));
  }

  // Attempts to make a `ref` to a known base-lib term
  function base_ref(str) {
    var path = ref_path(str);
    if (defs[path]) {
      return Ref(path, false, loc(str.length));
    } else {
      error("Attempted to use a syntax-sugar which requires `" + str + "` to be in scope, but it isn't.\n"
          + "To solve that, add `import Base@0` to the start of your file.\n"
          + "See http://docs.formality-lang.org/en/latest/language/Hello,-world!.html for more info.");
    }
  }

  // Defines a top-level term
  function define(path, term) {
    if (root) {
      var name = path.replace(new RegExp("^[\\w.]*\/"), "");
      var found = find_name_in_imports(name);
      if (found.length > 0 || defs[ref_path(name)]) {
        var err_str = "Attempted to re-define '" + name + "', which is already defined";
        if (found.length > 0) {
          err_str += " as:";
          for (var i = 0; i < found.length; ++i) {
            err_str += "\n- " + found[i];
          }
        } else {
          err_str += " on this file.";
        }
        error(err_str);
      }
    }
    defs[path] = term;
  }

  // Creates a new hole name
  function new_hole_name() {
    return "h" + (hole_count++);
  }

  // Builds a lookup table
  function build_charset(chars) {
    var set = {};
    for (var i = 0; i < chars.length; ++i) {
      set[chars[i]] = 1;
    }
    return chr => set[chr] === 1;
  }

  // Some handy lookup tables
  const is_native_op =
    { ".+."   : 1
    , ".-."   : 1
    , ".*."   : 1
    , "./."   : 1
    , ".%."   : 1
    , ".**."  : 1
    , ".&."   : 1
    , ".|."   : 1
    , ".^."   : 1
    , ".~."   : 1
    , ".>>>." : 1
    , ".<<."  : 1
    , ".>."   : 1
    , ".<."   : 1
    , ".==."  : 1
  };

  const op_inits     = [".", "=", "->"];
  const is_op_init   = str => { for (var k of op_inits) if (str === k || str[0] === k) return str; return null; };
  const is_num_char  = build_charset("0123456789");
  const is_name_char = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@/");
  const is_op_char   = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@+*/%^!<>=&|");
  const is_spacy     = build_charset(" \t\n\r;");
  const is_space     = build_charset(" ");
  const is_newline   = build_charset("\n");

  // Advances the cursor 1 step forward
  function next() {
    if (tokens) {
      tokens[tokens.length - 1][1] += code[idx] || "";
    }
    if (is_newline(code[idx])) {
      row += 1;
      col = 0;
    } else {
      col += 1;
    }
    idx += 1;
  }

  // Advances the cursor until it finds a parseable char, skipping spaces and comments
  function next_char(is_space = is_spacy) {
    skip_spaces(is_space);
    var head = code.slice(idx, idx + 2);
    // Skips comments
    while (head === "//" || head === "--" || head === "/*" || head === "{-") {
      // Single-line comments
      if (head === "//" || head === "--") {
        if (tokens) tokens.push(["cmm", ""]);
        while (code[idx] !== "\n" && idx < code.length) {
          next();
        }
        next();
      // Multi-line comments (docs)
      } else {
        if (tokens) tokens.push(["doc", ""]);
        while (code.slice(idx, idx + 2) !== "*/" && code.slice(idx, idx + 2) !== "-}" && idx < code.length) {
          next();
        }
        next();
        next();
      }
      if (tokens) tokens.push(["txt", ""]);
      skip_spaces(is_space);
      var head = code.slice(idx, idx + 2);
    }
  }

  // Skips space chars
  function skip_spaces(is_space = is_spacy) {
    while (idx < code.length && is_space(code[idx])) {
      next();
    }
  }

  // Attempts to match a specific string
  function match_here(string) {
    if (code.slice(idx, idx + 2) === "//" || code.slice(idx, idx + 2) === "--") {
      return false;
    } else {
      var sliced = code.slice(idx, idx + string.length);
      if (sliced === string) {
        if (tokens) tokens.push(["sym", ""]);
        for (var i = 0; i < string.length; ++i) {
          next();
        }
        if (tokens) tokens.push(["txt", ""]);
        return true;
      }
      return false;
    }
  }

  // Skips spaces, calls `match_here`
  function match(string, is_space = is_spacy) {
    next_char(is_space);
    return match_here(string);
  }

  // Attempts to match a character that is a valid operator initiator
  function match_op_init(is_space = is_spacy) {
    for (var i = 0; i < op_inits.length; ++i) {
      var op_init = op_inits[i];
      if (match(op_init, is_space)) {
        return op_init;
      }
    };
    return null;
  };

  // Throws a parse error at this location
  function error(error_message) {
    var part = "";
    var text = "";
    text += "[PARSE-ERROR]\n";
    text += error_message;
    text += "\n\nI noticed the problem on line " + (row+1) + ", col " + col + ", file \x1b[4m" + file + ".fm\x1b[0m:\n\n";
    text += marked_code(loc());
    text += "\nBut it could have happened a little earlier.\n";
    text += random_excuse();
    throw text;
  }

  // Constructs an Ind
  function build_ind(name) {
    if (!defs[name+"i"]) {
      var numb = name === "" ? Math.pow(2,48) - 1 : Number(name);
      var bits = numb.toString(2);
      var bits = bits === "0" ? "" : bits;
      var term = base_ref("base");
      for (var i = 0; i < bits.length; ++i) {
        term = App(base_ref("twice"), term, false);
        if (bits[i] === "1") {
          term = App(base_ref("step"), term, false);
        }
      }
      define(name+"i", term);
    }
    return Ref(name+"i", false, loc(name.length + 1));
  }

  // Constructs a nat
  function build_nat(name) {
    if (!defs[name+"n"]) {
      var term = base_ref("zero");
      var numb = Number(name);
      for (var i = 0; i < numb; ++i) {
        term = App(base_ref("succ"), term, false);
      }
      define(name+"n", term);
    }
    return Ref(name+"n", false, loc(name.length + 1));
  }

  // Constructs a nat
  function build_nat(name) {
    if (!defs["n"+name]) {
      var term = base_ref("zero");
      var numb = Number(name);
      for (var i = 0; i < numb; ++i) {
        term = App(base_ref("succ"), term, false);
      }
      define("n"+name, term);
    }
    return Ref("n"+name, false, loc(name.length + 1));
  }

  // Parses an exact string, errors if it isn't there
  function parse_exact(string) {
    if (!match(string)) {
      var text = "";
      var part = "";
      error("Expected '" + string + "', but found '" + (code[idx] || "(end of file)") + "' instead.");
    }
  }

  // Parses characters until `fn` is false
  function parse_string_here(fn = is_name_char) {
    var name = "";
    while (idx < code.length && fn(code[idx])) {
      name = name + code[idx];
      next();
    }
    return name;
  }

  // Skips spaces and calls parse_string_here
  function parse_string(fn = is_name_char) {
    next_char();
    return parse_string_here(fn);
  }

  // Parses an alphanumeric name
  function parse_name() {
    var op_init = null;
    if (op_init = is_op_init(code[idx] + (code[idx+1] || " "))) {
      match(op_init);
      return op_init + parse_string_here(is_op_char);
    } else {
      return parse_string();
    }
  }

  // Parses a term that demands a name
  function parse_named_term(nams) {
    // Parses matched term
    var term = parse_term(nams);

    // If no name given, attempts to infer it from term
    if (match("as")) {
      var name = parse_string();
    } else if (term[0] === "Var" && term[1].__name) {
      var name = term[1].__name;
    } else {
      var name = "self";
      //error("The term \x1b[2m" + show(term, nams) + "\x1b[0m requires an explicit name.\n"
          //+ "Provide it with the 'as' keyword. Example: \x1b[2m" + show(term, nams) + " as x\x1b[0m");
    }

    return [name, term]
  }

  // Parses a number, variable, inline operator or reference
  function parse_atom(nams) {
    var term = null;
    if (tokens) tokens.push(["???", ""]);
    var name = parse_name();
    var last = name[name.length - 1];
    if (is_num_char(name[0])) {
      var numb = Number(is_num_char(last) ? name : name.slice(0, -1));
    } else {
      var numb = NaN;
    }
    if (name.length === 0) {
      next();
      error("Unexpected symbol.");
    }
    // Not a var but a number
    if (!isNaN(numb)) {
      if (last === "i") {
        var term = build_ind(name.slice(0,-1));
      } else if (last === "n") {
        var term = build_nat(name.slice(0,-1));
      } else {
        var term = Val(numb, loc(name.length));
      }
      if (tokens) tokens[tokens.length - 1][0] = "num";
    } else {
      // Parses bruijn index
      var skip = 0;
      while (match_here("^")) {
        skip += 1;
      }
      // Finds variable in context
      for (var i = nams.length - 1; i >= 0; --i) {
        if (nams[i] === name) {
          if (skip === 0) break;
          else skip -= 1;
        }
      }
      // Variable
      if (i !== -1) {
        term = Var(nams.length - i - 1, loc(name.length));
        term[1].__name = name;
        if (tokens) tokens[tokens.length - 1][0] = "var";
      // Inline binary operator 
      } else if (is_native_op[name]) {
          term = Lam("x", Num(), Lam("y", Num(), Op2(name, Var(1), Var(0)), false), false);
          if (tokens) tokens[tokens.length - 1][0] = "nop";
      // Reference
      } else {
        term = Ref(ref_path(name), false, loc(name.length));
        if (tokens) {
          tokens[tokens.length - 1][0] = "ref";
          tokens[tokens.length - 1][2] = term[1].name;
        }
      }
    }
    if (tokens) tokens.push(["txt", ""]);
    return term;
  }

  // Parses a grouping parens, `(...)`
  function parse_parens(nams) {
    if (match("(")) {
      var term = parse_term(nams);
      var skip = parse_exact(")");
      return term;
    }
  }

  // Parses the type of types, `Type`
  function parse_typ(nams) {
    if (match("Type")) {
      return Typ(loc(4));
    }
  }

  // Parses a type-level identity, `~A`
  function parse_tid(nams) {
    var init = idx;
    if (match("&")) {
      var expr = parse_term(nams);
      return Tid(expr, loc(idx - init));
    }
  }

  // Parses an unrestricted type, `-A`
  function parse_utt(nams) {
    var init = idx;
    if (match("-")) {
      var expr = parse_term(nams);
      return Utt(expr, loc(idx - init));
    }
  }

  // Parses an unrestricted term, `%t`
  function parse_utv(nams) {
    var init = idx;
    if (match("%")) {
      var expr = parse_term(nams);
      return Utv(expr, loc(idx - init));
    }
  }

  // Parses an unrestricted elim, `+t`
  function parse_ute(nams) {
    var init = idx;
    if (match("+")) {
      var expr = parse_term(nams);
      return Ute(expr, loc(idx - init));
    }
  }

  // Parses the `?scope?` utility
  function parse_scope(nams) {
    if (match("?scope?")) {
      console.log("Scope:");
      for (var i = 0; i < nams.length; ++i) {
        console.log("- " + nams[i]);
      }
      return parse_term(nams);
    }
  }

  // Parses a hole, `?name`
  function parse_hol(nams) {
    var init = idx;
    if (match("?")) {
      var name = parse_string_here();
      if (name === "") {
        name = new_hole_name();
      }
      if (used_hole_name[name]) {
        error("Reused hole name: " + name);
      } else {
        used_hole_name[name] = true;
      }
      return Hol(name, loc(idx - init));
    }
  }

  // Parses a lambda `{x : A} t` or a forall `{x : A} -> B`
  function parse_lam_or_all(nams) {
    function is_lam_or_all() {
      // TODO: this is ugly, improve
      var i = idx;
      if (i < code.length && code[i] === "(")          { ++i; } // skips `(`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === "~")                             { ++i; } // skips `~`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === ":")                             { ++i; } // skips `:`
      if (code[i] === " ") return true;                         // found ` `
      if (code[i] === ",") return true;                         // found `,`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === ")")                             { ++i; } // skips `)`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === "=")                             { ++i; } // skips `=`
      if (code[i] === ">") return true;                         // finds `>`
      return false;
    }
    var init = idx;
    if (is_lam_or_all() && match("(")) {
      var erass = [];
      var names = [];
      var types = [];
      while (idx < code.length) {
        var eras = match("~");
        var name = parse_string();
        var type = match(":") ? parse_term(nams.concat(names)) : null;
        erass.push(eras);
        names.push(name);
        types.push(type);
        if (match(")")) break;
        else parse_exact(",");
      }
      var isall = match("->");
      if (!isall) {
        var skip = parse_exact("=>");
      }
      var parsed = parse_term(nams.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        if (isall) {
          parsed = All(names[i], types[i] || Typ(), parsed, erass[i], loc(idx - init));
        } else {
          parsed = Lam(names[i], types[i] || null, parsed, erass[i], loc(idx - init));
        }
      }
      return parsed;
    }
  }

  // Parses a duplication, `dup x = t; u`
  function parse_dup(nams) {
    var init = idx;
    if (match("dup ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var expr = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      return Dup(name, expr, body, loc(idx - init));
    }
  }

  // Parses a boxed type, `!A`
  function parse_box(nams) {
    var init = idx;
    if (match("!")) {
      var expr = parse_term(nams);
      return Box(expr, loc(idx - init));
    }
  }

  // Parses a boxed term, `#t`
  function parse_put(nams) {
    var init = idx;
    if (match("#")) {
      var expr = parse_term(nams);
      return Put(expr, loc(idx - init));
    }
  }

  // Parses an unboxing, `^t`
  function parse_tak(nams) {
    var init = idx;
    if (match("$")) {
      var expr = parse_term(nams);
      return Tak(expr, loc(idx - init));
    }
  }

  // Parses a let, `let x = t; u`
  function parse_let(nams) {
    if (match("let ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var copy = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      return subst(body, copy, 0);
    }
  }

  // Parses the type of numbers, `Number`
  function parse_wrd(nams) {
    if (match("Number")) {
      return Num(loc(4));
    }
  }

  // Parses a string literal, `"foo"`
  function parse_str(nams) {
    var init = idx;
    if (match("\"")) {
      // Parses text
      var text = "";
      while (idx < code.length && code[idx] !== "\"") {
        text += code[idx];
        next();
      }
      next();
      var nums = [];
      for (var i = 0; i < text.length; ++i) {
        nums.push(text.charCodeAt(i));
      }
      var term = App(base_ref("nil"), Num(), true);
      for (var i = nums.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), Num(), true), Val(nums[i]), false), term, false);
      }
      return Ann(base_ref("String"), term, false, loc(idx - init));
    }
  }

  // Parses a char literal, `'x'`
  function parse_chr(nams) {
    var init = idx;
    if (match("'")) {
      var name = parse_name();
      var skip = parse_exact("'");
      return Val(name.charCodeAt(0));
    }
  }

  // Parses an if-then-else, `if: t else: u`
  function parse_ite(nams) {
    var init = idx;
    if (match("if ")) {
      var cond = parse_term(nams);
      var skip = match("then:") || parse_exact(":");
      var val0 = parse_term(nams);
      var skip = parse_exact("else:");
      var val1 = parse_term(nams);
      return Ite(cond, Par(val0, val1, 0), loc(idx - init));
    }
  }

  // Parses a Number copy, `cpy x = t; u`
  function parse_cpy(nams) {
    var init = idx;
    if (match("cpy ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var numb = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      return Cpy(name, numb, body, loc(idx - init));
    }
  }

  // Parses a sigma, `[x : A, P(x)]`, or a pair, `[t, u]`
  function parse_sig_or_par(nams) {
    function is_sigma() {
      // TODO: this is ugly, improve
      var i = idx;
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === "~")                             { ++i; } // skips `~`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      return code[i] === ":";                                   // finds `:`
    }
    var init = idx;
    if (match("[")) {
      if (match("]")) {
        error("Empty pair.");
      }
      // Sigma
      if (is_sigma()) {
        var erass = [];
        var names = [];
        var types = [];
        while (idx < code.length && is_sigma()) {
          var era1 = match("~");
          var name = parse_string();
          var skip = parse_exact(":");
          var type = parse_term(nams.concat(names));
          var era2 = match("~");
          erass.push(era1 ? 1 : era2 ? 2 : 0);
          names.push(name);
          types.push(type);
          if (!era2) parse_exact(",");
        }
        var parsed = parse_term(nams.concat(names));
        var skip = parse_exact("]");
        for (var i = names.length - 1; i >= 0; --i) {
          var parsed = Sig(names[i], types[i], parsed, erass[i], loc(idx - init));
        }
      // Pair
      } else {
        var erass = [];
        var terms = [];
        while (idx < code.length) {
          var era1 = match("~");
          var term = parse_term(nams);
          var era2 = match("~");
          erass.push(era1 ? 1 : era2 ? 2 : 0);
          terms.push(term);
          if (match("]")) break;
          if (!era2) parse_exact(",");
        }
        var parsed = terms.pop();
        for (var i = terms.length - 1; i >= 0; --i) {
          var parsed = Par(terms[i], parsed, erass[i], loc(idx - init));
        }
      }
      return parsed;
    }
  }

  // Parses a fst accessor, `fst(t)`
  function parse_fst(nams) {
    var init = idx;
    if (match("fst(")) {
      var eras = 0;
    } else if (match("~fst(")) {
      var eras = 1;
    } else if (match("fst~(")) {
      var eras = 2;
    } else if (match("~fst~(")) {
      var eras = 3;
    } else {
      return;
    }
    var pair = parse_term(nams);
    var skip = parse_exact(")");
    return Fst(pair, eras, loc(idx - init));
  }

  // Parses a snd accessor, `snd(t)`
  function parse_snd(nams) {
    var init = idx;
    if (match("snd(")) {
      var eras = 0;
    } else if (match("~snd(")) {
      var eras = 1;
    } else if (match("snd~(")) {
      var eras = 2;
    } else if (match("~snd~(")) {
      var eras = 3;
    } else {
      return;
    }
    var pair = parse_term(nams);
    var skip = parse_exact(")");
    return Snd(pair, eras, loc(idx - init));
  }

  // Parses a projection, `get [x, y] = t`
  function parse_get(nams) {
    var init = idx;
    if (match("get ")) {
      var skip = parse_exact("[");
      var erass = [];
      var names = [];
      while (idx < code.length) {
        var era1 = match("~");
        var name = parse_string();
        var era2 = match("~");
        erass.push(era1 ? 1 : era2 ? 2 : 0);
        names.push(name);
        if (match("]")) break;
        if (!era2) parse_exact(",");
      }
      var skip = parse_exact("=");
      var pair = parse_term(nams);
      var parsed = parse_term(nams.concat(names));
      for (var i = names.length - 2; i >= 0; --i) {
        var nam1 = names[i];
        var nam2 = i === names.length - 2 ? names[i + 1] : "aux";
        var expr = i === 0 ? pair : Var(0);
        var body = i === 0 ? parsed : shift(parsed, 1, 2);
        var parsed = Prj(nam1, nam2, expr, body, erass[i], loc(idx - init));
      }
      return parsed;
    }
  }

  // Parses log, `log(t)`
  function parse_log(nams) {
    var init = idx;
    if (match("log(")) {
      var msge = parse_term(nams);
      var skip = parse_exact(")");
      var expr = parse_term(nams);
      return Log(msge, expr, loc(idx - init));
    }
  }

  // Parses a self type, `$x P(x)`
  function parse_slf(nams) {
    var init = idx;
    if (match("${")) {
      var name = parse_string();
      var skip = parse_exact("}");
      var type = parse_term(nams.concat([name]));
      return Slf(name, type, loc(idx - init));
    }
  }

  // Parses a self intro, `new(A) t`
  function parse_new(nams) {
    var init = idx;
    if (match("new(~")) {
      var type = parse_term(nams);
      var skip = parse_exact(")");
      var expr = parse_term(nams);
      return New(type, expr, loc(idx - init));
    }
  }

  // Parses a self elim, `%t`
  function parse_use(nams) {
    var init = idx;
    if (match("use(")) {
      var expr = parse_term(nams);
      var skip = parse_exact(")");
      return Use(expr, loc(idx - init));
    }
  }

  // Parses a case expression, `case/T | A => <term> | B => <term> : <term>`
  function parse_case(nams) {
    if (match("case ")) {
      // Attempts to parse this case expression with each ADTs in scope
      for (var adt_name in adts) {
        var parse_state = save_parse_state();

        try {
          // Parses matched name, if available
          var [term_name, term] = parse_named_term(nams);

          // Finds ADT
          if (!adt_name || !adts[ref_path(adt_name)]) {
            error("Used case-syntax on undefined type `" + (adt_name || "?") + "`.");
          }
          var {adt_name, adt_pram, adt_indx, adt_ctor} = adts[ref_path(adt_name)];

          // Parses 'move' expressions
          var moves = [];
          while (match("+")) {
            var move_init = idx;
            var [move_name, move_term] = parse_named_term(nams);
            var move_skip = parse_exact(":");
            var move_type = parse_term(nams
              .concat(adt_indx.map(([name,type]) => term_name + "." + name))
              .concat([term_name])
              .concat(moves.map(([name,term,type]) => name)));
            moves.push([move_name, move_term, move_type, loc(idx - init)]);
          }

          // Parses matched cases
          var case_term = [];
          var case_loc  = [];
          for (var c = 0; c < adt_ctor.length; ++c) {
            var init = idx;
            try {
              var skip = parse_exact("|");
              var skip = parse_exact(adt_ctor[c][0]);
              var skip = parse_exact("=>");
            } catch (e) {
              throw "WRONG_ADT";
            }
            var ctors = adt_ctor[c][1];
            case_term[c] = parse_term(nams
              .concat(adt_ctor[c][1].map(([name,type]) => term_name + "." + name))
              .concat(moves.map(([name,term,type]) => name)));
            for (var i = moves.length - 1; i >= 0; --i) {
              case_term[c] = Lam(moves[i][0], null, case_term[c], false);
            }
            for (var i = 0; i < ctors.length; ++i) {
              case_term[c] = Lam(term_name + "." + ctors[ctors.length - i - 1][0], null, case_term[c], ctors[ctors.length - i - 1][2]);
            }
            case_loc[c] = loc(idx - init);
          }

          // Parses matched motive
          var moti_init = idx;
          try {
            var moti_skip = parse_exact(":");
          } catch (e) {
            throw "WRONG_ADT";
          }
          var moti_term = parse_term(nams
            .concat(adt_indx.map(([name,type]) => term_name + "." + name))
            .concat([term_name])
            .concat(moves.map(([name,term,type]) => name)));
          var moti_loc = loc(idx - moti_init);
          for (var i = moves.length - 1; i >= 0; --i) {
            var moti_term = All(moves[i][0], moves[i][2], moti_term, false, moves[i][3]);
          }
          var moti_term = Tid(moti_term, moti_loc);
          var moti_term = Lam(term_name, null, moti_term, false, moti_loc);
          for (var i = adt_indx.length - 1; i >= 0; --i) {
            var moti_term = Lam(term_name + "." + adt_indx[i][0], null, moti_term, false, moti_loc);
          }

          // Builds the matched term using self-elim ("Use")
          var targ = term;
          var term = Use(term);
          var term = App(term, moti_term, true, moti_loc);
          for (var i = 0; i < case_term.length; ++i) {
            var term = App(term, case_term[i], false, case_loc[i]);
          }
          for (var i = 0; i < moves.length; ++i) {
            var term = App(term, moves[i][1], false, moves[i][3]);
          }

          return term;
        } catch (e) {
          if (e !== "WRONG_ADT") {
            throw e;
          } else {
            load_parse_state(parse_state);
          }
        }
      }
      // If no ADT matches this pattern-match, raise error
      error("Couldn't find the ADT for this pattern-match.\n"
          + "Make sure the cases have the correct name and order.");
    }
  }

  // Parses a Number bitwise-not, `.!.(t)`
  function parse_op2_not(nams) {
    var init = idx;
    if (match(".!.(")) {
      var argm = parse_term(nams);
      var skip = parse_exact(")");
      return Op2(".!.", Val(0), argm, loc(idx - init));
    }
  }

  // Parses an application, `f(x, y, z...)`
  function parse_app(parsed, init, nams) {
    if (match("(", is_space)) {
      var term = parsed;
      while (idx < code.length) {
        if (match("_")) {
          var term = App(term, Hol(new_hole_name()), true, loc(idx - init));
          if (match(")")) break;
        } else {
          var eras = match("~");
          var argm = parse_term(nams);
          var term = App(term, argm, eras, loc(idx - init));
          if (match(")")) break;
          parse_exact(",");
        }
      }
      return term;
    }
  }

  // Parses a list literal, `A$[t, u, v, ...]`
  function parse_list_literal(nams) {
    var init = idx;
    if (match("<", is_space)) {
      var type = parse_term(nams);
      var skip = parse_exact(">");
      var list = [];
      var skip = parse_exact("[");
      while (idx < code.length && !match("]")) {
        list.push(parse_term(nams));
        if (match("]")) break; else parse_exact(",");
      }
      var term = App(base_ref("nil"), type, true, loc(idx - init));
      for (var i = list.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false, loc(idx - init));
      }
      return term;
    }
  }

  // Parses an annotation `t :: T`
  function parse_ann(parsed, init, nams) {
    if (match("::", is_space)) {
      //if (match("Type")) {
        //return Tid(parsed);
      //} else {
        var type = parse_term(nams);
        return Ann(type, parsed, false, loc(idx - init));
      //}
    }
  }

  // Parses operators, including:
  // - Numeric operators: `t .+. u`, `t .*. u`, etc.
  // - Arrow notation: `A -> B`
  // - User-defined operators: `t .foo. u`
  function parse_ops(parsed, init, nams) {
    var matched_op_init = null;
    if (matched_op_init = match_op_init(is_space)) {
      if (tokens) tokens.pop();
      var func = matched_op_init + parse_string_here(x => !is_space(x));
      if (tokens) tokens.push(["txt", ""]);
      var argm = parse_term(nams);
      if (is_native_op[func]) {
        return Op2(func, parsed, argm, loc(idx - init));
      } else if (func === "->") {
        return All("", parsed, shift(argm, 1, 0), false, loc(idx - init));
      } else {
        return App(App(ref(func), parsed, false), argm, false, loc(idx - init));
      }
    }
  }

  // Parses a free variable
  function parse_var(nams) {
    var init = idx;
    if (match("^")) {
      var idx = Number(parse_name());
      return Var(idx, loc(idx - init));
    }
  }

  // Parses a term
  function parse_term(nams) {
    var parsed;

    skip_spaces();
    var init = idx;

    // Parses base term
    if (parsed = parse_lam_or_all(nams));
    else if (parsed = parse_parens(nams));
    else if (parsed = parse_typ(nams));
    else if (parsed = parse_tid(nams));
    else if (parsed = parse_slf(nams));
    else if (parsed = parse_new(nams));
    else if (parsed = parse_use(nams));
    else if (parsed = parse_scope(nams));
    else if (parsed = parse_hol(nams));
    else if (parsed = parse_dup(nams));
    else if (parsed = parse_box(nams));
    else if (parsed = parse_put(nams));
    else if (parsed = parse_tak(nams));
    else if (parsed = parse_let(nams));
    else if (parsed = parse_wrd(nams));
    else if (parsed = parse_str(nams));
    else if (parsed = parse_chr(nams));
    else if (parsed = parse_ite(nams));
    else if (parsed = parse_cpy(nams));
    else if (parsed = parse_sig_or_par(nams));
    else if (parsed = parse_fst(nams));
    else if (parsed = parse_snd(nams));
    else if (parsed = parse_get(nams));
    else if (parsed = parse_utt(nams));
    else if (parsed = parse_utv(nams));
    else if (parsed = parse_ute(nams));
    else if (parsed = parse_log(nams));
    else if (parsed = parse_case(nams));
    else if (parsed = parse_op2_not(nams));
    else if (parsed = parse_var(nams));
    else if (parsed = parse_list_literal(nams));
    else     parsed = parse_atom(nams);

    // Parses spaced operators
    var new_parsed = true;
    while (new_parsed) {
      if      (new_parsed = parse_app(parsed, init, nams));
      else if (new_parsed = parse_ann(parsed, init, nams));
      else if (new_parsed = parse_ops(parsed, init, nams));
      if (new_parsed) {
        parsed = new_parsed;
      }
    }

    return parsed;
  }

  // Parses a top-level import
  async function do_parse_import() {
    if (match("import ")) {
      if (tokens) tokens.push(["imp", ""]);
      var impf = parse_string();
      if (tokens) tokens.push(["txt", ""]);
      var qual = match("as") ? parse_string() : null;
      var open = match("open");
      if (open) {
        error("The `open` keyword is obsolete. Remove it.");
      }
      if (qual) qual_imports[qual] = impf;
      qual_imports[impf] = impf;
      open_imports[impf] = true;
      await do_import(impf);
      return true;
    }
  }

  // Parses a top-level datatype:
  // T name {param0 : A, ...} (index0 : B, ...)
  // | ctor0 {field0 : C, ...} (index0, ...)
  // | ctor1 {field0 : C, ...} (index0, ...)
  async function do_parse_datatype() {
    if (match("T ")) {
      var adt_pram = [];
      var adt_indx = [];
      var adt_ctor = [];
      var adt_name = parse_string();
      var adt_nams = [adt_name];
      var adt_typs = [null];

      // Datatype parameters
      if (match("<")) {
        while (idx < code.length) {
          var eras = false;
          var name = parse_string();
          if (match(":")) {
            var type = await parse_term(adt_pram.map((([name,type]) => name)));
          } else {
            var type = Typ();
          }
          adt_pram.push([name, type, eras]);
          if (match(">")) break;
          else parse_exact(",");
        }
      }

      // Datatype indices
      var adt_nams = adt_nams.concat(adt_pram.map(([name,type]) => name));
      var adt_typs = adt_typs.concat(adt_pram.map(([name,type]) => type));
      if (match("(")) {
        while (idx < code.length) {
          //var eras = match("~");
          var eras = false;
          var name = parse_string();
          if (match(":")) {
            var type = await parse_term(adt_nams.concat(adt_indx.map((([name,type]) => name))));
          } else {
            var type = Hol(new_hole_name());
          }
          adt_indx.push([name, type, eras]);
          if (match(")")) break; else parse_exact(",");
        }
      }

      // Datatype constructors
      while (match("|")) {
        // Constructor name
        var ctor_name = parse_string();
        // Constructor fields
        var ctor_flds = [];
        if (match("(")) {
          while (idx < code.length) {
            var eras = match("~");
            var name = parse_string();
            if (match(":")) {
              var type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
            } else {
              var type = Hol(new_hole_name());
            }
            ctor_flds.push([name, type, eras]);
            if (match(")")) break; else parse_exact(",");
          }
        }
        // Constructor type (written)
        if (match(":")) {
          var ctor_type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
        // Constructor type (auto-filled)
        } else {
          var ctor_indx = [];
          //if (match("(")) {
            //while (idx < code.length) {
              //ctor_indx.push(await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name))));
              //if (match(")")) break; else parse_exact(",");
            //}
          //}
          var ctor_type = Var(-1 + ctor_flds.length + adt_pram.length + 1);
          for (var p = 0; p < adt_pram.length; ++p) {
            ctor_type = App(ctor_type, Var(-1 + ctor_flds.length + adt_pram.length - p), false);
          }
          for (var i = 0; i < ctor_indx.length; ++i) {
            ctor_type = App(ctor_type, ctor_indx[i], false);
          }
        }
        adt_ctor.push([ctor_name, ctor_flds, ctor_type]);
      }
      var adt = {adt_pram, adt_indx, adt_ctor, adt_name};
      define(file+"/"+adt_name, derive_adt_type(file, adt));
      for (var c = 0; c < adt_ctor.length; ++c) {
        define(file+"/"+adt_ctor[c][0], derive_adt_ctor(file, adt, c));
      }
      adts[file+"/"+adt_name] = adt;

      return true;
    }
  }

  // Parses a top-level `?defs` util
  async function do_parse_defs_util() {
    if (match("?defs")) {
      var filt = match("/") ? parse_string(x => x !== "/") : "";
      var regx = new RegExp(filt, "i");
      console.log("Definitions:");
      for (var def in defs) {
        if (def[0] !== "$" && regx.test(def)) {
          console.log("- " + def);
        }
      }
      return true;
    }
  }

  // Parses a top-level definition:
  //
  //    name(arg0 : A, arg1 : B, ...) : RetType
  //      <body>
  //
  async function do_parse_def() {
    // Parses box annotation
    var boxed = match("#");

    // Parses definition name
    if (tokens) tokens.push(["def", ""]);
    var name = parse_name();

    if (name.length === 0) {
      error("Expected a definition.");
    }
    if (tokens) tokens[tokens.length - 1][2] = file+"/"+name;
    if (tokens) tokens.push(["txt", ""]);

    // If name is empty, stop
    if (name.length === 0) return false;

    // Parses argument names and types
    var erass = [];
    var names = [];
    var types = [];
    if (match_here("(")) {
      while (idx < code.length) {
        var arg_eras = match("~");
        var arg_name = parse_string();
        var arg_type = match(":") ? await parse_term(names) : Typ();
        erass.push(arg_eras);
        names.push(arg_name);
        types.push(arg_type);
        if (match(")")) break;
        else parse_exact(",");
      }
    }

    // Parses return type, if any
    var type = match(":") ? await parse_term(names) : null;
    var term = await parse_term(names);

    // Fills foralls and lambdas of arguments
    for (var i = names.length - 1; i >= 0; --i) {
      var type = type && All(names[i], types[i], type, erass[i]);
      var term = Lam(names[i], type ? null : types[i], term, erass[i]);
    }

    // Defines the top-level term
    define(file+"/"+name, type ? Ann(type, term, false) : term);

    return true;
  }

  function save_parse_state() {
    return {idx, row, col, tokens_length: tokens && tokens.length};
  }

  function load_parse_state(state) {
    idx = state.idx;
    row = state.row;
    col = state.col;
    while (state.tokens_length && tokens.length > state.tokens_length) {
      tokens.pop();
    }
  }

  // Parses all definitions
  var open_imports = {};
  var qual_imports = {};
  var local_imports = {};
  var file_version = {};
  var used_hole_name = {};
  var hole_count = 0;
  var tokens = tokenify ? [["txt",""]] : null;
  var idx = 0;
  var row = 0;
  var col = 0;
  var defs = {};
  var adts = {};
  while (idx < code.length) {
    next_char();
    if (await do_parse_import());
    else if (await do_parse_datatype());
    else if (await do_parse_defs_util());
    else if (!(await do_parse_def())) break;
    next_char();
  }

  return {
    defs,
    adts,
    tokens,
    local_imports,
    qual_imports,
    open_imports
  };
}

// :::::::::::
// :: Utils ::
// :::::::::::

// Generates a name
const gen_name = (n) => {
  var str = "";
  ++n;
  while (n > 0) {
    --n;
    str += String.fromCharCode(97 + n % 26);
    n = Math.floor(n / 26);
  }
  return str;
};

// :::::::::::::::::::
// :: Syntax Sugars ::
// :::::::::::::::::::

// Syntax sugars for datatypes. They transform a statement like:
//
//   data ADT <p0 : Param0, p1 : Param1...> {i0 : Index0, i1 : Index1}
//   | ctr0 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type
//   | ctr1 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type
//   | ...
//
// on its corresponding self-encoded datatype:
//
//   def ADT
//   = {p0 : Param0, p1 : Param1, ..., i0 : Index0, i1 : Index1, ...} =>
//     : Type
//     $ self
//     {~P   : {i0 : Index0, i1 : Index1, ..., wit : (ADT i0 i1...)} -> Type} ->
//     {ctr0 : {ctr0_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr0 Param0 Param1... ctr0_fld0 ctr0_fld1 ...))} ->
//     {ctr1 : {ctr1_fld0 : Ctr1_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr1 Param0 Param1... ctr1_fld1 ctr0_fld1 ...))} ->
//     ... ->
//     (P i0 i1... self)
//
//   def ADT.ctr0
//   = {~p0 : Param0, ~p1 : Param1, ..., ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} =>
//     : Ctr0Type
//     @ Ctr0Type
//       {~P, ctr0, ctr1, ...} =>
//       (ctr0 ctr0_fld0 ctr0_fld1 ...)
//
//   (...)
const derive_adt_type = (file, {adt_pram, adt_indx, adt_ctor, adt_name}) => {
  return (function adt_arg(p, i) {
    // ... {p0 : Param0, p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], adt_arg(p + 1, i), adt_pram[p][2]);
    // ... {i0 : Index0, i1 : Index...} ...
    } else if (i < adt_indx.length) {
      var substs = [Ref(file+"/"+adt_name)];
      for (var P = 0; P < p; ++P) {
        substs.push(Var(-1 + i + p - P));
      }
      return Lam(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), adt_arg(p, i + 1), adt_indx[i][2]);
    } else {
      return (
        // ... : Type ...
        Ann(Typ(),
        // ... $ self ...
        Slf("self",
        // ... P : ...
        All("P",
          (function motive(i) {
            // ... {i0 : Index0, i1 : Index1...} ...
            if (i < adt_indx.length) {
              var substs = [Ref(file+"/"+adt_name)];
              for (var P = 0; P < p; ++P) {
                substs.push(Var(-1 + i + 1 + adt_indx.length + p - P));
              }
              return All(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), motive(i + 1), adt_indx[i][2]);
            // ... {wit : (ADT i0 i1...)} -> Type ...
            } else {
              var wit_t = Ref(file+"/"+adt_name);
              for (var P = 0; P < adt_pram.length; ++P) {
                wit_t = App(wit_t, Var(-1 + i + 1 + i + adt_pram.length - P), adt_pram[P][2]);
              }
              for (var I = 0; I < i; ++I) {
                wit_t = App(wit_t, Var(-1 + i - I), adt_indx[I][2]);
              }
              return All("wit", wit_t, Typ(), false);
            }
          })(0),
        (function ctor(i) {
          if (i < adt_ctor.length) {
            // ... ctrX : ...
            return All(adt_ctor[i][0], (function field(j) {
              var subst_prams = [];
              for (var P = 0; P < adt_pram.length; ++P) {
                subst_prams.push(Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P));
              }
              // ... {ctrX_fldX : CtrX_FldX, ctrX_fld1 : CtrX_Fld1, ...} -> ...
              if (j < adt_ctor[i][1].length) {
                var sub = [Ref(file+"/"+adt_name)].concat(subst_prams);
                var typ = subst_many(adt_ctor[i][1][j][1], sub, j);
                return All(adt_ctor[i][1][j][0], typ, field(j + 1), adt_ctor[i][1][j][2]);
              // ... (CtrXType[ADT <- P] (ADT.ctrX ParamX Param1... ctrX_fldX ctrX_fld1 ...)) -> ...
              } else {
                var typ = adt_ctor[i][2];
                var sub = [Var(-1 + j + i + 1)].concat(subst_prams);
                var typ = subst_many(adt_ctor[i][2], sub, j);
                var rem = typ;
                for (var I = 0; I < adt_indx.length; ++I) {
                  rem = rem[1].func;
                }
                rem[0] = "Var";
                rem[1] = {index: -1 + i + j + 1};
                var wit = Ref(file+"/"+adt_ctor[i][0]);
                for (var P = 0; P < adt_pram.length; ++P) {
                  var wit = App(wit, Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P), true);
                }
                for (var F = 0; F < adt_ctor[i][1].length; ++F) {
                  var wit = App(wit, Var(-1 + j - F), adt_ctor[i][1][F][2]);
                }
                return App(typ, wit, false);
              }
            })(0),
            ctor(i + 1),
            false);
          } else {
            // ... (P i0 i1... self)
            var ret = Var(adt_ctor.length + 1 - 1);
            for (var i = 0; i < adt_indx.length; ++i) {
              var ret = App(ret, Var(adt_ctor.length + 1 + 1 + adt_indx.length - i - 1), adt_indx[i][2]);
            }
            var ret = App(ret, Var(adt_ctor.length + 1 + 1 - 1), false);
            return ret;
          }
        })(0),
        true))));
    }
  })(0, 0);
}

const derive_adt_ctor = (file, {adt_pram, adt_indx, adt_ctor, adt_name}, c) => {
  return (function arg(p, i, f) {
    var substs = [Ref(file+"/"+adt_name)];
    for (var P = 0; P < p; ++P) {
      substs.push(Var(-1 + f + p - P));
    }
    // {~p0 : Param0, ~p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], arg(p + 1, i, f), true);
    // ... {ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} ...
    } else if (f < adt_ctor[c][1].length) {
      return Lam(adt_ctor[c][1][f][0], subst_many(adt_ctor[c][1][f][1], substs, f), arg(p, i, f + 1), adt_ctor[c][1][f][2]);
    } else {
      var type = subst_many(adt_ctor[c][2], substs, f);
      // ... : CtrXType {~P} ...
      return Ann(type, New(type, Lam("P", null, (function opt(k) {
        // ... {ctr0, ctr1...} ...
        if (k < adt_ctor.length) {
          return Lam(adt_ctor[k][0], null, opt(k + 1), false);
        // (ctrX ctrX_fld0 ctrX_fld1 ...)
        } else {
          var sel = Var(-1 + adt_ctor.length - c);
          for (var F = 0; F < adt_ctor[c][1].length; ++F) {
            var fld = Var(-1 + adt_ctor.length + 1 + adt_ctor[c][1].length - F);
            // Unrestricted field
            if (adt_ctor[c][1][F][1][0] === "Utt") {
              var fld = Utv(Ute(fld));
            }
            var sel = App(sel, fld, adt_ctor[c][1][F][2]);
          }
          return sel;
        }
      })(0), true)), false);
    }
  })(0, adt_indx.length, 0);
}

const reduce = (term, opts) => {
  return core_reduce(term, {...opts, show});
};

const typecheck = (term, expect, opts) => {
  return core_typecheck(term, expect, {...opts, show});
};

// Evaluates a term to normal form in different modes
// run : String -> (String | Term) -> Opts -> Term
const run = (mode, term, opts = {}) => {
  var eras = opts.erased ? erase : (x => x);
  var defs = opts.defs || {};
  if (typeof term === "string") {
    term = defs[term] || Ref(term);
  }

  switch (mode) {

    case "REDUCE_DEBUG":
      term = eras(term);
      try {
        opts.unbox = true;
        opts.undup = true;
        term = reduce(term, opts);
      } catch (e) {
        term = reduce(term, {...opts, weak: true});
      }
      break;

    case "REDUCE_DEBUG":
    case "REDUCE_NATIVE":
      term = eras(term);
      term = to_js.decompile(to_js.compile(term, defs));
      break;

    case "REDUCE_OPTIMAL":
      term = eras(term);
      var net = to_net.compile(term, defs);
      if (opts.stats && opts.stats.input_net === null) {
        opts.stats.input_net = JSON.parse(JSON.stringify(net));
      }
      if (opts.strict) {
        var new_stats = net.reduce_strict(opts.stats || {});
      } else {
        var new_stats = net.reduce_lazy(opts.stats || {});
      }
      if (opts.stats && opts.stats.output_net !== undefined) {
        opts.stats.output_net = JSON.parse(JSON.stringify(net));
      }
      term = to_net.decompile(net);
      break;

    case "TYPECHECK":
      term = typecheck(term, null, opts);
      break;
  }

  return term;
};

module.exports = {
  Var, Typ, Tid, Utt, Utv, Ute, All, Lam,
  App, Box, Put, Tak, Dup, Num, Val, Op1,
  Op2, Ite, Cpy, Sig, Par, Fst, Snd, Prj,
  Slf, New, Use, Ann, Log, Hol, Ref,
  derive_adt_ctor,
  derive_adt_type,
  equal,
  erase,
  gen_name,
  parse,
  reduce,
  run,
  shift,
  show,
  subst,
  subst_many,
  typecheck,
  haltcheck,
  version,
};


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-lib.js":
/*!***************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-lib.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fm = module.exports = {
  core   : __webpack_require__(/*! ./fm-core */ "./node_modules/formality-lang/src/fm-core.js"),
  json   : __webpack_require__(/*! ./fm-json */ "./node_modules/formality-lang/src/fm-json.js"),
  lang   : __webpack_require__(/*! ./fm-lang */ "./node_modules/formality-lang/src/fm-lang.js"),
  net    : __webpack_require__(/*! ./fm-net */ "./node_modules/formality-lang/src/fm-net.js"),
  to_js  : __webpack_require__(/*! ./fm-to-js */ "./node_modules/formality-lang/src/fm-to-js.js"),
  to_net : __webpack_require__(/*! ./fm-to-net */ "./node_modules/formality-lang/src/fm-to-net.js"),
  forall : __webpack_require__(/*! ./forall */ "./node_modules/formality-lang/src/forall.js"),
};


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-net.js":
/*!***************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-net.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// ~~ Formality Interaction Net System ~~

// PtrNum types
const PTR = 0;
const NUM = 1;

// Node types
const NOD = 0;
const OP1 = 1;
const OP2 = 2;
const ITE = 3;

// Base types
const Pointer = (addr, port) => ({typ: PTR, val: (addr << 2) + (port & 3)});
const addr_of = (ptrn) => ptrn.val >>> 2;
const slot_of = (ptrn) => ptrn.val & 3;
const Numeric = (numb) => ({typ: NUM, val: numb});
const numb_of = (ptrn) => ptrn.val;
const type_of = (ptrn) => ptrn.typ;
const ptrn_eq = (a, b) => a.typ === b.typ && a.val === b.val;
const ptrn_st = a => a.typ + ":" + a.val;

class Net {
  // A net stores nodes (this.nodes), reclaimable memory addrs (this.freed) and active pairs (this.redex)
  constructor() {
    this.nodes = []; // nodes
    this.freed = []; // integers
    this.redex = []; // array of (integer, integer) tuples representing addrs
    this.find_redex = true;
  }

  // Allocates a new node, return its addr
  alloc_node(type, kind) {

    // If there is reclaimable memory, use it
    if (this.freed.length > 0) {
      var addr = this.freed.pop();

    // Otherwise, extend the array of nodes
    } else {
      var addr = this.nodes.length / 4;
    }

    // Fill the memory with an empty node without pointers
    this.nodes[addr * 4 + 0] = addr * 4 + 0;
    this.nodes[addr * 4 + 1] = addr * 4 + 1;
    this.nodes[addr * 4 + 2] = addr * 4 + 2;
    this.nodes[addr * 4 + 3] = (kind << 6) + ((type & 0x7) << 3);
    return addr;
  }

  // Deallocates a node, allowing its space to be reclaimed
  free_node(addr) {
    this.nodes[addr * 4 + 0] = addr * 4 + 0;
    this.nodes[addr * 4 + 1] = addr * 4 + 1;
    this.nodes[addr * 4 + 2] = addr * 4 + 2;
    this.nodes[addr * 4 + 3] = 0;
    this.freed.push(addr);
  }

  is_free(addr) {
    return this.nodes[addr * 4 + 0] === addr * 4 + 0
        && this.nodes[addr * 4 + 1] === addr * 4 + 1
        && this.nodes[addr * 4 + 2] === addr * 4 + 2
        && this.nodes[addr * 4 + 3] === 0;
  }

  // Returns if given slot holds a number
  is_numeric(addr, slot) {
    return (this.nodes[addr * 4 + 3] >>> slot) & 1; 
  }

  set_port(addr, slot, ptrn) {
    if (type_of(ptrn) === NUM) {
      this.nodes[addr * 4 + slot] = numb_of(ptrn);
      this.nodes[addr * 4 + 3] = this.nodes[addr * 4 + 3] | (1 << slot);
    } else {
      this.nodes[addr * 4 + slot] = (addr_of(ptrn) << 2) + (slot_of(ptrn) & 3);
      this.nodes[addr * 4 + 3] = this.nodes[addr * 4 + 3] & ~(1 << slot);
    }
  }

  get_port(addr, slot) {
    var val = this.nodes[addr * 4 + slot];
    return !this.is_numeric(addr, slot) ? Pointer(val >>> 2, val & 3) : Numeric(val);
  }

  type_of(addr) {
    return (this.nodes[addr * 4 + 3] >>> 3) & 0x7;
  }

  set_type(addr, type) {
    this.nodes[addr * 4 + 3] = (this.nodes[addr * 4 + 3] & ~0b111000) | (type << 3);
  }

  kind_of(addr) {
    return this.nodes[addr * 4 + 3] >>> 6;
  }

  // Given a pointer to a port, returns a pointer to the opposing port
  enter_port(ptrn) {
    if (type_of(ptrn) === NUM) { 
      throw "Can't enter a numeric pointer.";
    } else {
      return this.get_port(addr_of(ptrn), slot_of(ptrn));
    }
  }

  // Connects two ports
  link_ports(a_ptrn, b_ptrn) {
    var a_numb = type_of(a_ptrn) === NUM;
    var b_numb = type_of(b_ptrn) === NUM;

    // Point ports to each-other
    if (!a_numb) this.set_port(addr_of(a_ptrn), slot_of(a_ptrn), b_ptrn);
    if (!b_numb) this.set_port(addr_of(b_ptrn), slot_of(b_ptrn), a_ptrn);

    // If both are main ports, add this to the list of active pairs
    if (this.find_redex && !(a_numb && b_numb) && (a_numb || slot_of(a_ptrn) === 0) && (b_numb || slot_of(b_ptrn) === 0)) {
      this.redex.push(a_numb ? addr_of(b_ptrn) : addr_of(a_ptrn));
    }
  }

  // Disconnects a port, causing both sides to point to themselves
  unlink_port(a_ptrn) {
    if (type_of(a_ptrn) === PTR) {
      var b_ptrn = this.enter_port(a_ptrn);
      if (type_of(b_ptrn) === PTR && ptrn_eq(this.enter_port(b_ptrn), a_ptrn)) {
        this.set_port(addr_of(a_ptrn), slot_of(a_ptrn), a_ptrn);
        this.set_port(addr_of(b_ptrn), slot_of(b_ptrn), b_ptrn);
      }
    }
  }

  // Rewrites an active pair
  rewrite(a_addr) {
    var a_ptrn = Pointer(a_addr, 0);
    var b_ptrn = this.get_port(a_addr, 0);
    if (type_of(b_ptrn) === NUM) {
      var a_type = this.type_of(a_addr);
      var a_kind = this.kind_of(a_addr);

      // UnaryOperation
      if (a_type === OP1) {
        var dst = this.enter_port(Pointer(a_addr, 2));
        var fst = numb_of(b_ptrn);
        var snd = numb_of(this.enter_port(Pointer(a_addr, 1)));
        switch (a_kind) {
          case  0: var res = Numeric(fst + snd); break;
          case  1: var res = Numeric(fst - snd); break;
          case  2: var res = Numeric(fst * snd); break;
          case  3: var res = Numeric(fst / snd); break;
          case  4: var res = Numeric(fst % snd); break;
          case  5: var res = Numeric(fst ** snd); break;
          case  6: var res = Numeric(fst & snd); break;
          case  7: var res = Numeric(fst | snd); break;
          case  8: var res = Numeric(fst ^ snd); break;
          case  9: var res = Numeric(~snd); break;
          case 10: var res = Numeric(fst >>> snd); break;
          case 11: var res = Numeric(fst << snd); break;
          case 12: var res = Numeric(fst > snd ? 1 : 0); break;
          case 13: var res = Numeric(fst < snd ? 1 : 0); break;
          case 14: var res = Numeric(fst === snd ? 1 : 0); break;
          default: throw "[ERROR]\nInvalid interaction.";
        }
        this.link_ports(dst, res);
        this.unlink_port(Pointer(a_addr, 0));
        this.unlink_port(Pointer(a_addr, 2));
        this.free_node(a_addr);
      
      // BinaryOperation
      } else if (a_type === OP2) {
        this.set_type(a_addr, OP1);
        this.link_ports(Pointer(a_addr, 0), this.enter_port(Pointer(a_addr, 1)));
        this.unlink_port(Pointer(a_addr, 1));
        this.link_ports(Pointer(a_addr, 1), b_ptrn);
    
      // NumberDuplication
      } else if (a_type === NOD) {
        this.link_ports(b_ptrn, this.enter_port(Pointer(a_addr, 1)));
        this.link_ports(b_ptrn, this.enter_port(Pointer(a_addr, 2)));
        this.free_node(a_addr);

      // IfThenElse
      } else if (a_type === ITE) {
        var cond_val = numb_of(b_ptrn) === 0;
        var pair_ptr = this.enter_port(Pointer(a_addr, 1));
        this.set_type(a_addr, NOD);
        this.link_ports(Pointer(a_addr, 0), pair_ptr);
        this.unlink_port(Pointer(a_addr, 1));
        var dest_ptr = this.enter_port(Pointer(a_addr, 2));
        this.link_ports(Pointer(a_addr, cond_val ? 2 : 1), dest_ptr);
        if (!cond_val) this.unlink_port(Pointer(a_addr, 2));
        this.link_ports(Pointer(a_addr, cond_val ? 1 : 2), Pointer(a_addr, cond_val ? 1 : 2));

      } else {
        throw "[ERROR]\nInvalid interaction.";
      }

    } else {
      var b_addr = addr_of(b_ptrn);
      var a_type = this.type_of(a_addr);
      var b_type = this.type_of(b_addr);
      var a_kind = this.kind_of(a_addr);
      var b_kind = this.kind_of(b_addr);

      // NodeAnnihilation, UnaryAnnihilation, BinaryAnnihilation
      if ( a_type === NOD && b_type === NOD && a_kind === b_kind
        || a_type === OP1 && b_type === OP1
        || a_type === OP2 && b_type === OP2
        || a_type === ITE && b_type === ITE) {
        var a_aux1_dest = this.enter_port(Pointer(a_addr, 1));
        var b_aux1_dest = this.enter_port(Pointer(b_addr, 1));
        this.link_ports(a_aux1_dest, b_aux1_dest);
        var a_aux2_dest = this.enter_port(Pointer(a_addr, 2));
        var b_aux2_dest = this.enter_port(Pointer(b_addr, 2));
        this.link_ports(a_aux2_dest, b_aux2_dest);
        for (var i = 0; i < 3; i++) {
          this.unlink_port(Pointer(a_addr, i));
          this.unlink_port(Pointer(b_addr, i));
        }
        this.free_node(a_addr);
        if (a_addr !== b_addr) {
          this.free_node(b_addr);
        }

      // NodeDuplication, BinaryDuplication
      } else if
        (  a_type === NOD && b_type === NOD && a_kind !== b_kind
        || a_type === NOD && b_type === OP2
        || a_type === NOD && b_type === ITE) {
        var p_addr = this.alloc_node(b_type, b_kind);
        var q_addr = this.alloc_node(b_type, b_kind);
        var r_addr = this.alloc_node(a_type, a_kind);
        var s_addr = this.alloc_node(a_type, a_kind);
        this.link_ports(Pointer(r_addr, 1), Pointer(p_addr, 1));
        this.link_ports(Pointer(s_addr, 1), Pointer(p_addr, 2));
        this.link_ports(Pointer(r_addr, 2), Pointer(q_addr, 1));
        this.link_ports(Pointer(s_addr, 2), Pointer(q_addr, 2));
        this.link_ports(Pointer(p_addr, 0), this.enter_port(Pointer(a_addr, 1)));
        this.link_ports(Pointer(q_addr, 0), this.enter_port(Pointer(a_addr, 2)));
        this.link_ports(Pointer(r_addr, 0), this.enter_port(Pointer(b_addr, 1)));
        this.link_ports(Pointer(s_addr, 0), this.enter_port(Pointer(b_addr, 2)));
        for (var i = 0; i < 3; i++) {
          this.unlink_port(Pointer(a_addr, i));
          this.unlink_port(Pointer(b_addr, i));
        }
        this.free_node(a_addr);
        if (a_addr !== b_addr) {
          this.free_node(b_addr);
        }

      // UnaryDuplication
      } else if
        (  a_type === NOD && b_type === OP1
        || a_type === ITE && b_type === OP1) {
        var p_addr = this.alloc_node(b_type, b_kind);
        var q_addr = this.alloc_node(b_type, b_kind);
        var s_addr = this.alloc_node(a_type, a_kind);
        this.link_ports(Pointer(p_addr, 1), this.enter_port(Pointer(b_addr, 1)));
        this.link_ports(Pointer(q_addr, 1), this.enter_port(Pointer(b_addr, 1)));
        this.link_ports(Pointer(s_addr, 1), Pointer(p_addr, 2));
        this.link_ports(Pointer(s_addr, 2), Pointer(q_addr, 2));
        this.link_ports(Pointer(p_addr, 0), this.enter_port(Pointer(a_addr, 1)));
        this.link_ports(Pointer(q_addr, 0), this.enter_port(Pointer(a_addr, 2)));
        this.link_ports(Pointer(s_addr, 0), this.enter_port(Pointer(b_addr, 2)));
        for (var i = 0; i < 3; i++) {
          this.unlink_port(Pointer(a_addr, i));
          this.unlink_port(Pointer(b_addr, i));
        }
        this.free_node(a_addr);
        if (a_addr !== b_addr) {
          this.free_node(b_addr);
        }
      
      // Permutations
      } else if (a_type === OP1 && b_type === NOD) {
        return this.rewrite(b_addr);
      } else if (a_type === OP2 && b_type === NOD) {
        return this.rewrite(b_addr);
      } else if (a_type === ITE && b_type === NOD) {
        return this.rewrite(b_addr);

      // InvalidInteraction
      } else {
        throw "[ERROR]\nInvalid interaction.";
      }
    }
  }

  // Rewrites active pairs until none is left, reducing the graph to normal form.
  // This could be performed in parallel and doesn't need GC.
  reduce_strict(stats) {
    var rewrites = 0;
    var loops = 0;
    var max_len = 0;
    while (this.redex.length > 0) {
      for (var i = 0, l = this.redex.length; i < l; ++i) {
        this.rewrite(this.redex.pop());
        stats.max_len = Math.max(stats.max_len, this.nodes.length / 4);
        ++stats.rewrites;
      }
      ++stats.loops;
    }
  }

  // Rewrites active pairs until none is left, reducing the graph to normal form.
  // This avoids unecessary computations, but is sequential and would need GC.
  reduce_lazy(stats) {
    this.find_redex = false;
    var warp = [];
    var back = [];
    var prev = Pointer(0, 1);
    var next = this.enter_port(prev);
    var rwts = 0;
    while (true) {
      ++stats.loops;
      if (type_of(next) === PTR && (addr_of(next) === 0 || this.is_free(addr_of(next)))) {
        if (warp.length === 0) {
          break;
        } else {
          prev = warp.pop();
          next = this.enter_port(prev);
        }
      } else {
        if (slot_of(prev) === 0 && (type_of(next) === NUM || slot_of(next) === 0)) {
          try {
            this.rewrite(addr_of(prev));
          } catch (e) {
            return;
          }
          stats.rewrites += 1;
          stats.max_len = Math.max(stats.max_len, this.nodes.length / 4);
          do { prev = back.pop(); } while (type_of(prev) !== PTR);
          next = this.enter_port(prev);
          ++rwts;
        } else if (type_of(next) === NUM) {
          [prev,next] = [next,prev];
        } else if (slot_of(next) === 0) {
          if (this.type_of(addr_of(next)) !== OP1) {
            warp.push(Pointer(addr_of(next), 1));
          }
          prev = Pointer(addr_of(next), 2);
          next = this.enter_port(prev);
        } else {
          back.push(prev);
          prev = Pointer(addr_of(next), 0);
          next = this.enter_port(prev);
        }
      }
    }
    this.find_redex = true;
  }

  // Returns a string that is preserved on reduction, good for debugging
  denote(ptrn = this.enter_port(Pointer(0, 1)), exit = []) {
    function path_to_string(path) {
      var str = "<";
      while (path) {
        str += path.head === 1 ? "a" : "b";
        path = path.tail; 
      }
      str += ">";
      return str;
    }
    while (true) {
      if (type_of(ptrn) === PTR) {
        var ai = addr_of(ptrn);
        var as = slot_of(ptrn)
        var ak = this.kind_of(ai);
        switch (this.type_of(ai)) {
          case NOD:
            if (slot_of(ptrn) === 0) {
              if (exit[ak]) {
                var new_exit = exit.slice(0);
                new_exit[ak] = new_exit[ak].tail;
                ptrn = this.enter_port(Pointer(ai, Number(exit[ak].head)));
                exit = new_exit;
                continue; // tail-call: denote(ptrn, exit)
              } else {
                var lft = this.denote(this.enter_port(Pointer(ai, 1)), exit);
                var rgt = this.denote(this.enter_port(Pointer(ai, 2)), exit);
                return "(" + ak + " " + lft + " " + rgt + ")";
              }
            } else {
              if (ai === 0) {
                while (exit[exit.length - 1] === null) exit.pop();
                return exit.map(path_to_string).join(":");
              } else {
                var new_exit = exit.slice(0);
                new_exit[ak] = {head: as, tail: new_exit[ak] || null};
                ptrn = this.enter_port(Pointer(ai, 0));
                exit = new_exit;
                continue; // tail-call: denote(ptrn, exit)
              }
            }
            break;
          default:
            return "<TODO>";
        }
      } else {
        return "#" + numb_of(ptrn);
      }
    }
  }

  to_string() {
    const pointer = (ptrn) => {
      if (type_of(ptrn) === NUM) {
        return "#" + numb_of(ptrn);
      } else {
        return addr_of(ptrn) + "abc"[slot_of(ptrn)];
      }
    };
    var text = '';
    for (var i = 0; i < this.nodes.length / 4; i++) {
      if (this.is_free(i)) {
        text += i + ": ~\n";
      } else {
        var type = this.type_of(i);
        var kind = this.kind_of(i);
        text += i + ': ';
        text += "[" + type + ":" + kind + "| ";
        text += pointer(this.get_port(i, 0)) + " ";
        text += pointer(this.get_port(i, 1)) + " ";
        text += pointer(this.get_port(i, 2)) + "]";
        text += " ... " + this.is_numeric(i,0) + " " + this.is_numeric(i,1) + " " + this.is_numeric(i,2);
        text += "\n";
      }
    }
    return text;
  }
}

module.exports = {Pointer, addr_of, slot_of, Numeric, numb_of, type_of, ptrn_eq, ptrn_st, Net, NUM, PTR, NOD, OP1, OP2, ITE};


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-to-js.js":
/*!*****************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-to-js.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const fm = __webpack_require__(/*! ./fm-core.js */ "./node_modules/formality-lang/src/fm-core.js");

// Converts a Formality-Core Term to a native JavaScript function
const compile = (term, opts, vars = null) => {
  var [ctor, term] = term;
  switch (ctor) {
    case "Var":
      for (var i = 0; i < term.index; ++i) {
        vars = vars[1];
      }
      return vars[0];
    case "Lam":
      return x => compile(term.body, opts, [x, vars]);
    case "App":
      var func = compile(term.func, opts, vars);
      var argm = compile(term.argm, opts, vars);
      return func(argm);
    case "Put":
      return compile(term.expr, opts, vars);
    case "Dup": 
      var expr = compile(term.expr, opts, vars);
      var body = x => compile(term.body, opts, [x,vars]);
      return body(expr);
    case "Val":
      return term.numb;
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = compile(term.num0, opts, vars);
      var num1 = compile(term.num1, opts, vars);
      switch (func) {
        case ".+."  : return num0 + num1;
        case ".-."  : return num0 - num1;
        case ".*."  : return num0 * num1;
        case "./."  : return num0 / num1;
        case ".%."  : return num0 % num1;
        case ".**." : return num0 ** num1;
        case ".&."  : return num0 & num1;
        case ".|."  : return num0 | num1;
        case ".^."  : return num0 ^ num1;
        case ".~."  : return ~ num1;
        case ".>>." : return num0 >>> num1;
        case ".<<." : return num0 << num1;
        case ".>."  : return num0 > num1;
        case ".<."  : return num0 < num1;
        default: throw "TODO: implement operator "
      }
    case "Ite":
      var cond = compile(term.cond, opts, vars);
      var pair = compile(term.pair, opts, vars);
      return cond ? pair[0] : pair[1];
    case "Cpy":
      var numb = compile(term.numb, opts, vars);
      var body = x => compile(term.body, opts, [x,vars]);
      return body(numb);
    case "Par":
      var val0 = compile(term.val0, opts, vars);
      var val1 = compile(term.val1, opts, vars);
      return [val0, val1];
    case "Fst":
      var pair = compile(term.pair, opts, vars);
      return pair[0];
    case "Snd":
      var pair = compile(term.pair, opts, vars);
      return pair[1];
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = compile(term.pair, opts, vars);
      var body = (x,y) => compile(term.body, opts, [y,[x,vars]]);
      return body(pair[0], pair[1]);
    case "Log":
      return compile(term.expr, opts, vars);
    case "Ref":
      return compile(fm.erase((opts.defs||{})[term.name]), opts, vars);
  }
};

// Converts a native JavaScript function back to a Formality-Core term
const decompile = (func) => {
  return (function go(term, depth) {
    function APP(variable) {
      return function FM_DECOMPILE_GET(arg){
        if (arg === null) {
          return variable;
        } else {
          return APP(d => fm.App(variable(d), go(arg, d), false));
        }
      };
    };
    function VAR(d) {
      return fm.Var(d - 1 - depth);
    };
    if (typeof term === "function" && term.name === "FM_DECOMPILE_GET") {
      return term(null)(depth);
    } else if (typeof term === "object") {
      var val0 = go(term[0], depth);
      var val1 = go(term[1], depth);
      return fm.Par(val0, val1);
    } else if (typeof term === "number") {
      return fm.Val(term);
    } else if (typeof term === "function") {
      var body = go(term(APP(VAR)), depth + 1);
      return fm.Lam("x" + depth, null, body, false);
    } else if (typeof term === "string") {
      throw "[ERROR]\nThis native JS function can't be decompiled to Formality:\n\n"
        + func.toString()
        + "\n\nIt possibly uses numeric operators on free variables, which can't be decompiled yet.";
    } else {
      return term;
    }
  })(func, 0);
};

module.exports = {compile, decompile};


/***/ }),

/***/ "./node_modules/formality-lang/src/fm-to-net.js":
/*!******************************************************!*\
  !*** ./node_modules/formality-lang/src/fm-to-net.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ~~ Compiles Formality Core to Formality Net ~~

const {Var, App, Lam, Val, Op1, Op2, Ite, Par, Fst, Snd, Hol, erase} = __webpack_require__(/*! ./fm-core.js */ "./node_modules/formality-lang/src/fm-core.js");
const {Net, Pointer, Numeric, addr_of, slot_of, type_of, numb_of, ptrn_eq, ptrn_st, NOD, OP1, OP2, NUM, ITE, PTR, FOR} = __webpack_require__(/*! ./fm-net.js */ "./node_modules/formality-lang/src/fm-net.js");

const op_kind = {
   0 : ".+."   , ".+."   : 0 ,
   1 : ".-."   , ".-."   : 1 ,
   2 : ".*."   , ".*."   : 2 ,
   3 : "./."   , "./."   : 3 ,
   4 : ".%."   , ".%."   : 4 ,
   5 : ".**."  , ".**."  : 5 ,
   6 : ".&."   , ".&."   : 6 ,
   7 : ".|."   , ".|."   : 7 ,
   8 : ".^."   , ".^."   : 8 ,
   9 : ".~."   , ".~."   : 9 ,
  10 : ".>>>." , ".>>>." : 10 ,
  11 : ".<<."  , ".<<."  : 11 ,
  12 : ".>."   , ".>."   : 12 ,
  13 : ".<."   , ".<."   : 13 ,
  14 : ".==."  , ".==."  : 14 ,
};

const compile = (term, defs = {}) => {
  const ref_ptrs = {};
  const build_net = (term, net, var_ptrs, level) => {
    const get_var = (ptrn) => {
      if (type_of(ptrn) === NUM) {
        return ptrn;
      } else {
        if (ptrn_eq(net.enter_port(ptrn), ptrn)) {
          return ptrn;
        } else {
          var dups_ptrn = net.enter_port(ptrn);
          var dup_addr = net.alloc_node(NOD, level_of[ptrn_st(ptrn)] + 1);
          net.link_ports(Pointer(dup_addr, 0), ptrn);
          net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
          return Pointer(dup_addr, 2);
        }
      }
    };
    switch (term[0]) {
      case "Dup":
        var expr_ptr = build_net(term[1].expr, net, var_ptrs, level);
        level_of[ptrn_st(expr_ptr)] = level;
        var_ptrs.push(expr_ptr);
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        return body_ptr;
      case "Put":
        var expr_ptr = build_net(term[1].expr, net, var_ptrs, level + 1);
        return expr_ptr;
      case "Lam":
        var lam_addr = net.alloc_node(NOD, 0);
        net.link_ports(Pointer(lam_addr, 1), Pointer(lam_addr, 1));
        level_of[ptrn_st(Pointer(lam_addr, 1))] = level;
        var_ptrs.push(Pointer(lam_addr, 1));
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(Pointer(lam_addr, 2), body_ptr);
        return Pointer(lam_addr, 0);
      case "App":
        var app_addr = net.alloc_node(NOD, 0);
        var func_ptr = build_net(term[1].func, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 0), func_ptr);
        var argm_ptr = build_net(term[1].argm, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 1), argm_ptr)
        return Pointer(app_addr, 2);
      case "Val":
        return Numeric(term[1].numb);
      case "Op1":
        var op1_addr = net.alloc_node(OP1, op_kind[term[1].func]);
        net.link_ports(Numeric(term[1].num1[1].numb), Pointer(op1_addr, 1));
        var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
        net.link_ports(num0_ptr, Pointer(op1_addr, 0));
        return Pointer(op1_addr, 2);
      case "Op2":
        var op2_addr = net.alloc_node(OP2, op_kind[term[1].func]);
        var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
        net.link_ports(Pointer(op2_addr, 1), num0_ptr);
        var num1_ptr = build_net(term[1].num1, net, var_ptrs, level);
        net.link_ports(Pointer(op2_addr, 0), num1_ptr);
        return Pointer(op2_addr, 2);
      case "Par":
        var par_addr = net.alloc_node(NOD, 0xFFFF);
        var val0_ptr = build_net(term[1].val0, net, var_ptrs, level);
        net.link_ports(Pointer(par_addr, 1), val0_ptr);
        var val1_ptr = build_net(term[1].val1, net, var_ptrs, level);
        net.link_ports(Pointer(par_addr, 2), val1_ptr);
        return Pointer(par_addr, 0);
      case "Fst":
        var fst_addr = net.alloc_node(NOD, 0xFFFF);
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        net.link_ports(Pointer(fst_addr, 0), pair_ptr);
        net.link_ports(Pointer(fst_addr, 2), Pointer(fst_addr, 2));
        return Pointer(fst_addr, 1);
      case "Snd":
        var snd_addr = net.alloc_node(NOD, 0xFFFF);
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        net.link_ports(Pointer(snd_addr, 0), pair_ptr);
        net.link_ports(Pointer(snd_addr, 1), Pointer(snd_addr, 1));
        return Pointer(snd_addr, 2);
      case "Prj":
        var prj_addr = net.alloc_node(NOD, 0xFFFF);
        level_of[ptrn_st(Pointer(prj_addr, 1))] = level;
        level_of[ptrn_st(Pointer(prj_addr, 2))] = level;
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        var_ptrs.push(Pointer(prj_addr, 1));
        var_ptrs.push(Pointer(prj_addr, 2));
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        var_ptrs.pop();
        net.link_ports(Pointer(prj_addr, 0), pair_ptr);
        return body_ptr;
      case "Ite":
        var ite_addr = net.alloc_node(ITE, 0xFFFF);
        var cond_ptr = build_net(term[1].cond, net, var_ptrs, level);
        net.link_ports(Pointer(ite_addr, 0), cond_ptr);
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        net.link_ports(Pointer(ite_addr, 1), pair_ptr);
        return Pointer(ite_addr, 2);
      case "Cpy":
        var numb_ptr = build_net(term[1].numb, net, var_ptrs, level);
        level_of[ptrn_st(numb_ptr)] = 0xFFFE;
        var_ptrs.push(numb_ptr);
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        return body_ptr;
      case "Log":
        return build_net(term[1].expr, net, var_ptrs, level);
      case "Var":
        return get_var(var_ptrs[var_ptrs.length - term[1].index - 1]);
      case "Hol":
        throw "[ERROR]\nCan't compile a hole.";
      case "Utv":
        throw "[ERROR]\nCan't compile an unrestricted term.";
      case "Ref":
        var ref_ptrn = ref_ptrs[term[1].name];
        // First time seeing this ref
        if (!ref_ptrn) {
          // Create a dup node for it and recurse
          var dup_addr = net.alloc_node(NOD, 0xFFFD);
          var ref_ptrn = Pointer(dup_addr, 1);
          ref_ptrs[term[1].name] = ref_ptrn;
          var dref = erase(defs[term[1].name]);
          var dref_ptr = build_net(dref, net, var_ptrs, level);
          net.link_ports(Pointer(dup_addr, 0), dref_ptr);
          return Pointer(dup_addr, 2);
        // Already created the dup node for this ref
        } else {
          // First use: just connect to the port 1 of the dup node
          if (ptrn_eq(net.enter_port(ref_ptrn), ref_ptrn)) {
            return ref_ptrn;
          // Other uses: extend with another dup node and connect
          } else {
            var dups_ptrn = net.enter_port(ref_ptrn);
            var dup_addr = net.alloc_node(NOD, 0xFFFD);
            net.link_ports(Pointer(dup_addr, 0), ref_ptrn);
            net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
            return Pointer(dup_addr, 2);
          }
        }
      default:
        return build_net(Lam("", null, Var(0), false), net, var_ptrs, level);
    }
  };
  var level_of = {};
  var net = new Net();
  var root_addr = net.alloc_node(NOD, 0);
  var term_ptr = build_net(term, net, [], 0);
  net.link_ports(Pointer(root_addr, 0), Pointer(root_addr, 2));
  net.link_ports(Pointer(root_addr, 1), term_ptr);
  // Removes invalid redexes. They can be created by the
  // compiler when duplicating variables more than once.
  net.redex = net.redex.filter((a_addr) => {
    var b_ptrn = net.enter_port(Pointer(a_addr, 0));
    if (type_of(b_ptrn) !== NUM) {
      var b_addr = addr_of(b_ptrn);
      var a_p0 = Pointer(a_addr, 0);
      var b_p0 = Pointer(b_addr, 0);
      var a_ok = ptrn_eq(net.enter_port(a_p0), b_p0);
      var b_ok = ptrn_eq(net.enter_port(b_p0), a_p0);
      return a_ok && b_ok;
    } else {
      return true;
    }
  });
  // Optimization: if a ref is only used once, remove the unecessary dup node
  for (var name in ref_ptrs) {
    var ref_ptrn = ref_ptrs[name];
    if (ptrn_eq(net.enter_port(ref_ptrn), ref_ptrn)) {
      var dup_addr = addr_of(ref_ptrn);
      var ref_ptrn = net.enter_port(Pointer(dup_addr, 0));
      var loc_ptrn = net.enter_port(Pointer(dup_addr, 2));
      net.link_ports(ref_ptrn, loc_ptrn);
      net.free_node(dup_addr);
    }
  }
  return net;
};

const decompile = (net) => {
  const build_term = (net, ptrn, var_ptrs, dup_exit) => {
    if (type_of(ptrn) === NUM) {
      return Val(numb_of(ptrn));
    } else {
      var addr = addr_of(ptrn);
      var type = net.type_of(addr);
      var kind = net.kind_of(addr);
      if (type === NOD) {
        if (kind === 0) {
          switch (slot_of(ptrn)) {
            case 0:
              var_ptrs.push(Pointer(addr, 1));
              var body = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
              var_ptrs.pop();
              return Lam("x" + var_ptrs.length, null, body, false);
            case 1:
              for (var index = 0; index < var_ptrs.length; ++index) {
                if (ptrn_eq(var_ptrs[var_ptrs.length - index - 1], ptrn)) {
                  return Var(index);
                }
              }
            case 2:
              var argm = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
              var func = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              return App(func, argm, false);
          }
        } else if (kind === 0xFFFF) {
          switch (slot_of(ptrn)) {
            case 0:
              var val0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
              var val1 = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
              return Par(val0, val1);
            case 1:
              var pair = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              return Fst(pair);
            case 2:
              var pair = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              return Snd(pair);
          }
        } else {
          switch (slot_of(ptrn)) {
            case 0:
              var exit = dup_exit.pop();
              var term = build_term(net, net.enter_port(Pointer(addr, exit)), var_ptrs, dup_exit);
              dup_exit.push(exit);
              return term;
            default:
              dup_exit.push(slot_of(ptrn));
              var term = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              dup_exit.pop();
              return term;
          }
        }
      } else if (type === OP1) {
        var num0 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        var num1 = Val(numb_of(net.enter_port(Pointer(addr, 1))));
        return Op1(op_kind[kind], num0, num1);
      } else if (type === OP2) {
        var num0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
        var num1 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        return Op2(op_kind[kind], num0, num1);
      } else if (type === ITE) {
        var cond = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        var pair = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
        return Ite(cond, pair);
      }
    }
  };
  return build_term(net, net.enter_port(Pointer(0, 1)), [], []);
};

const norm_with_stats = (term, defs = {}, lazy = true) => {
  var net = compile(term, defs);
  var stats = lazy ? net.reduce_lazy() : net.reduce();
  var norm = decompile(net);
  return {norm, stats};
};

const norm = (term, defs, lazy) => {
  return norm_with_stats(term, defs, lazy).norm;
};

module.exports = {compile, decompile, norm_with_stats, norm};


/***/ }),

/***/ "./node_modules/formality-lang/src/forall.js":
/*!***************************************************!*\
  !*** ./node_modules/formality-lang/src/forall.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// This module is responsible for loading and publishing files from the Forall repository
// For now this is using the deprecated moonad.org/api repository, but will be updated to the newer
// Forall API once the service is deployed and ready to be used.
//
// This also exports a few "loader decorators" to enable caching depending on the environment

const xhr = __webpack_require__(/*! xhr-request-promise */ "./node_modules/xhr-request-promise/index.js");
const version = __webpack_require__(/*! ./../package.json */ "./node_modules/formality-lang/package.json").version;

// Load file related things only on node
const {fs, path, async_read_file, async_write_file} = (
  typeof window === "object"
  ? () => ({})
  : () => {
    const {promisify} = eval('require("util")');
    const path = eval('require("path")');
    const fs = eval('require("fs")');

    const async_read_file = promisify(fs.readFile)
    const async_write_file = promisify(fs.writeFile)

    return {fs, path, async_read_file, async_write_file}
  }
)()

// load_file receives the name of the file and returns the code asyncronously
//
// load_file(file: String) -> Promise<String>
const load_file = (file) => {
  return post("load_file", {file});
};

// save_file receives the file name without the version, the code, and returns, asynchronously
// the saved global file name (with the version after the @).
//
// save_file(file: String, code: String) -> Promise<String>
const save_file = (file, code) => post("save_file", {file, code});

// Receives a file name and returns a list of parents for that file
//
// load_file_parents(file: String) -> Promise<String[]>
const load_file_parents = (file) => post("load_file_parents", {file});

// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a path to save the files
//
// with_file_system_cache(
//   loader: String -> Promise<String>,
//   cache_dir_path?: String
// ) -> Promise<String>
const with_file_system_cache = (loader, cache_dir_path) => async (file) => {
  const dir_path = cache_dir_path || get_default_fs_cache_path();
  setup_cache_dir(dir_path);
  const cached_file_path = path.join(dir_path, file + ".fm");
  if(fs.existsSync(cached_file_path)) {
    return await async_read_file(cached_file_path, "utf8");
  }

  const code = await loader(file)

  await async_write_file(cached_file_path, code, "utf8");

  return code;
}

// Transforms a file loader in order to add local files for development.
// It receives the file loader and optionally, a path where the files are
//
// with_local_files(
//   loader: String -> Promise<String>,
//   local_dir_path?: String
// ) -> Promise<String>
const with_local_files = (loader, local_dir_path) => async (file) => {
  const dir_path = local_dir_path || process.cwd();
  const local_file_path = path.join(dir_path, file + ".fm");
  const has_local_file = fs.existsSync(local_file_path);

  if(has_local_file) {
    return await async_read_file(local_file_path, "utf8");
  }

  return await loader(file);
}

// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a prefix for the local storage key
// defaulting to `FPM@${FM_VERSION}/`
//
// with_local_storage_cache(
//   loader: String -> Promise<String>,
//   prefix?: String
// ) -> Promise<String>
const with_local_storage_cache = (loader, prefix = `FPM@${version}/`) => async (file) => {
  const cached = window.localStorage.getItem(prefix + file)
  if(cached) {
    return cached;
  }

  const code = await loader(file)

  window.localStorage.setItem(prefix + file, code)

  return code;
}

module.exports = {
  load_file_parents,
  load_file,
  save_file,
  with_file_system_cache,
  with_local_files,
  with_local_storage_cache,
}

// Utils not exported

const get_default_fs_cache_path = () => path.join(process.cwd(), "fm_modules");

const setup_cache_dir = (cache_dir_path) => {
  var version_file_path = path.join(cache_dir_path, "version");
  var has_cache_dir = fs.existsSync(cache_dir_path);
  var has_version_file = has_cache_dir && fs.existsSync(version_file_path);
  var correct_version = has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
  if (!has_cache_dir || !has_version_file || !correct_version) {
    if (has_cache_dir) {
      var files = fs.readdirSync(cache_dir_path);
      for (var i = 0; i < files.length; ++i) {
        fs.unlinkSync(path.join(cache_dir_path, files[i]));
      }
      fs.rmdirSync(cache_dir_path);
    }
    fs.mkdirSync(cache_dir_path);
    fs.writeFileSync(version_file_path, version);
  }
}

// The current API is just a simple RPC, so this function helps a lot
const post = (func, body) => {
  return xhr("http://moonad.org/api/" + func,
    { method: "POST"
    , json: true
    , body})
    .then(res => {
      if (res[0] === "ok") {
        return res[1];
      } else {
        throw res[1];
      }
    });
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/global/window.js":
/*!***************************************!*\
  !*** ./node_modules/global/window.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/inferno-hyperscript/dist/index.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/inferno-hyperscript/dist/index.esm.js ***!
  \************************************************************/
/*! exports provided: h */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony import */ var inferno__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inferno */ "./node_modules/inferno/index.esm.js");


var isArray = Array.isArray;
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number';
}
function isString(o) {
    return typeof o === 'string';
}
function isUndefined(o) {
    return o === void 0;
}

var classIdSplit = /([.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;
function parseTag(tag, props) {
    if (!tag) {
        return 'div';
    }
    if (tag === inferno__WEBPACK_IMPORTED_MODULE_0__["Fragment"]) {
        return tag;
    }
    var noId = props && isUndefined(props.id);
    var tagParts = tag.split(classIdSplit);
    var tagName = null;
    if (notClassId.test(tagParts[1])) {
        tagName = 'div';
    }
    var classes;
    for (var i = 0, len = tagParts.length; i < len; ++i) {
        var part = tagParts[i];
        if (!part) {
            continue;
        }
        var type = part.charAt(0);
        if (!tagName) {
            tagName = part;
        }
        else if (type === '.') {
            if (classes === void 0) {
                classes = [];
            }
            classes.push(part.substring(1, part.length));
        }
        else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }
    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }
        props.className = classes.join(' ');
    }
    return tagName || 'div';
}
function isChildren(x) {
    return isStringOrNumber(x) || (x && isArray(x));
}
/**
 * Creates virtual node
 * @param {string|VNode|Function} _tag Name for virtual node
 * @param {object=} _props Additional properties for virtual node
 * @param {string|number|VNode|Array<string|number|VNode>|null=} _children Optional children for virtual node
 * @returns {VNode} returns new virtual node
 */
function h(_tag, _props, _children) {
    // If a child array or text node are passed as the second argument, shift them
    if (!_children && isChildren(_props)) {
        _children = _props;
        _props = {};
    }
    var isElement = isString(_tag);
    _props = _props || {};
    var tag = isElement ? parseTag(_tag, _props) : _tag;
    var newProps = {};
    var key = null;
    var ref = null;
    var children = null;
    var className = null;
    for (var prop in _props) {
        if (isElement && (prop === 'className' || prop === 'class')) {
            className = _props[prop];
        }
        else if (prop === 'key') {
            key = _props[prop];
        }
        else if (prop === 'ref') {
            ref = _props[prop];
        }
        else if (prop === 'hooks') {
            ref = _props[prop];
        }
        else if (prop === 'children') {
            children = _props[prop];
        }
        else if (!isElement && prop.substr(0, 11) === 'onComponent') {
            if (!ref) {
                ref = {};
            }
            ref[prop] = _props[prop];
        }
        else {
            newProps[prop] = _props[prop];
        }
    }
    if (isElement) {
        var flags = Object(inferno__WEBPACK_IMPORTED_MODULE_0__["getFlagsForElementVnode"])(tag);
        if (flags & 8192 /* Fragment */) {
            return Object(inferno__WEBPACK_IMPORTED_MODULE_0__["createFragment"])(_children || children, 0 /* UnknownChildren */, key);
        }
        if (newProps.contenteditable !== void 0) {
            flags |= 4096 /* ContentEditable */;
        }
        return Object(inferno__WEBPACK_IMPORTED_MODULE_0__["createVNode"])(flags, tag, className, _children || children, 0 /* UnknownChildren */, newProps, key, ref);
    }
    if (children || _children) {
        newProps.children = children || _children;
    }
    return Object(inferno__WEBPACK_IMPORTED_MODULE_0__["createComponentVNode"])(2 /* ComponentUnknown */, tag, newProps, key, ref);
}




/***/ }),

/***/ "./node_modules/inferno/dist/index.esm.js":
/*!************************************************!*\
  !*** ./node_modules/inferno/dist/index.esm.js ***!
  \************************************************/
/*! exports provided: Component, EMPTY_OBJ, Fragment, _CI, _HI, _M, _MCCC, _ME, _MFCC, _MP, _MR, __render, createComponentVNode, createFragment, createPortal, createRef, createRenderer, createTextVNode, createVNode, directClone, findDOMfromVNode, forwardRef, getFlagsForElementVnode, linkEvent, normalizeProps, options, render, rerender, version */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY_OBJ", function() { return EMPTY_OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return Fragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_CI", function() { return createClassComponentInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_HI", function() { return normalizeRoot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_M", function() { return mount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_MCCC", function() { return mountClassComponentCallbacks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_ME", function() { return mountElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_MFCC", function() { return mountFunctionalComponentCallbacks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_MP", function() { return mountProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_MR", function() { return mountRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__render", function() { return __render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createComponentVNode", function() { return createComponentVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFragment", function() { return createFragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createPortal", function() { return createPortal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return createRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRenderer", function() { return createRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTextVNode", function() { return createTextVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createVNode", function() { return createVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "directClone", function() { return directClone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findDOMfromVNode", function() { return findDOMfromVNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forwardRef", function() { return forwardRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFlagsForElementVnode", function() { return getFlagsForElementVnode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linkEvent", function() { return linkEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeProps", function() { return normalizeProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rerender", function() { return rerender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
var isArray = Array.isArray;
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number';
}
function isNullOrUndef(o) {
    return o === void 0 || o === null;
}
function isInvalid(o) {
    return o === null || o === false || o === true || o === void 0;
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
}
function isNull(o) {
    return o === null;
}
function isUndefined(o) {
    return o === void 0;
}
function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key$1 in second) {
            out[key$1] = second[key$1];
        }
    }
    return out;
}

/**
 * Links given data to event as first parameter
 * @param {*} data data to be linked, it will be available in function as first parameter
 * @param {Function} event Function to be called when event occurs
 * @returns {{data: *, event: Function}}
 */
function linkEvent(data, event) {
    if (isFunction(event)) {
        return { data: data, event: event };
    }
    return null; // Return null when event is invalid, to avoid creating unnecessary event handlers
}
// object.event should always be function, otherwise its badly created object.
function isLinkEventObject(o) {
    return !isNull(o) && typeof o === 'object';
}

// We need EMPTY_OBJ defined in one place.
// Its used for comparison so we cant inline it into shared
var EMPTY_OBJ = {};
var Fragment = '$F';
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function appendChild(parentDOM, dom) {
    parentDOM.appendChild(dom);
}
function insertOrAppend(parentDOM, newNode, nextNode) {
    if (isNull(nextNode)) {
        appendChild(parentDOM, newNode);
    }
    else {
        parentDOM.insertBefore(newNode, nextNode);
    }
}
function documentCreateElement(tag, isSVG) {
    if (isSVG) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }
    return document.createElement(tag);
}
function replaceChild(parentDOM, newDom, lastDom) {
    parentDOM.replaceChild(newDom, lastDom);
}
function removeChild(parentDOM, childNode) {
    parentDOM.removeChild(childNode);
}
function callAll(arrayFn) {
    var listener;
    while ((listener = arrayFn.shift()) !== undefined) {
        listener();
    }
}
function findChildVNode(vNode, startEdge, flags) {
    var children = vNode.children;
    if (flags & 4 /* ComponentClass */) {
        return children.$LI;
    }
    if (flags & 8192 /* Fragment */) {
        return vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[startEdge ? 0 : children.length - 1];
    }
    return children;
}
function findDOMfromVNode(vNode, startEdge) {
    var flags;
    while (vNode) {
        flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            return vNode.dom;
        }
        vNode = findChildVNode(vNode, startEdge, flags);
    }
    return null;
}
function removeVNodeDOM(vNode, parentDOM) {
    do {
        var flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            removeChild(parentDOM, vNode.dom);
            return;
        }
        var children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        if (flags & 8 /* ComponentFunction */) {
            vNode = children;
        }
        if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                vNode = children;
            }
            else {
                for (var i = 0, len = children.length; i < len; ++i) {
                    removeVNodeDOM(children[i], parentDOM);
                }
                return;
            }
        }
    } while (vNode);
}
function moveVNodeDOM(vNode, parentDOM, nextNode) {
    do {
        var flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            insertOrAppend(parentDOM, vNode.dom, nextNode);
            return;
        }
        var children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        if (flags & 8 /* ComponentFunction */) {
            vNode = children;
        }
        if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                vNode = children;
            }
            else {
                for (var i = 0, len = children.length; i < len; ++i) {
                    moveVNodeDOM(children[i], parentDOM, nextNode);
                }
                return;
            }
        }
    } while (vNode);
}
function createDerivedState(instance, nextProps, state) {
    if (instance.constructor.getDerivedStateFromProps) {
        return combineFrom(state, instance.constructor.getDerivedStateFromProps(nextProps, state));
    }
    return state;
}
var renderCheck = {
    v: false
};
var options = {
    componentComparator: null,
    createVNode: null,
    renderComplete: null
};
function setTextContent(dom, children) {
    dom.textContent = children;
}
// Calling this function assumes, nextValue is linkEvent
function isLastValueSameLinkEvent(lastValue, nextValue) {
    return (isLinkEventObject(lastValue) &&
        lastValue.event === nextValue.event &&
        lastValue.data === nextValue.data);
}
function mergeUnsetProperties(to, from) {
    for (var propName in from) {
        if (isUndefined(to[propName])) {
            to[propName] = from[propName];
        }
    }
    return to;
}
function safeCall1(method, arg1) {
    return !!isFunction(method) && (method(arg1), true);
}

var keyPrefix = '$';
function V(childFlags, children, className, flags, key, props, ref, type) {
    this.childFlags = childFlags;
    this.children = children;
    this.className = className;
    this.dom = null;
    this.flags = flags;
    this.key = key === void 0 ? null : key;
    this.props = props === void 0 ? null : props;
    this.ref = ref === void 0 ? null : ref;
    this.type = type;
}
function createVNode(flags, type, className, children, childFlags, props, key, ref) {
    var childFlag = childFlags === void 0 ? 1 /* HasInvalidChildren */ : childFlags;
    var vNode = new V(childFlag, children, className, flags, key, props, ref, type);
    if (options.createVNode) {
        options.createVNode(vNode);
    }
    if (childFlag === 0 /* UnknownChildren */) {
        normalizeChildren(vNode, vNode.children);
    }
    return vNode;
}
function mergeDefaultHooks(flags, type, ref) {
    if (flags & 4 /* ComponentClass */) {
        return ref;
    }
    var defaultHooks = (flags & 32768 /* ForwardRef */ ? type.render : type).defaultHooks;
    if (isNullOrUndef(defaultHooks)) {
        return ref;
    }
    if (isNullOrUndef(ref)) {
        return defaultHooks;
    }
    return mergeUnsetProperties(ref, defaultHooks);
}
function mergeDefaultProps(flags, type, props) {
    // set default props
    var defaultProps = (flags & 32768 /* ForwardRef */ ? type.render : type).defaultProps;
    if (isNullOrUndef(defaultProps)) {
        return props;
    }
    if (isNullOrUndef(props)) {
        return combineFrom(defaultProps, null);
    }
    return mergeUnsetProperties(props, defaultProps);
}
function resolveComponentFlags(flags, type) {
    if (flags & 12 /* ComponentKnown */) {
        return flags;
    }
    if (type.prototype && type.prototype.render) {
        return 4 /* ComponentClass */;
    }
    if (type.render) {
        return 32776 /* ForwardRefComponent */;
    }
    return 8 /* ComponentFunction */;
}
function createComponentVNode(flags, type, props, key, ref) {
    flags = resolveComponentFlags(flags, type);
    var vNode = new V(1 /* HasInvalidChildren */, null, null, flags, key, mergeDefaultProps(flags, type, props), mergeDefaultHooks(flags, type, ref), type);
    if (options.createVNode) {
        options.createVNode(vNode);
    }
    return vNode;
}
function createTextVNode(text, key) {
    return new V(1 /* HasInvalidChildren */, isNullOrUndef(text) || text === true || text === false ? '' : text, null, 16 /* Text */, key, null, null, null);
}
function createFragment(children, childFlags, key) {
    var fragment = createVNode(8192 /* Fragment */, 8192 /* Fragment */, null, children, childFlags, null, key, null);
    switch (fragment.childFlags) {
        case 1 /* HasInvalidChildren */:
            fragment.children = createVoidVNode();
            fragment.childFlags = 2 /* HasVNodeChildren */;
            break;
        case 16 /* HasTextChildren */:
            fragment.children = [createTextVNode(children)];
            fragment.childFlags = 4 /* HasNonKeyedChildren */;
            break;
        default:
            break;
    }
    return fragment;
}
function normalizeProps(vNode) {
    var props = vNode.props;
    if (props) {
        var flags = vNode.flags;
        if (flags & 481 /* Element */) {
            if (props.children !== void 0 && isNullOrUndef(vNode.children)) {
                normalizeChildren(vNode, props.children);
            }
            if (props.className !== void 0) {
                vNode.className = props.className || null;
                props.className = undefined;
            }
        }
        if (props.key !== void 0) {
            vNode.key = props.key;
            props.key = undefined;
        }
        if (props.ref !== void 0) {
            if (flags & 8 /* ComponentFunction */) {
                vNode.ref = combineFrom(vNode.ref, props.ref);
            }
            else {
                vNode.ref = props.ref;
            }
            props.ref = undefined;
        }
    }
    return vNode;
}
/*
 * Fragment is different than normal vNode,
 * because when it needs to be cloned we need to clone its children too
 * But not normalize, because otherwise those possibly get KEY and re-mount
 */
function cloneFragment(vNodeToClone) {
    var clonedChildren;
    var oldChildren = vNodeToClone.children;
    var childFlags = vNodeToClone.childFlags;
    if (childFlags === 2 /* HasVNodeChildren */) {
        clonedChildren = directClone(oldChildren);
    }
    else if (childFlags & 12 /* MultipleChildren */) {
        clonedChildren = [];
        for (var i = 0, len = oldChildren.length; i < len; ++i) {
            clonedChildren.push(directClone(oldChildren[i]));
        }
    }
    return createFragment(clonedChildren, childFlags, vNodeToClone.key);
}
function directClone(vNodeToClone) {
    var flags = vNodeToClone.flags & -16385 /* ClearInUse */;
    var props = vNodeToClone.props;
    if (flags & 14 /* Component */) {
        if (!isNull(props)) {
            var propsToClone = props;
            props = {};
            for (var key in propsToClone) {
                props[key] = propsToClone[key];
            }
        }
    }
    if ((flags & 8192 /* Fragment */) === 0) {
        return new V(vNodeToClone.childFlags, vNodeToClone.children, vNodeToClone.className, flags, vNodeToClone.key, props, vNodeToClone.ref, vNodeToClone.type);
    }
    return cloneFragment(vNodeToClone);
}
function createVoidVNode() {
    return createTextVNode('', null);
}
function createPortal(children, container) {
    var normalizedRoot = normalizeRoot(children);
    return createVNode(1024 /* Portal */, 1024 /* Portal */, null, normalizedRoot, 0 /* UnknownChildren */, null, normalizedRoot.key, container);
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        if (!isInvalid(n)) {
            var newKey = currentKey + keyPrefix + index;
            if (isArray(n)) {
                _normalizeVNodes(n, result, 0, newKey);
            }
            else {
                if (isStringOrNumber(n)) {
                    n = createTextVNode(n, newKey);
                }
                else {
                    var oldKey = n.key;
                    var isPrefixedKey = isString(oldKey) && oldKey[0] === keyPrefix;
                    if (n.flags & 81920 /* InUseOrNormalized */ || isPrefixedKey) {
                        n = directClone(n);
                    }
                    n.flags |= 65536 /* Normalized */;
                    if (!isPrefixedKey) {
                        if (isNull(oldKey)) {
                            n.key = newKey;
                        }
                        else {
                            n.key = currentKey + oldKey;
                        }
                    }
                    else if (oldKey.substring(0, currentKey.length) !== currentKey) {
                        n.key = currentKey + oldKey;
                    }
                }
                result.push(n);
            }
        }
    }
}
function getFlagsForElementVnode(type) {
    switch (type) {
        case 'svg':
            return 32 /* SvgElement */;
        case 'input':
            return 64 /* InputElement */;
        case 'select':
            return 256 /* SelectElement */;
        case 'textarea':
            return 128 /* TextareaElement */;
        case Fragment:
            return 8192 /* Fragment */;
        default:
            return 1 /* HtmlElement */;
    }
}
function normalizeChildren(vNode, children) {
    var newChildren;
    var newChildFlags = 1 /* HasInvalidChildren */;
    // Don't change children to match strict equal (===) true in patching
    if (isInvalid(children)) {
        newChildren = children;
    }
    else if (isStringOrNumber(children)) {
        newChildFlags = 16 /* HasTextChildren */;
        newChildren = children;
    }
    else if (isArray(children)) {
        var len = children.length;
        for (var i = 0; i < len; ++i) {
            var n = children[i];
            if (isInvalid(n) || isArray(n)) {
                newChildren = newChildren || children.slice(0, i);
                _normalizeVNodes(children, newChildren, i, '');
                break;
            }
            else if (isStringOrNumber(n)) {
                newChildren = newChildren || children.slice(0, i);
                newChildren.push(createTextVNode(n, keyPrefix + i));
            }
            else {
                var key = n.key;
                var needsCloning = (n.flags & 81920 /* InUseOrNormalized */) > 0;
                var isNullKey = isNull(key);
                var isPrefixed = isString(key) && key[0] === keyPrefix;
                if (needsCloning || isNullKey || isPrefixed) {
                    newChildren = newChildren || children.slice(0, i);
                    if (needsCloning || isPrefixed) {
                        n = directClone(n);
                    }
                    if (isNullKey || isPrefixed) {
                        n.key = keyPrefix + i;
                    }
                    newChildren.push(n);
                }
                else if (newChildren) {
                    newChildren.push(n);
                }
                n.flags |= 65536 /* Normalized */;
            }
        }
        newChildren = newChildren || children;
        if (newChildren.length === 0) {
            newChildFlags = 1 /* HasInvalidChildren */;
        }
        else {
            newChildFlags = 8 /* HasKeyedChildren */;
        }
    }
    else {
        newChildren = children;
        newChildren.flags |= 65536 /* Normalized */;
        if (children.flags & 81920 /* InUseOrNormalized */) {
            newChildren = directClone(children);
        }
        newChildFlags = 2 /* HasVNodeChildren */;
    }
    vNode.children = newChildren;
    vNode.childFlags = newChildFlags;
    return vNode;
}
function normalizeRoot(input) {
    if (isInvalid(input) || isStringOrNumber(input)) {
        return createTextVNode(input, null);
    }
    if (isArray(input)) {
        return createFragment(input, 0 /* UnknownChildren */, null);
    }
    return input.flags & 16384 /* InUse */ ? directClone(input) : input;
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var namespaces = {
    'xlink:actuate': xlinkNS,
    'xlink:arcrole': xlinkNS,
    'xlink:href': xlinkNS,
    'xlink:role': xlinkNS,
    'xlink:show': xlinkNS,
    'xlink:title': xlinkNS,
    'xlink:type': xlinkNS,
    'xml:base': xmlNS,
    'xml:lang': xmlNS,
    'xml:space': xmlNS
};

function getDelegatedEventObject(v) {
    return {
        onClick: v,
        onDblClick: v,
        onFocusIn: v,
        onFocusOut: v,
        onKeyDown: v,
        onKeyPress: v,
        onKeyUp: v,
        onMouseDown: v,
        onMouseMove: v,
        onMouseUp: v,
        onTouchEnd: v,
        onTouchMove: v,
        onTouchStart: v
    };
}
var attachedEventCounts = getDelegatedEventObject(0);
var attachedEvents = getDelegatedEventObject(null);
var syntheticEvents = getDelegatedEventObject(true);
function updateOrAddSyntheticEvent(name, dom) {
    var eventsObject = dom.$EV;
    if (!eventsObject) {
        eventsObject = dom.$EV = getDelegatedEventObject(null);
    }
    if (!eventsObject[name]) {
        if (++attachedEventCounts[name] === 1) {
            attachedEvents[name] = attachEventToDocument(name);
        }
    }
    return eventsObject;
}
function unmountSyntheticEvent(name, dom) {
    var eventsObject = dom.$EV;
    if (eventsObject && eventsObject[name]) {
        if (--attachedEventCounts[name] === 0) {
            document.removeEventListener(normalizeEventName(name), attachedEvents[name]);
            attachedEvents[name] = null;
        }
        eventsObject[name] = null;
    }
}
function handleSyntheticEvent(name, lastEvent, nextEvent, dom) {
    if (isFunction(nextEvent)) {
        updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
    }
    else if (isLinkEventObject(nextEvent)) {
        if (isLastValueSameLinkEvent(lastEvent, nextEvent)) {
            return;
        }
        updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
    }
    else {
        unmountSyntheticEvent(name, dom);
    }
}
// When browsers fully support event.composedPath we could loop it through instead of using parentNode property
function getTargetNode(event) {
    return isFunction(event.composedPath) ? event.composedPath()[0] : event.target;
}
function dispatchEvents(event, isClick, name, eventData) {
    var dom = getTargetNode(event);
    do {
        // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
        // because the event listener is on document.body
        // Don't process clicks on disabled elements
        if (isClick && dom.disabled) {
            return;
        }
        var eventsObject = dom.$EV;
        if (eventsObject) {
            var currentEvent = eventsObject[name];
            if (currentEvent) {
                // linkEvent object
                eventData.dom = dom;
                currentEvent.event ? currentEvent.event(currentEvent.data, event) : currentEvent(event);
                if (event.cancelBubble) {
                    return;
                }
            }
        }
        dom = dom.parentNode;
    } while (!isNull(dom));
}
function stopPropagation() {
    this.cancelBubble = true;
    if (!this.immediatePropagationStopped) {
        this.stopImmediatePropagation();
    }
}
function isDefaultPrevented() {
    return this.defaultPrevented;
}
function isPropagationStopped() {
    return this.cancelBubble;
}
function extendEventProperties(event) {
    // Event data needs to be object to save reference to currentTarget getter
    var eventData = {
        dom: document
    };
    event.isDefaultPrevented = isDefaultPrevented;
    event.isPropagationStopped = isPropagationStopped;
    event.stopPropagation = stopPropagation;
    Object.defineProperty(event, 'currentTarget', {
        configurable: true,
        get: function get() {
            return eventData.dom;
        }
    });
    return eventData;
}
function rootClickEvent(name) {
    return function (event) {
        if (event.button !== 0) {
            // Firefox incorrectly triggers click event for mid/right mouse buttons.
            // This bug has been active for 17 years.
            // https://bugzilla.mozilla.org/show_bug.cgi?id=184051
            event.stopPropagation();
            return;
        }
        dispatchEvents(event, true, name, extendEventProperties(event));
    };
}
function rootEvent(name) {
    return function (event) {
        dispatchEvents(event, false, name, extendEventProperties(event));
    };
}
function attachEventToDocument(name) {
    var attachedEvent = name === 'onClick' || name === 'onDblClick' ? rootClickEvent(name) : rootEvent(name);
    document.addEventListener(normalizeEventName(name), attachedEvent);
    return attachedEvent;
}

function isSameInnerHTML(dom, innerHTML) {
    var tempdom = document.createElement('i');
    tempdom.innerHTML = innerHTML;
    return tempdom.innerHTML === dom.innerHTML;
}

function triggerEventListener(props, methodName, e) {
    if (props[methodName]) {
        var listener = props[methodName];
        if (listener.event) {
            listener.event(listener.data, e);
        }
        else {
            listener(e);
        }
    }
    else {
        var nativeListenerName = methodName.toLowerCase();
        if (props[nativeListenerName]) {
            props[nativeListenerName](e);
        }
    }
}
function createWrappedFunction(methodName, applyValue) {
    var fnMethod = function (e) {
        var vNode = this.$V;
        // If vNode is gone by the time event fires, no-op
        if (!vNode) {
            return;
        }
        var props = vNode.props || EMPTY_OBJ;
        var dom = vNode.dom;
        if (isString(methodName)) {
            triggerEventListener(props, methodName, e);
        }
        else {
            for (var i = 0; i < methodName.length; ++i) {
                triggerEventListener(props, methodName[i], e);
            }
        }
        if (isFunction(applyValue)) {
            var newVNode = this.$V;
            var newProps = newVNode.props || EMPTY_OBJ;
            applyValue(newProps, dom, false, newVNode);
        }
    };
    Object.defineProperty(fnMethod, 'wrapped', {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false
    });
    return fnMethod;
}

function attachEvent(dom, eventName, handler) {
    var previousKey = "$" + eventName;
    var previousArgs = dom[previousKey];
    if (previousArgs) {
        if (previousArgs[1].wrapped) {
            return;
        }
        dom.removeEventListener(previousArgs[0], previousArgs[1]);
        dom[previousKey] = null;
    }
    if (isFunction(handler)) {
        dom.addEventListener(eventName, handler);
        dom[previousKey] = [eventName, handler];
    }
}

function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
var onTextInputChange = createWrappedFunction('onInput', applyValueInput);
var wrappedOnChange = createWrappedFunction(['onClick', 'onChange'], applyValueInput);
/* tslint:disable-next-line:no-empty */
function emptywrapper(event) {
    event.stopPropagation();
}
emptywrapper.wrapped = true;
function inputEvents(dom, nextPropsOrEmpty) {
    if (isCheckedType(nextPropsOrEmpty.type)) {
        attachEvent(dom, 'change', wrappedOnChange);
        attachEvent(dom, 'click', emptywrapper);
    }
    else {
        attachEvent(dom, 'input', onTextInputChange);
    }
}
function applyValueInput(nextPropsOrEmpty, dom) {
    var type = nextPropsOrEmpty.type;
    var value = nextPropsOrEmpty.value;
    var checked = nextPropsOrEmpty.checked;
    var multiple = nextPropsOrEmpty.multiple;
    var defaultValue = nextPropsOrEmpty.defaultValue;
    var hasValue = !isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.setAttribute('type', type);
    }
    if (!isNullOrUndef(multiple) && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
    else {
        if (hasValue && dom.value !== value) {
            dom.defaultValue = value;
            dom.value = value;
        }
        else if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}

function updateChildOptions(vNode, value) {
    if (vNode.type === 'option') {
        updateChildOption(vNode, value);
    }
    else {
        var children = vNode.children;
        var flags = vNode.flags;
        if (flags & 4 /* ComponentClass */) {
            updateChildOptions(children.$LI, value);
        }
        else if (flags & 8 /* ComponentFunction */) {
            updateChildOptions(children, value);
        }
        else if (vNode.childFlags === 2 /* HasVNodeChildren */) {
            updateChildOptions(children, value);
        }
        else if (vNode.childFlags & 12 /* MultipleChildren */) {
            for (var i = 0, len = children.length; i < len; ++i) {
                updateChildOptions(children[i], value);
            }
        }
    }
}
function updateChildOption(vNode, value) {
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    // we do this as multiple may have changed
    dom.value = props.value;
    if (props.value === value || (isArray(value) && value.indexOf(props.value) !== -1)) {
        dom.selected = true;
    }
    else if (!isNullOrUndef(value) || !isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
var onSelectChange = createWrappedFunction('onChange', applyValueSelect);
function selectEvents(dom) {
    attachEvent(dom, 'change', onSelectChange);
}
function applyValueSelect(nextPropsOrEmpty, dom, mounting, vNode) {
    var multiplePropInBoolean = Boolean(nextPropsOrEmpty.multiple);
    if (!isNullOrUndef(nextPropsOrEmpty.multiple) && multiplePropInBoolean !== dom.multiple) {
        dom.multiple = multiplePropInBoolean;
    }
    var index = nextPropsOrEmpty.selectedIndex;
    if (index === -1) {
        dom.selectedIndex = -1;
    }
    var childFlags = vNode.childFlags;
    if (childFlags !== 1 /* HasInvalidChildren */) {
        var value = nextPropsOrEmpty.value;
        if (isNumber(index) && index > -1 && dom.options[index]) {
            value = dom.options[index].value;
        }
        if (mounting && isNullOrUndef(value)) {
            value = nextPropsOrEmpty.defaultValue;
        }
        updateChildOptions(vNode, value);
    }
}

var onTextareaInputChange = createWrappedFunction('onInput', applyValueTextArea);
var wrappedOnChange$1 = createWrappedFunction('onChange');
function textAreaEvents(dom, nextPropsOrEmpty) {
    attachEvent(dom, 'input', onTextareaInputChange);
    if (nextPropsOrEmpty.onChange) {
        attachEvent(dom, 'change', wrappedOnChange$1);
    }
}
function applyValueTextArea(nextPropsOrEmpty, dom, mounting) {
    var value = nextPropsOrEmpty.value;
    var domValue = dom.value;
    if (isNullOrUndef(value)) {
        if (mounting) {
            var defaultValue = nextPropsOrEmpty.defaultValue;
            if (!isNullOrUndef(defaultValue) && defaultValue !== domValue) {
                dom.defaultValue = defaultValue;
                dom.value = defaultValue;
            }
        }
    }
    else if (domValue !== value) {
        /* There is value so keep it controlled */
        dom.defaultValue = value;
        dom.value = value;
    }
}

/**
 * There is currently no support for switching same input between controlled and nonControlled
 * If that ever becomes a real issue, then re design controlled elements
 * Currently user must choose either controlled or non-controlled and stick with that
 */
function processElement(flags, vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    if (flags & 64 /* InputElement */) {
        applyValueInput(nextPropsOrEmpty, dom);
    }
    else if (flags & 256 /* SelectElement */) {
        applyValueSelect(nextPropsOrEmpty, dom, mounting, vNode);
    }
    else if (flags & 128 /* TextareaElement */) {
        applyValueTextArea(nextPropsOrEmpty, dom, mounting);
    }
    if (isControlled) {
        dom.$V = vNode;
    }
}
function addFormElementEventHandlers(flags, dom, nextPropsOrEmpty) {
    if (flags & 64 /* InputElement */) {
        inputEvents(dom, nextPropsOrEmpty);
    }
    else if (flags & 256 /* SelectElement */) {
        selectEvents(dom);
    }
    else if (flags & 128 /* TextareaElement */) {
        textAreaEvents(dom, nextPropsOrEmpty);
    }
}
function isControlledFormElement(nextPropsOrEmpty) {
    return nextPropsOrEmpty.type && isCheckedType(nextPropsOrEmpty.type) ? !isNullOrUndef(nextPropsOrEmpty.checked) : !isNullOrUndef(nextPropsOrEmpty.value);
}

function createRef() {
    return {
        current: null
    };
}
function forwardRef(render) {
    return {
        render: render
    };
}
function unmountRef(ref) {
    if (ref) {
        if (!safeCall1(ref, null) && ref.current) {
            ref.current = null;
        }
    }
}
function mountRef(ref, value, lifecycle) {
    if (ref && (isFunction(ref) || ref.current !== void 0)) {
        lifecycle.push(function () {
            if (!safeCall1(ref, value) && ref.current !== void 0) {
                ref.current = value;
            }
        });
    }
}

function remove(vNode, parentDOM) {
    unmount(vNode);
    removeVNodeDOM(vNode, parentDOM);
}
function unmount(vNode) {
    var flags = vNode.flags;
    var children = vNode.children;
    var ref;
    if (flags & 481 /* Element */) {
        ref = vNode.ref;
        var props = vNode.props;
        unmountRef(ref);
        var childFlags = vNode.childFlags;
        if (!isNull(props)) {
            var keys = Object.keys(props);
            for (var i = 0, len = keys.length; i < len; i++) {
                var key = keys[i];
                if (syntheticEvents[key]) {
                    unmountSyntheticEvent(key, vNode.dom);
                }
            }
        }
        if (childFlags & 12 /* MultipleChildren */) {
            unmountAllChildren(children);
        }
        else if (childFlags === 2 /* HasVNodeChildren */) {
            unmount(children);
        }
    }
    else if (children) {
        if (flags & 4 /* ComponentClass */) {
            if (isFunction(children.componentWillUnmount)) {
                children.componentWillUnmount();
            }
            unmountRef(vNode.ref);
            children.$UN = true;
            unmount(children.$LI);
        }
        else if (flags & 8 /* ComponentFunction */) {
            ref = vNode.ref;
            if (!isNullOrUndef(ref) && isFunction(ref.onComponentWillUnmount)) {
                ref.onComponentWillUnmount(findDOMfromVNode(vNode, true), vNode.props || EMPTY_OBJ);
            }
            unmount(children);
        }
        else if (flags & 1024 /* Portal */) {
            remove(children, vNode.ref);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags & 12 /* MultipleChildren */) {
                unmountAllChildren(children);
            }
        }
    }
}
function unmountAllChildren(children) {
    for (var i = 0, len = children.length; i < len; ++i) {
        unmount(children[i]);
    }
}
function clearDOM(dom) {
    // Optimization for clearing dom
    dom.textContent = '';
}
function removeAllChildren(dom, vNode, children) {
    unmountAllChildren(children);
    if (vNode.flags & 8192 /* Fragment */) {
        removeVNodeDOM(vNode, dom);
    }
    else {
        clearDOM(dom);
    }
}

function wrapLinkEvent(nextValue) {
    // This variable makes sure there is no "this" context in callback
    var ev = nextValue.event;
    return function (e) {
        ev(nextValue.data, e);
    };
}
function patchEvent(name, lastValue, nextValue, dom) {
    if (isLinkEventObject(nextValue)) {
        if (isLastValueSameLinkEvent(lastValue, nextValue)) {
            return;
        }
        nextValue = wrapLinkEvent(nextValue);
    }
    attachEvent(dom, normalizeEventName(name), nextValue);
}
// We are assuming here that we come from patchProp routine
// -nextAttrValue cannot be null or undefined
function patchStyle(lastAttrValue, nextAttrValue, dom) {
    if (isNullOrUndef(nextAttrValue)) {
        dom.removeAttribute('style');
        return;
    }
    var domStyle = dom.style;
    var style;
    var value;
    if (isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    if (!isNullOrUndef(lastAttrValue) && !isString(lastAttrValue)) {
        for (style in nextAttrValue) {
            // do not add a hasOwnProperty check here, it affects performance
            value = nextAttrValue[style];
            if (value !== lastAttrValue[style]) {
                domStyle.setProperty(style, value);
            }
        }
        for (style in lastAttrValue) {
            if (isNullOrUndef(nextAttrValue[style])) {
                domStyle.removeProperty(style);
            }
        }
    }
    else {
        for (style in nextAttrValue) {
            value = nextAttrValue[style];
            domStyle.setProperty(style, value);
        }
    }
}
function patchDangerInnerHTML(lastValue, nextValue, lastVNode, dom) {
    var lastHtml = (lastValue && lastValue.__html) || '';
    var nextHtml = (nextValue && nextValue.__html) || '';
    if (lastHtml !== nextHtml) {
        if (!isNullOrUndef(nextHtml) && !isSameInnerHTML(dom, nextHtml)) {
            if (!isNull(lastVNode)) {
                if (lastVNode.childFlags & 12 /* MultipleChildren */) {
                    unmountAllChildren(lastVNode.children);
                }
                else if (lastVNode.childFlags === 2 /* HasVNodeChildren */) {
                    unmount(lastVNode.children);
                }
                lastVNode.children = null;
                lastVNode.childFlags = 1 /* HasInvalidChildren */;
            }
            dom.innerHTML = nextHtml;
        }
    }
}
function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue, lastVNode) {
    switch (prop) {
        case 'children':
        case 'childrenType':
        case 'className':
        case 'defaultValue':
        case 'key':
        case 'multiple':
        case 'ref':
        case 'selectedIndex':
            break;
        case 'autoFocus':
            dom.autofocus = !!nextValue;
            break;
        case 'allowfullscreen':
        case 'autoplay':
        case 'capture':
        case 'checked':
        case 'controls':
        case 'default':
        case 'disabled':
        case 'hidden':
        case 'indeterminate':
        case 'loop':
        case 'muted':
        case 'novalidate':
        case 'open':
        case 'readOnly':
        case 'required':
        case 'reversed':
        case 'scoped':
        case 'seamless':
        case 'selected':
            dom[prop] = !!nextValue;
            break;
        case 'defaultChecked':
        case 'value':
        case 'volume':
            if (hasControlledValue && prop === 'value') {
                break;
            }
            var value = isNullOrUndef(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
            break;
        case 'style':
            patchStyle(lastValue, nextValue, dom);
            break;
        case 'dangerouslySetInnerHTML':
            patchDangerInnerHTML(lastValue, nextValue, lastVNode, dom);
            break;
        default:
            if (syntheticEvents[prop]) {
                handleSyntheticEvent(prop, lastValue, nextValue, dom);
            }
            else if (prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110) {
                patchEvent(prop, lastValue, nextValue, dom);
            }
            else if (isNullOrUndef(nextValue)) {
                dom.removeAttribute(prop);
            }
            else if (isSVG && namespaces[prop]) {
                // We optimize for isSVG being false
                // If we end up in this path we can read property again
                dom.setAttributeNS(namespaces[prop], prop, nextValue);
            }
            else {
                dom.setAttribute(prop, nextValue);
            }
            break;
    }
}
function mountProps(vNode, flags, props, dom, isSVG) {
    var hasControlledValue = false;
    var isFormElement = (flags & 448 /* FormElement */) > 0;
    if (isFormElement) {
        hasControlledValue = isControlledFormElement(props);
        if (hasControlledValue) {
            addFormElementEventHandlers(flags, dom, props);
        }
    }
    for (var prop in props) {
        // do not add a hasOwnProperty check here, it affects performance
        patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue, null);
    }
    if (isFormElement) {
        processElement(flags, vNode, dom, props, true, hasControlledValue);
    }
}

function renderNewInput(instance, props, context) {
    var nextInput = normalizeRoot(instance.render(props, instance.state, context));
    var childContext = context;
    if (isFunction(instance.getChildContext)) {
        childContext = combineFrom(context, instance.getChildContext());
    }
    instance.$CX = childContext;
    return nextInput;
}
function createClassComponentInstance(vNode, Component, props, context, isSVG, lifecycle) {
    var instance = new Component(props, context);
    var usesNewAPI = (instance.$N = Boolean(Component.getDerivedStateFromProps || instance.getSnapshotBeforeUpdate));
    instance.$SVG = isSVG;
    instance.$L = lifecycle;
    vNode.children = instance;
    instance.$BS = false;
    instance.context = context;
    if (instance.props === EMPTY_OBJ) {
        instance.props = props;
    }
    if (!usesNewAPI) {
        if (isFunction(instance.componentWillMount)) {
            instance.$BR = true;
            instance.componentWillMount();
            var pending = instance.$PS;
            if (!isNull(pending)) {
                var state = instance.state;
                if (isNull(state)) {
                    instance.state = pending;
                }
                else {
                    for (var key in pending) {
                        state[key] = pending[key];
                    }
                }
                instance.$PS = null;
            }
            instance.$BR = false;
        }
    }
    else {
        instance.state = createDerivedState(instance, props, instance.state);
    }
    instance.$LI = renderNewInput(instance, props, context);
    return instance;
}

function mount(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var flags = (vNode.flags |= 16384 /* InUse */);
    if (flags & 481 /* Element */) {
        mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 4 /* ComponentClass */) {
        mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 8 /* ComponentFunction */) {
        mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
        mountFunctionalComponentCallbacks(vNode, lifecycle);
    }
    else if (flags & 512 /* Void */ || flags & 16 /* Text */) {
        mountText(vNode, parentDOM, nextNode);
    }
    else if (flags & 8192 /* Fragment */) {
        mountFragment(vNode, context, parentDOM, isSVG, nextNode, lifecycle);
    }
    else if (flags & 1024 /* Portal */) {
        mountPortal(vNode, context, parentDOM, nextNode, lifecycle);
    }
}
function mountPortal(vNode, context, parentDOM, nextNode, lifecycle) {
    mount(vNode.children, vNode.ref, context, false, null, lifecycle);
    var placeHolderVNode = createVoidVNode();
    mountText(placeHolderVNode, parentDOM, nextNode);
    vNode.dom = placeHolderVNode.dom;
}
function mountFragment(vNode, context, parentDOM, isSVG, nextNode, lifecycle) {
    var children = vNode.children;
    var childFlags = vNode.childFlags;
    // When fragment is optimized for multiple children, check if there is no children and change flag to invalid
    // This is the only normalization always done, to keep optimization flags API same for fragments and regular elements
    if (childFlags & 12 /* MultipleChildren */ && children.length === 0) {
        childFlags = vNode.childFlags = 2 /* HasVNodeChildren */;
        children = vNode.children = createVoidVNode();
    }
    if (childFlags === 2 /* HasVNodeChildren */) {
        mount(children, parentDOM, nextNode, isSVG, nextNode, lifecycle);
    }
    else {
        mountArrayChildren(children, parentDOM, context, isSVG, nextNode, lifecycle);
    }
}
function mountText(vNode, parentDOM, nextNode) {
    var dom = (vNode.dom = document.createTextNode(vNode.children));
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
}
function mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var flags = vNode.flags;
    var props = vNode.props;
    var className = vNode.className;
    var children = vNode.children;
    var childFlags = vNode.childFlags;
    var dom = (vNode.dom = documentCreateElement(vNode.type, (isSVG = isSVG || (flags & 32 /* SvgElement */) > 0)));
    if (!isNullOrUndef(className) && className !== '') {
        if (isSVG) {
            dom.setAttribute('class', className);
        }
        else {
            dom.className = className;
        }
    }
    if (childFlags === 16 /* HasTextChildren */) {
        setTextContent(dom, children);
    }
    else if (childFlags !== 1 /* HasInvalidChildren */) {
        var childrenIsSVG = isSVG && vNode.type !== 'foreignObject';
        if (childFlags === 2 /* HasVNodeChildren */) {
            if (children.flags & 16384 /* InUse */) {
                vNode.children = children = directClone(children);
            }
            mount(children, dom, context, childrenIsSVG, null, lifecycle);
        }
        else if (childFlags === 8 /* HasKeyedChildren */ || childFlags === 4 /* HasNonKeyedChildren */) {
            mountArrayChildren(children, dom, context, childrenIsSVG, null, lifecycle);
        }
    }
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
    if (!isNull(props)) {
        mountProps(vNode, flags, props, dom, isSVG);
    }
    mountRef(vNode.ref, dom, lifecycle);
}
function mountArrayChildren(children, dom, context, isSVG, nextNode, lifecycle) {
    for (var i = 0; i < children.length; ++i) {
        var child = children[i];
        if (child.flags & 16384 /* InUse */) {
            children[i] = child = directClone(child);
        }
        mount(child, dom, context, isSVG, nextNode, lifecycle);
    }
}
function mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var instance = createClassComponentInstance(vNode, vNode.type, vNode.props || EMPTY_OBJ, context, isSVG, lifecycle);
    mount(instance.$LI, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
    mountClassComponentCallbacks(vNode.ref, instance, lifecycle);
}
function renderFunctionalComponent(vNode, context) {
    return vNode.flags & 32768 /* ForwardRef */ ? vNode.type.render(vNode.props || EMPTY_OBJ, vNode.ref, context) : vNode.type(vNode.props || EMPTY_OBJ, context);
}
function mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    mount((vNode.children = normalizeRoot(renderFunctionalComponent(vNode, context))), parentDOM, context, isSVG, nextNode, lifecycle);
}
function createClassMountCallback(instance) {
    return function () {
        instance.componentDidMount();
    };
}
function mountClassComponentCallbacks(ref, instance, lifecycle) {
    mountRef(ref, instance, lifecycle);
    if (isFunction(instance.componentDidMount)) {
        lifecycle.push(createClassMountCallback(instance));
    }
}
function createOnMountCallback(ref, vNode) {
    return function () {
        ref.onComponentDidMount(findDOMfromVNode(vNode, true), vNode.props || EMPTY_OBJ);
    };
}
function mountFunctionalComponentCallbacks(vNode, lifecycle) {
    var ref = vNode.ref;
    if (!isNullOrUndef(ref)) {
        safeCall1(ref.onComponentWillMount, vNode.props || EMPTY_OBJ);
        if (isFunction(ref.onComponentDidMount)) {
            lifecycle.push(createOnMountCallback(ref, vNode));
        }
    }
}

function replaceWithNewNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle) {
    unmount(lastVNode);
    if ((nextVNode.flags & lastVNode.flags & 2033 /* DOMRef */) !== 0) {
        mount(nextVNode, null, context, isSVG, null, lifecycle);
        // Single DOM operation, when we have dom references available
        replaceChild(parentDOM, nextVNode.dom, lastVNode.dom);
    }
    else {
        mount(nextVNode, parentDOM, context, isSVG, findDOMfromVNode(lastVNode, true), lifecycle);
        removeVNodeDOM(lastVNode, parentDOM);
    }
}
function patch(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var nextFlags = (nextVNode.flags |= 16384 /* InUse */);
    if (lastVNode.flags !== nextFlags || lastVNode.type !== nextVNode.type || lastVNode.key !== nextVNode.key || nextFlags & 2048 /* ReCreate */) {
        if (lastVNode.flags & 16384 /* InUse */) {
            replaceWithNewNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle);
        }
        else {
            // Last vNode is not in use, it has crashed at application level. Just mount nextVNode and ignore last one
            mount(nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
        }
    }
    else if (nextFlags & 481 /* Element */) {
        patchElement(lastVNode, nextVNode, context, isSVG, nextFlags, lifecycle);
    }
    else if (nextFlags & 4 /* ComponentClass */) {
        patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (nextFlags & 8 /* ComponentFunction */) {
        patchFunctionalComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (nextFlags & 16 /* Text */) {
        patchText(lastVNode, nextVNode);
    }
    else if (nextFlags & 512 /* Void */) {
        nextVNode.dom = lastVNode.dom;
    }
    else if (nextFlags & 8192 /* Fragment */) {
        patchFragment(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle);
    }
    else {
        patchPortal(lastVNode, nextVNode, context, lifecycle);
    }
}
function patchSingleTextChild(lastChildren, nextChildren, parentDOM) {
    if (lastChildren !== nextChildren) {
        if (lastChildren !== '') {
            parentDOM.firstChild.nodeValue = nextChildren;
        }
        else {
            setTextContent(parentDOM, nextChildren);
        }
    }
}
function patchContentEditableChildren(dom, nextChildren) {
    if (dom.textContent !== nextChildren) {
        dom.textContent = nextChildren;
    }
}
function patchFragment(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle) {
    var lastChildren = lastVNode.children;
    var nextChildren = nextVNode.children;
    var lastChildFlags = lastVNode.childFlags;
    var nextChildFlags = nextVNode.childFlags;
    var nextNode = null;
    // When fragment is optimized for multiple children, check if there is no children and change flag to invalid
    // This is the only normalization always done, to keep optimization flags API same for fragments and regular elements
    if (nextChildFlags & 12 /* MultipleChildren */ && nextChildren.length === 0) {
        nextChildFlags = nextVNode.childFlags = 2 /* HasVNodeChildren */;
        nextChildren = nextVNode.children = createVoidVNode();
    }
    var nextIsSingle = (nextChildFlags & 2 /* HasVNodeChildren */) !== 0;
    if (lastChildFlags & 12 /* MultipleChildren */) {
        var lastLen = lastChildren.length;
        // We need to know Fragment's edge node when
        if (
        // It uses keyed algorithm
        (lastChildFlags & 8 /* HasKeyedChildren */ && nextChildFlags & 8 /* HasKeyedChildren */) ||
            // It transforms from many to single
            nextIsSingle ||
            // It will append more nodes
            (!nextIsSingle && nextChildren.length > lastLen)) {
            // When fragment has multiple children there is always at least one vNode
            nextNode = findDOMfromVNode(lastChildren[lastLen - 1], false).nextSibling;
        }
    }
    patchChildren(lastChildFlags, nextChildFlags, lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, lastVNode, lifecycle);
}
function patchPortal(lastVNode, nextVNode, context, lifecycle) {
    var lastContainer = lastVNode.ref;
    var nextContainer = nextVNode.ref;
    var nextChildren = nextVNode.children;
    patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, lastContainer, context, false, null, lastVNode, lifecycle);
    nextVNode.dom = lastVNode.dom;
    if (lastContainer !== nextContainer && !isInvalid(nextChildren)) {
        var node = nextChildren.dom;
        removeChild(lastContainer, node);
        appendChild(nextContainer, node);
    }
}
function patchElement(lastVNode, nextVNode, context, isSVG, nextFlags, lifecycle) {
    var dom = (nextVNode.dom = lastVNode.dom);
    var lastProps = lastVNode.props;
    var nextProps = nextVNode.props;
    var isFormElement = false;
    var hasControlledValue = false;
    var nextPropsOrEmpty;
    isSVG = isSVG || (nextFlags & 32 /* SvgElement */) > 0;
    // inlined patchProps  -- starts --
    if (lastProps !== nextProps) {
        var lastPropsOrEmpty = lastProps || EMPTY_OBJ;
        nextPropsOrEmpty = nextProps || EMPTY_OBJ;
        if (nextPropsOrEmpty !== EMPTY_OBJ) {
            isFormElement = (nextFlags & 448 /* FormElement */) > 0;
            if (isFormElement) {
                hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
            }
            for (var prop in nextPropsOrEmpty) {
                var lastValue = lastPropsOrEmpty[prop];
                var nextValue = nextPropsOrEmpty[prop];
                if (lastValue !== nextValue) {
                    patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue, lastVNode);
                }
            }
        }
        if (lastPropsOrEmpty !== EMPTY_OBJ) {
            for (var prop$1 in lastPropsOrEmpty) {
                if (isNullOrUndef(nextPropsOrEmpty[prop$1]) && !isNullOrUndef(lastPropsOrEmpty[prop$1])) {
                    patchProp(prop$1, lastPropsOrEmpty[prop$1], null, dom, isSVG, hasControlledValue, lastVNode);
                }
            }
        }
    }
    var nextChildren = nextVNode.children;
    var nextClassName = nextVNode.className;
    // inlined patchProps  -- ends --
    if (lastVNode.className !== nextClassName) {
        if (isNullOrUndef(nextClassName)) {
            dom.removeAttribute('class');
        }
        else if (isSVG) {
            dom.setAttribute('class', nextClassName);
        }
        else {
            dom.className = nextClassName;
        }
    }
    if (nextFlags & 4096 /* ContentEditable */) {
        patchContentEditableChildren(dom, nextChildren);
    }
    else {
        patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, dom, context, isSVG && nextVNode.type !== 'foreignObject', null, lastVNode, lifecycle);
    }
    if (isFormElement) {
        processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, false, hasControlledValue);
    }
    var nextRef = nextVNode.ref;
    var lastRef = lastVNode.ref;
    if (lastRef !== nextRef) {
        unmountRef(lastRef);
        mountRef(nextRef, dom, lifecycle);
    }
}
function replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, context, isSVG, lifecycle) {
    unmount(lastChildren);
    mountArrayChildren(nextChildren, parentDOM, context, isSVG, findDOMfromVNode(lastChildren, true), lifecycle);
    removeVNodeDOM(lastChildren, parentDOM);
}
function patchChildren(lastChildFlags, nextChildFlags, lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, parentVNode, lifecycle) {
    switch (lastChildFlags) {
        case 2 /* HasVNodeChildren */:
            switch (nextChildFlags) {
                case 2 /* HasVNodeChildren */:
                    patch(lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    remove(lastChildren, parentDOM);
                    break;
                case 16 /* HasTextChildren */:
                    unmount(lastChildren);
                    setTextContent(parentDOM, nextChildren);
                    break;
                default:
                    replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, context, isSVG, lifecycle);
                    break;
            }
            break;
        case 1 /* HasInvalidChildren */:
            switch (nextChildFlags) {
                case 2 /* HasVNodeChildren */:
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    break;
                case 16 /* HasTextChildren */:
                    setTextContent(parentDOM, nextChildren);
                    break;
                default:
                    mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
            }
            break;
        case 16 /* HasTextChildren */:
            switch (nextChildFlags) {
                case 16 /* HasTextChildren */:
                    patchSingleTextChild(lastChildren, nextChildren, parentDOM);
                    break;
                case 2 /* HasVNodeChildren */:
                    clearDOM(parentDOM);
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    clearDOM(parentDOM);
                    break;
                default:
                    clearDOM(parentDOM);
                    mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
            }
            break;
        default:
            switch (nextChildFlags) {
                case 16 /* HasTextChildren */:
                    unmountAllChildren(lastChildren);
                    setTextContent(parentDOM, nextChildren);
                    break;
                case 2 /* HasVNodeChildren */:
                    removeAllChildren(parentDOM, parentVNode, lastChildren);
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    removeAllChildren(parentDOM, parentVNode, lastChildren);
                    break;
                default:
                    var lastLength = lastChildren.length | 0;
                    var nextLength = nextChildren.length | 0;
                    // Fast path's for both algorithms
                    if (lastLength === 0) {
                        if (nextLength > 0) {
                            mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                        }
                    }
                    else if (nextLength === 0) {
                        removeAllChildren(parentDOM, parentVNode, lastChildren);
                    }
                    else if (nextChildFlags === 8 /* HasKeyedChildren */ && lastChildFlags === 8 /* HasKeyedChildren */) {
                        patchKeyedChildren(lastChildren, nextChildren, parentDOM, context, isSVG, lastLength, nextLength, nextNode, parentVNode, lifecycle);
                    }
                    else {
                        patchNonKeyedChildren(lastChildren, nextChildren, parentDOM, context, isSVG, lastLength, nextLength, nextNode, lifecycle);
                    }
                    break;
            }
            break;
    }
}
function createDidUpdate(instance, lastProps, lastState, snapshot, lifecycle) {
    lifecycle.push(function () {
        instance.componentDidUpdate(lastProps, lastState, snapshot);
    });
}
function updateClassComponent(instance, nextState, nextProps, parentDOM, context, isSVG, force, nextNode, lifecycle) {
    var lastState = instance.state;
    var lastProps = instance.props;
    var usesNewAPI = Boolean(instance.$N);
    var hasSCU = isFunction(instance.shouldComponentUpdate);
    if (usesNewAPI) {
        nextState = createDerivedState(instance, nextProps, nextState !== lastState ? combineFrom(lastState, nextState) : nextState);
    }
    if (force || !hasSCU || (hasSCU && instance.shouldComponentUpdate(nextProps, nextState, context))) {
        if (!usesNewAPI && isFunction(instance.componentWillUpdate)) {
            instance.componentWillUpdate(nextProps, nextState, context);
        }
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = context;
        var snapshot = null;
        var nextInput = renderNewInput(instance, nextProps, context);
        if (usesNewAPI && isFunction(instance.getSnapshotBeforeUpdate)) {
            snapshot = instance.getSnapshotBeforeUpdate(lastProps, lastState);
        }
        patch(instance.$LI, nextInput, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
        // Dont update Last input, until patch has been succesfully executed
        instance.$LI = nextInput;
        if (isFunction(instance.componentDidUpdate)) {
            createDidUpdate(instance, lastProps, lastState, snapshot, lifecycle);
        }
    }
    else {
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = context;
    }
}
function patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var instance = (nextVNode.children = lastVNode.children);
    // If Component has crashed, ignore it to stay functional
    if (isNull(instance)) {
        return;
    }
    instance.$L = lifecycle;
    var nextProps = nextVNode.props || EMPTY_OBJ;
    var nextRef = nextVNode.ref;
    var lastRef = lastVNode.ref;
    var nextState = instance.state;
    if (!instance.$N) {
        if (isFunction(instance.componentWillReceiveProps)) {
            instance.$BR = true;
            instance.componentWillReceiveProps(nextProps, context);
            // If instance component was removed during its own update do nothing.
            if (instance.$UN) {
                return;
            }
            instance.$BR = false;
        }
        if (!isNull(instance.$PS)) {
            nextState = combineFrom(nextState, instance.$PS);
            instance.$PS = null;
        }
    }
    updateClassComponent(instance, nextState, nextProps, parentDOM, context, isSVG, false, nextNode, lifecycle);
    if (lastRef !== nextRef) {
        unmountRef(lastRef);
        mountRef(nextRef, instance, lifecycle);
    }
}
function patchFunctionalComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var shouldUpdate = true;
    var nextProps = nextVNode.props || EMPTY_OBJ;
    var nextRef = nextVNode.ref;
    var lastProps = lastVNode.props;
    var nextHooksDefined = !isNullOrUndef(nextRef);
    var lastInput = lastVNode.children;
    if (nextHooksDefined && isFunction(nextRef.onComponentShouldUpdate)) {
        shouldUpdate = nextRef.onComponentShouldUpdate(lastProps, nextProps);
    }
    if (shouldUpdate !== false) {
        if (nextHooksDefined && isFunction(nextRef.onComponentWillUpdate)) {
            nextRef.onComponentWillUpdate(lastProps, nextProps);
        }
        var type = nextVNode.type;
        var nextInput = normalizeRoot(nextVNode.flags & 32768 /* ForwardRef */ ? type.render(nextProps, nextRef, context) : type(nextProps, context));
        patch(lastInput, nextInput, parentDOM, context, isSVG, nextNode, lifecycle);
        nextVNode.children = nextInput;
        if (nextHooksDefined && isFunction(nextRef.onComponentDidUpdate)) {
            nextRef.onComponentDidUpdate(lastProps, nextProps);
        }
    }
    else {
        nextVNode.children = lastInput;
    }
}
function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = (nextVNode.dom = lastVNode.dom);
    if (nextText !== lastVNode.children) {
        dom.nodeValue = nextText;
    }
}
function patchNonKeyedChildren(lastChildren, nextChildren, dom, context, isSVG, lastChildrenLength, nextChildrenLength, nextNode, lifecycle) {
    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    var i = 0;
    var nextChild;
    var lastChild;
    for (; i < commonLength; ++i) {
        nextChild = nextChildren[i];
        lastChild = lastChildren[i];
        if (nextChild.flags & 16384 /* InUse */) {
            nextChild = nextChildren[i] = directClone(nextChild);
        }
        patch(lastChild, nextChild, dom, context, isSVG, nextNode, lifecycle);
        lastChildren[i] = nextChild;
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; ++i) {
            nextChild = nextChildren[i];
            if (nextChild.flags & 16384 /* InUse */) {
                nextChild = nextChildren[i] = directClone(nextChild);
            }
            mount(nextChild, dom, context, isSVG, nextNode, lifecycle);
        }
    }
    else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; ++i) {
            remove(lastChildren[i], dom);
        }
    }
}
function patchKeyedChildren(a, b, dom, context, isSVG, aLength, bLength, outerEdge, parentVNode, lifecycle) {
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var j = 0;
    var aNode = a[j];
    var bNode = b[j];
    var nextPos;
    var nextNode;
    // Step 1
    // tslint:disable-next-line
    outer: {
        // Sync nodes with the same key at the beginning.
        while (aNode.key === bNode.key) {
            if (bNode.flags & 16384 /* InUse */) {
                b[j] = bNode = directClone(bNode);
            }
            patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
            a[j] = bNode;
            ++j;
            if (j > aEnd || j > bEnd) {
                break outer;
            }
            aNode = a[j];
            bNode = b[j];
        }
        aNode = a[aEnd];
        bNode = b[bEnd];
        // Sync nodes with the same key at the end.
        while (aNode.key === bNode.key) {
            if (bNode.flags & 16384 /* InUse */) {
                b[bEnd] = bNode = directClone(bNode);
            }
            patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
            a[aEnd] = bNode;
            aEnd--;
            bEnd--;
            if (j > aEnd || j > bEnd) {
                break outer;
            }
            aNode = a[aEnd];
            bNode = b[bEnd];
        }
    }
    if (j > aEnd) {
        if (j <= bEnd) {
            nextPos = bEnd + 1;
            nextNode = nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge;
            while (j <= bEnd) {
                bNode = b[j];
                if (bNode.flags & 16384 /* InUse */) {
                    b[j] = bNode = directClone(bNode);
                }
                ++j;
                mount(bNode, dom, context, isSVG, nextNode, lifecycle);
            }
        }
    }
    else if (j > bEnd) {
        while (j <= aEnd) {
            remove(a[j++], dom);
        }
    }
    else {
        patchKeyedChildrenComplex(a, b, context, aLength, bLength, aEnd, bEnd, j, dom, isSVG, outerEdge, parentVNode, lifecycle);
    }
}
function patchKeyedChildrenComplex(a, b, context, aLength, bLength, aEnd, bEnd, j, dom, isSVG, outerEdge, parentVNode, lifecycle) {
    var aNode;
    var bNode;
    var nextPos;
    var i = 0;
    var aStart = j;
    var bStart = j;
    var aLeft = aEnd - j + 1;
    var bLeft = bEnd - j + 1;
    var sources = new Int32Array(bLeft + 1);
    // Keep track if its possible to remove whole DOM using textContent = '';
    var canRemoveWholeContent = aLeft === aLength;
    var moved = false;
    var pos = 0;
    var patched = 0;
    // When sizes are small, just loop them through
    if (bLength < 4 || (aLeft | bLeft) < 32) {
        for (i = aStart; i <= aEnd; ++i) {
            aNode = a[i];
            if (patched < bLeft) {
                for (j = bStart; j <= bEnd; j++) {
                    bNode = b[j];
                    if (aNode.key === bNode.key) {
                        sources[j - bStart] = i + 1;
                        if (canRemoveWholeContent) {
                            canRemoveWholeContent = false;
                            while (aStart < i) {
                                remove(a[aStart++], dom);
                            }
                        }
                        if (pos > j) {
                            moved = true;
                        }
                        else {
                            pos = j;
                        }
                        if (bNode.flags & 16384 /* InUse */) {
                            b[j] = bNode = directClone(bNode);
                        }
                        patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
                        ++patched;
                        break;
                    }
                }
                if (!canRemoveWholeContent && j > bEnd) {
                    remove(aNode, dom);
                }
            }
            else if (!canRemoveWholeContent) {
                remove(aNode, dom);
            }
        }
    }
    else {
        var keyIndex = {};
        // Map keys by their index
        for (i = bStart; i <= bEnd; ++i) {
            keyIndex[b[i].key] = i;
        }
        // Try to patch same keys
        for (i = aStart; i <= aEnd; ++i) {
            aNode = a[i];
            if (patched < bLeft) {
                j = keyIndex[aNode.key];
                if (j !== void 0) {
                    if (canRemoveWholeContent) {
                        canRemoveWholeContent = false;
                        while (i > aStart) {
                            remove(a[aStart++], dom);
                        }
                    }
                    sources[j - bStart] = i + 1;
                    if (pos > j) {
                        moved = true;
                    }
                    else {
                        pos = j;
                    }
                    bNode = b[j];
                    if (bNode.flags & 16384 /* InUse */) {
                        b[j] = bNode = directClone(bNode);
                    }
                    patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
                    ++patched;
                }
                else if (!canRemoveWholeContent) {
                    remove(aNode, dom);
                }
            }
            else if (!canRemoveWholeContent) {
                remove(aNode, dom);
            }
        }
    }
    // fast-path: if nothing patched remove all old and add all new
    if (canRemoveWholeContent) {
        removeAllChildren(dom, parentVNode, a);
        mountArrayChildren(b, dom, context, isSVG, outerEdge, lifecycle);
    }
    else if (moved) {
        var seq = lis_algorithm(sources);
        j = seq.length - 1;
        for (i = bLeft - 1; i >= 0; i--) {
            if (sources[i] === 0) {
                pos = i + bStart;
                bNode = b[pos];
                if (bNode.flags & 16384 /* InUse */) {
                    b[pos] = bNode = directClone(bNode);
                }
                nextPos = pos + 1;
                mount(bNode, dom, context, isSVG, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge, lifecycle);
            }
            else if (j < 0 || i !== seq[j]) {
                pos = i + bStart;
                bNode = b[pos];
                nextPos = pos + 1;
                moveVNodeDOM(bNode, dom, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge);
            }
            else {
                j--;
            }
        }
    }
    else if (patched !== bLeft) {
        // when patched count doesn't match b length we need to insert those new ones
        // loop backwards so we can use insertBefore
        for (i = bLeft - 1; i >= 0; i--) {
            if (sources[i] === 0) {
                pos = i + bStart;
                bNode = b[pos];
                if (bNode.flags & 16384 /* InUse */) {
                    b[pos] = bNode = directClone(bNode);
                }
                nextPos = pos + 1;
                mount(bNode, dom, context, isSVG, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge, lifecycle);
            }
        }
    }
}
var result;
var p;
var maxLen = 0;
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr) {
    var arrI = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var u = 0;
    var v = 0;
    var c = 0;
    var len = arr.length;
    if (len > maxLen) {
        maxLen = len;
        result = new Int32Array(len);
        p = new Int32Array(len);
    }
    for (; i < len; ++i) {
        arrI = arr[i];
        if (arrI !== 0) {
            j = result[k];
            if (arr[j] < arrI) {
                p[i] = j;
                result[++k] = i;
                continue;
            }
            u = 0;
            v = k;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = k + 1;
    var seq = new Int32Array(u);
    v = result[u - 1];
    while (u-- > 0) {
        seq[u] = v;
        v = p[v];
        result[u] = 0;
    }
    return seq;
}

var hasDocumentAvailable = typeof document !== 'undefined';
if (hasDocumentAvailable) {
    /*
     * Defining $EV and $V properties on Node.prototype
     * fixes v8 "wrong map" de-optimization
     */
    if (window.Node) {
        Node.prototype.$EV = null;
        Node.prototype.$V = null;
    }
}
function __render(input, parentDOM, callback, context) {
    var lifecycle = [];
    var rootInput = parentDOM.$V;
    renderCheck.v = true;
    if (isNullOrUndef(rootInput)) {
        if (!isNullOrUndef(input)) {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            mount(input, parentDOM, context, false, null, lifecycle);
            parentDOM.$V = input;
            rootInput = input;
        }
    }
    else {
        if (isNullOrUndef(input)) {
            remove(rootInput, parentDOM);
            parentDOM.$V = null;
        }
        else {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            patch(rootInput, input, parentDOM, context, false, null, lifecycle);
            rootInput = parentDOM.$V = input;
        }
    }
    if (lifecycle.length > 0) {
        callAll(lifecycle);
    }
    renderCheck.v = false;
    if (isFunction(callback)) {
        callback();
    }
    if (isFunction(options.renderComplete)) {
        options.renderComplete(rootInput, parentDOM);
    }
}
function render(input, parentDOM, callback, context) {
    if ( callback === void 0 ) callback = null;
    if ( context === void 0 ) context = EMPTY_OBJ;

    __render(input, parentDOM, callback, context);
}
function createRenderer(parentDOM) {
    return function renderer(lastInput, nextInput, callback, context) {
        if (!parentDOM) {
            parentDOM = lastInput;
        }
        render(nextInput, parentDOM, callback, context);
    };
}

var QUEUE = [];
var nextTick = typeof Promise !== 'undefined'
    ? Promise.resolve().then.bind(Promise.resolve())
    : function (a) {
        window.setTimeout(a, 0);
    };
var microTaskPending = false;
function queueStateChanges(component, newState, callback, force) {
    var pending = component.$PS;
    if (isFunction(newState)) {
        newState = newState(pending ? combineFrom(component.state, pending) : component.state, component.props, component.context);
    }
    if (isNullOrUndef(pending)) {
        component.$PS = newState;
    }
    else {
        for (var stateKey in newState) {
            pending[stateKey] = newState[stateKey];
        }
    }
    if (!component.$BR) {
        if (!renderCheck.v) {
            if (QUEUE.length === 0) {
                applyState(component, force, callback);
                return;
            }
        }
        if (QUEUE.indexOf(component) === -1) {
            QUEUE.push(component);
        }
        if (!microTaskPending) {
            microTaskPending = true;
            nextTick(rerender);
        }
        if (isFunction(callback)) {
            var QU = component.$QU;
            if (!QU) {
                QU = component.$QU = [];
            }
            QU.push(callback);
        }
    }
    else if (isFunction(callback)) {
        component.$L.push(callback.bind(component));
    }
}
function callSetStateCallbacks(component) {
    var queue = component.$QU;
    for (var i = 0, len = queue.length; i < len; ++i) {
        queue[i].call(component);
    }
    component.$QU = null;
}
function rerender() {
    var component;
    microTaskPending = false;
    while ((component = QUEUE.pop())) {
        var queue = component.$QU;
        applyState(component, false, queue ? callSetStateCallbacks.bind(null, component) : null);
    }
}
function applyState(component, force, callback) {
    if (component.$UN) {
        return;
    }
    if (force || !component.$BR) {
        var pendingState = component.$PS;
        component.$PS = null;
        var lifecycle = [];
        renderCheck.v = true;
        updateClassComponent(component, combineFrom(component.state, pendingState), component.props, findDOMfromVNode(component.$LI, true).parentNode, component.context, component.$SVG, force, null, lifecycle);
        if (lifecycle.length > 0) {
            callAll(lifecycle);
        }
        renderCheck.v = false;
    }
    else {
        component.state = component.$PS;
        component.$PS = null;
    }
    if (isFunction(callback)) {
        callback.call(component);
    }
}
var Component = function Component(props, context) {
    // Public
    this.state = null;
    // Internal properties
    this.$BR = false; // BLOCK RENDER
    this.$BS = true; // BLOCK STATE
    this.$PS = null; // PENDING STATE (PARTIAL or FULL)
    this.$LI = null; // LAST INPUT
    this.$UN = false; // UNMOUNTED
    this.$CX = null; // CHILDCONTEXT
    this.$QU = null; // QUEUE
    this.$N = false; // Uses new lifecycle API Flag
    this.$L = null; // Current lifecycle of this component
    this.$SVG = false; // Flag to keep track if component is inside SVG tree
    this.props = props || EMPTY_OBJ;
    this.context = context || EMPTY_OBJ; // context should not be mutable
};
Component.prototype.forceUpdate = function forceUpdate (callback) {
    if (this.$UN) {
        return;
    }
    // Do not allow double render during force update
    queueStateChanges(this, {}, callback, true);
};
Component.prototype.setState = function setState (newState, callback) {
    if (this.$UN) {
        return;
    }
    if (!this.$BS) {
        queueStateChanges(this, newState, callback, false);
    }
};
Component.prototype.render = function render (_nextProps, _nextState, _nextContext) {
    return null;
};

var version = "7.3.2";




/***/ }),

/***/ "./node_modules/inferno/index.esm.js":
/*!*******************************************!*\
  !*** ./node_modules/inferno/index.esm.js ***!
  \*******************************************/
/*! exports provided: Component, EMPTY_OBJ, Fragment, _CI, _HI, _M, _MCCC, _ME, _MFCC, _MP, _MR, __render, createComponentVNode, createFragment, createPortal, createRef, createRenderer, createTextVNode, createVNode, directClone, findDOMfromVNode, forwardRef, getFlagsForElementVnode, linkEvent, normalizeProps, options, render, rerender, version */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dist/index.esm.js */ "./node_modules/inferno/dist/index.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["Component"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EMPTY_OBJ", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["EMPTY_OBJ"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["Fragment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_CI", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_CI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_HI", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_HI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_M", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_M"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_MCCC", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_MCCC"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_ME", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_ME"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_MFCC", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_MFCC"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_MP", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_MP"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_MR", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["_MR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__render", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["__render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createComponentVNode", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createComponentVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createFragment", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createFragment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createPortal", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createPortal"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createRenderer", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createRenderer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTextVNode", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createVNode", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["createVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "directClone", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["directClone"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "findDOMfromVNode", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["findDOMfromVNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "forwardRef", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["forwardRef"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFlagsForElementVnode", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["getFlagsForElementVnode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "linkEvent", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["linkEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizeProps", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["normalizeProps"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "options", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["options"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "rerender", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["rerender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "version", function() { return _dist_index_esm_js__WEBPACK_IMPORTED_MODULE_0__["version"]; });



if (true) {
  console.warn('You are running production build of Inferno in development mode. Use dev:module entry point.');
}


/***/ }),

/***/ "./node_modules/is-function/index.js":
/*!*******************************************!*\
  !*** ./node_modules/is-function/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};


/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/process/browser.js":
/*!************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/process/browser.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/parse-headers/parse-headers.js":
/*!*****************************************************!*\
  !*** ./node_modules/parse-headers/parse-headers.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var trim = function(string) {
  return string.replace(/^\s+|\s+$/g, '');
}
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  var headersArr = trim(headers).split('\n')

  for (var i = 0; i < headersArr.length; i++) {
    var row = headersArr[i]
    var index = row.indexOf(':')
    , key = trim(row.slice(0, index)).toLowerCase()
    , value = trim(row.slice(index + 1))

    if (typeof(result[key]) === 'undefined') {
      result[key] = value
    } else if (isArray(result[key])) {
      result[key].push(value)
    } else {
      result[key] = [ result[key], value ]
    }
  }

  return result
}


/***/ }),

/***/ "./node_modules/query-string/index.js":
/*!********************************************!*\
  !*** ./node_modules/query-string/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(/*! strict-uri-encode */ "./node_modules/strict-uri-encode/index.js");
var objectAssign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
var decodeComponent = __webpack_require__(/*! decode-uri-component */ "./node_modules/decode-uri-component/index.js");

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

function extract(str) {
	var queryStart = str.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return str.slice(queryStart + 1);
}

function parse(str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^[?#&]/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeComponent(val);

		formatter(decodeComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	if (opts.sort === false) {
		opts.sort = function () {};
	}

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort(opts.sort).map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

exports.parseUrl = function (str, opts) {
	return {
		url: str.split('?')[0] || '',
		query: parse(extract(str), opts)
	};
};


/***/ }),

/***/ "./node_modules/strict-uri-encode/index.js":
/*!*************************************************!*\
  !*** ./node_modules/strict-uri-encode/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),

/***/ "./node_modules/url-set-query/index.js":
/*!*********************************************!*\
  !*** ./node_modules/url-set-query/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = urlSetQuery
function urlSetQuery (url, query) {
  if (query) {
    // remove optional leading symbols
    query = query.trim().replace(/^(\?|#|&)/, '')

    // don't append empty query
    query = query ? ('?' + query) : query

    var parts = url.split(/[\?\#]/)
    var start = parts[0]
    if (query && /\:\/\/[^\/]*$/.test(start)) {
      // e.g. http://foo.com -> http://foo.com/
      start = start + '/'
    }
    var match = url.match(/(\#.*)$/)
    url = start + query
    if (match) { // add hash back in
      url = url + match[0]
    }
  }
  return url
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/xhr-request-promise/index.js":
/*!***************************************************!*\
  !*** ./node_modules/xhr-request-promise/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var request = __webpack_require__(/*! xhr-request */ "./node_modules/xhr-request/index.js")

module.exports = function (url, options) {
  return new Promise(function (resolve, reject) {
    request(url, options, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};


/***/ }),

/***/ "./node_modules/xhr-request/index.js":
/*!*******************************************!*\
  !*** ./node_modules/xhr-request/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var queryString = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js")
var setQuery = __webpack_require__(/*! url-set-query */ "./node_modules/url-set-query/index.js")
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js")
var ensureHeader = __webpack_require__(/*! ./lib/ensure-header.js */ "./node_modules/xhr-request/lib/ensure-header.js")

// this is replaced in the browser
var request = __webpack_require__(/*! ./lib/request.js */ "./node_modules/xhr-request/lib/request-browser.js")

var mimeTypeJson = 'application/json'
var noop = function () {}

module.exports = xhrRequest
function xhrRequest (url, opt, cb) {
  if (!url || typeof url !== 'string') {
    throw new TypeError('must specify a URL')
  }
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (cb && typeof cb !== 'function') {
    throw new TypeError('expected cb to be undefined or a function')
  }

  cb = cb || noop
  opt = opt || {}

  var defaultResponse = opt.json ? 'json' : 'text'
  opt = assign({ responseType: defaultResponse }, opt)

  var headers = opt.headers || {}
  var method = (opt.method || 'GET').toUpperCase()
  var query = opt.query
  if (query) {
    if (typeof query !== 'string') {
      query = queryString.stringify(query)
    }
    url = setQuery(url, query)
  }

  // allow json response
  if (opt.responseType === 'json') {
    ensureHeader(headers, 'Accept', mimeTypeJson)
  }

  // if body content is json
  if (opt.json && method !== 'GET' && method !== 'HEAD') {
    ensureHeader(headers, 'Content-Type', mimeTypeJson)
    opt.body = JSON.stringify(opt.body)
  }

  opt.method = method
  opt.url = url
  opt.headers = headers
  delete opt.query
  delete opt.json

  return request(opt, cb)
}


/***/ }),

/***/ "./node_modules/xhr-request/lib/ensure-header.js":
/*!*******************************************************!*\
  !*** ./node_modules/xhr-request/lib/ensure-header.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ensureHeader
function ensureHeader (headers, key, value) {
  var lower = key.toLowerCase()
  if (!headers[key] && !headers[lower]) {
    headers[key] = value
  }
}


/***/ }),

/***/ "./node_modules/xhr-request/lib/normalize-response.js":
/*!************************************************************!*\
  !*** ./node_modules/xhr-request/lib/normalize-response.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = getResponse
function getResponse (opt, resp) {
  if (!resp) return null
  return {
    statusCode: resp.statusCode,
    headers: resp.headers,
    method: opt.method,
    url: opt.url,
    // the XHR object in browser, http response in Node
    rawRequest: resp.rawRequest ? resp.rawRequest : resp
  }
}


/***/ }),

/***/ "./node_modules/xhr-request/lib/request-browser.js":
/*!*********************************************************!*\
  !*** ./node_modules/xhr-request/lib/request-browser.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js")
var normalize = __webpack_require__(/*! ./normalize-response */ "./node_modules/xhr-request/lib/normalize-response.js")
var noop = function () {}

module.exports = xhrRequest
function xhrRequest (opt, cb) {
  delete opt.uri

  // for better JSON.parse error handling than xhr module
  var useJson = false
  if (opt.responseType === 'json') {
    opt.responseType = 'text'
    useJson = true
  }

  var req = xhr(opt, function xhrRequestResult (err, resp, body) {
    if (useJson && !err) {
      try {
        var text = resp.rawRequest.responseText
        body = JSON.parse(text)
      } catch (e) {
        err = e
      }
    }

    resp = normalize(opt, resp)
    if (err) cb(err, null, resp)
    else cb(err, body, resp)
    cb = noop
  })

  // Patch abort() so that it also calls the callback, but with an error
  var onabort = req.onabort
  req.onabort = function () {
    var ret = onabort.apply(req, Array.prototype.slice.call(arguments))
    cb(new Error('XHR Aborted'))
    cb = noop
    return ret
  }

  return req
}


/***/ }),

/***/ "./node_modules/xhr/index.js":
/*!***********************************!*\
  !*** ./node_modules/xhr/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var window = __webpack_require__(/*! global/window */ "./node_modules/global/window.js")
var isFunction = __webpack_require__(/*! is-function */ "./node_modules/is-function/index.js")
var parseHeaders = __webpack_require__(/*! parse-headers */ "./node_modules/parse-headers/parse-headers.js")
var xtend = __webpack_require__(/*! xtend */ "./node_modules/xtend/immutable.js")

module.exports = createXHR
// Allow use of default import syntax in TypeScript
module.exports.default = createXHR;
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0)
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    // Microsoft Edge browser sends "undefined" when send is called with undefined value.
    // XMLHttpRequest spec says to pass null as body to indicate no body
    // See https://github.com/naugtur/xhr/issues/100.
    xhr.send(body || null)

    return xhr


}

function getXml(xhr) {
    // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
    try {
        if (xhr.responseType === "document") {
            return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
            return xhr.responseXML
        }
    } catch (e) {}

    return null
}

function noop() {}


/***/ }),

/***/ "./node_modules/xtend/immutable.js":
/*!*****************************************!*\
  !*** ./node_modules/xtend/immutable.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ "./src/assets/Constants.ts":
/*!*********************************!*\
  !*** ./src/assets/Constants.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var LayoutConstants = {
    primary_color: "#003F63",
    primary_shadow_color: "#003452",
    secondary_color: "#1FB0D5",
    light_gray_color: "#F2F2F2",
    light_gray_shadow_color: "#F6F6F6",
    dark_gray_color: "#4A4A4A",
    medium_gray_color: "#A9A9A9"
};
exports.LayoutConstants = LayoutConstants;
var ElementsId = {
    console_id: "console",
    layout_id: "layout-root"
};
exports.ElementsId = ElementsId;


/***/ }),

/***/ "./src/components/CodeEditor.ts":
/*!**************************************!*\
  !*** ./src/components/CodeEditor.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Edits Formality Code
exports.__esModule = true;
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var Editor = function (_a) {
    var code = _a.code, on_input_code = _a.on_input_code;
    return inferno_hyperscript_1.h("textarea", {
        "oninput": function (e) { return on_input_code(e.target.value); },
        "value": code,
        "style": {
            "font-family": "monospace",
            "font-size": "14px",
            "padding": "7px",
            "width": "100%",
            "height": "100%"
        }
    }, []);
};
exports["default"] = Editor;


/***/ }),

/***/ "./src/components/CodePlayer.ts":
/*!**************************************!*\
  !*** ./src/components/CodePlayer.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var inferno_1 = __webpack_require__(/*! inferno */ "./node_modules/inferno/index.esm.js");
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var DocRender_1 = __webpack_require__(/*! ./DocRender */ "./src/components/DocRender.ts");
var fm = __webpack_require__(/*! formality-lang */ "./node_modules/formality-lang/src/fm-lib.js");
var App = "App@0";
// Plays an application
var CodePlayer = /** @class */ (function (_super) {
    __extends(CodePlayer, _super);
    function CodePlayer(props) {
        var _this = _super.call(this, props) || this;
        _this.app_error = null;
        _this.app_state = null;
        _this.app_funcs = null;
        _this.defs = null;
        _this.file = null;
        _this.defs = props.defs;
        _this.file = props.file;
        return _this;
    }
    CodePlayer.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.compile();
                return [2 /*return*/];
            });
        });
    };
    CodePlayer.prototype.compile = function () {
        var defs = this.defs;
        var file = this.file;
        if (defs && defs[file + "/main"]) {
            var get_state = fm.to_js.compile(fm.lang.erase(defs[App + "/get_state"]), { defs: defs });
            var get_render = fm.to_js.compile(fm.lang.erase(defs[App + "/get_render"]), { defs: defs });
            var get_update = fm.to_js.compile(fm.lang.erase(defs[App + "/get_update"]), { defs: defs });
            var mouseclick = fm.to_js.compile(fm.lang.erase(defs[App + "/mouseclick"]), { defs: defs });
            var keypress = fm.to_js.compile(fm.lang.erase(defs[App + "/keypress"]), { defs: defs });
            var app = fm.to_js.compile(fm.lang.erase(defs[file + "/main"]), { defs: defs });
            var app_state = get_state(app);
            var app_render = get_render(app);
            var app_update = get_update(app);
            this.app_funcs = {
                mouseclick: mouseclick,
                keypress: keypress,
                state: app_state,
                render: app_render,
                update: app_update
            };
            this.app_state = app_state;
            this.forceUpdate();
        }
        else {
            this.app_error = "No main found.";
        }
    };
    CodePlayer.prototype.render = function () {
        var _this = this;
        var app_state = this.app_state;
        var app_funcs = this.app_funcs;
        var defs = this.defs;
        var file = this.file;
        var style = { "flex-grow": 1 };
        var onClick = function (e) {
            _this.app_state = app_funcs.update(app_funcs.mouseclick(e.pageX)(e.pageY))(app_state);
            _this.forceUpdate();
        };
        if (this.app_error) {
            return inferno_hyperscript_1.h("div", { style: style }, this.app_error);
        }
        else if (app_state === null || app_funcs === null) {
            return inferno_hyperscript_1.h("div", { style: style }, "Compiling application...");
        }
        else {
            return inferno_hyperscript_1.h("div", { style: style, onClick: onClick }, DocRender_1["default"](app_funcs.render(app_state)));
        }
    };
    return CodePlayer;
}(inferno_1.Component));
;
exports["default"] = CodePlayer;


/***/ }),

/***/ "./src/components/CodeRender.ts":
/*!**************************************!*\
  !*** ./src/components/CodeRender.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Renders Formality code with syntax highlighting
exports.__esModule = true;
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var CodeRender = function (_a) {
    var code = _a.code, tokens = _a.tokens, on_click_def = _a.on_click_def, on_click_imp = _a.on_click_imp, on_click_ref = _a.on_click_ref;
    if (code === "<error>") {
        return inferno_hyperscript_1.h("div", { "style": { "padding": "8px" } }, "Failed to load code.");
    }
    if (!tokens) {
        return inferno_hyperscript_1.h("div", { "style": { "padding": "8px" } }, "Loading code from FPM. This may take a while...");
    }
    // Makes spans for each code chunk
    var code_chunks = [];
    var _loop_1 = function (i) {
        var child = tokens[i][1];
        var elem = (function () {
            switch (tokens[i][0]) {
                case "txt":
                    return inferno_hyperscript_1.h("span", { style: { "color": "black" } }, child);
                case "sym":
                    return inferno_hyperscript_1.h("span", { style: { "color": "#15568f" } }, child);
                case "cmm":
                    return inferno_hyperscript_1.h("span", { style: { "color": "#A2A8D3" } }, child);
                case "num":
                    return inferno_hyperscript_1.h("span", { style: { "color": "green" } }, child);
                case "var":
                    return inferno_hyperscript_1.h("span", { style: { "color": "black" } }, child);
                case "imp":
                    return inferno_hyperscript_1.h("a", {
                        href: window.location.origin + "/" + tokens[i][1],
                        style: {
                            "color": "black",
                            "text-decoration": "underline",
                            "font-weight": "bold",
                            "cursor": "pointer"
                        },
                        on_click: function (e) {
                            on_click_imp(tokens[i][1])(e);
                            e.preventDefault();
                        }
                    }, child);
                case "ref":
                    return inferno_hyperscript_1.h("a", {
                        href: window.location.origin + "/" + tokens[i][2].replace(new RegExp("/.*$"), ""),
                        style: {
                            "color": "#38598B",
                            "text-decoration": "underline",
                            "font-weight": "bold",
                            "cursor": "pointer"
                        },
                        on_click: function (e) {
                            on_click_ref(tokens[i][2])(e);
                            e.preventDefault();
                        }
                    }, child);
                case "def":
                    return inferno_hyperscript_1.h("span", {
                        style: {
                            "color": "#4384e6",
                            "text-decoration": "underline",
                            "font-weight": "bold",
                            "cursor": "pointer"
                        },
                        on_click: function (e) {
                            on_click_def(tokens[i][2])(e);
                        }
                    }, child);
                default:
                    return inferno_hyperscript_1.h("span", {}, child);
            }
        })();
        code_chunks.push(elem);
    };
    for (var i = 0; i < tokens.length; ++i) {
        _loop_1(i);
    }
    return inferno_hyperscript_1.h("code", {
        "style": {
            "padding": "8px",
            "overflow": "scroll",
            "flex-grow": 1
        }
    }, [
        inferno_hyperscript_1.h("pre", {}, [code_chunks])
    ]);
};
exports["default"] = CodeRender;


/***/ }),

/***/ "./src/components/Console.ts":
/*!***********************************!*\
  !*** ./src/components/Console.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// The bottom console of the site, with cited_by, output, tools, etc.
exports.__esModule = true;
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var Console = function (_a) {
    var load_file = _a.load_file, cited_by = _a.cited_by;
    // Builds the cited_by links
    var links = [];
    if (cited_by) {
        var _loop_1 = function () {
            var parent_file = cited_by[i];
            links.push(inferno_hyperscript_1.h("div", {
                "onClick": function (e) {
                    load_file(parent_file);
                },
                "style": {
                    "cursor": "pointer",
                    "text-decoration": "underline"
                }
            }, parent_file));
        };
        for (var i = 0; i < cited_by.length; ++i) {
            _loop_1();
        }
    }
    return inferno_hyperscript_1.h("div", {
        "style": {
            "padding": "8px",
            "border-left": "1px dashed gray",
            "background-color": "rgb(240,240,240)",
            "overflow-bottom": "scroll"
        }
    }, [
        inferno_hyperscript_1.h("div", {
            "style": {
                "font-weight": "bold"
            }
        }, "Cited by:"),
        links
    ]);
};
exports["default"] = Console;


/***/ }),

/***/ "./src/components/DocRender.ts":
/*!*************************************!*\
  !*** ./src/components/DocRender.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Converts a `Doc` value from Formality to an Inferno element
exports.__esModule = true;
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var DocRender = function (doc) {
    var case_text = function (value) {
        var str = "";
        (function go(value) {
            var case_nil = "";
            var case_cons = function (head) { return function (tail) {
                str += String.fromCharCode(head);
                go(tail);
            }; };
            value(case_nil)(case_cons);
        })(value);
        return inferno_hyperscript_1.h("span", {}, str);
    };
    var case_numb = function (value) {
        return inferno_hyperscript_1.h("span", {}, String(value));
    };
    var case_many = function (value) {
        var arr = [];
        (function go(value) {
            var case_nil = null;
            var case_cons = function (head) { return function (tail) {
                arr.push(inferno_hyperscript_1.h("div", {}, DocRender(head)));
                go(tail);
            }; };
            value(case_nil)(case_cons);
        })(value);
        return inferno_hyperscript_1.h("div", {}, arr);
    };
    return doc(case_text)(case_numb)(case_many);
};
exports["default"] = DocRender;


/***/ }),

/***/ "./src/components/Moonad.ts":
/*!**********************************!*\
  !*** ./src/components/Moonad.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Moonad: a Formality browser and application player
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var inferno_1 = __webpack_require__(/*! inferno */ "./node_modules/inferno/index.esm.js");
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var fm = __webpack_require__(/*! formality-lang */ "./node_modules/formality-lang/src/fm-lib.js");
// Components
var CodeEditor_1 = __webpack_require__(/*! ./CodeEditor */ "./src/components/CodeEditor.ts");
var CodePlayer_1 = __webpack_require__(/*! ./CodePlayer */ "./src/components/CodePlayer.ts");
var CodeRender_1 = __webpack_require__(/*! ./CodeRender */ "./src/components/CodeRender.ts");
var Console_1 = __webpack_require__(/*! ./Console */ "./src/components/Console.ts");
var TopMenu_1 = __webpack_require__(/*! ./TopMenu */ "./src/components/TopMenu.ts");
var Moonad = /** @class */ (function (_super) {
    __extends(Moonad, _super);
    function Moonad(props) {
        var _this = _super.call(this, props) || this;
        // Application state
        _this.version = "1"; // change to clear the user's caches
        _this.file = null; // name of the current file being rendered
        _this.code = null; // contents of the current file
        _this.tokens = null; // chunks of code with syntax highlight info
        _this.cited_by = null; // files that import the current file
        _this.history = []; // previous files
        _this.defs = null; // loaded formality token
        _this.mode = "VIEW"; // are we editing, playing or viewing this file?
        _this.load_file(window.location.pathname.slice(1) || "Base@0");
        return _this;
    }
    Moonad.prototype.componentDidMount = function () {
        var _this = this;
        var cached_fm_version = window.localStorage.getItem("cached_fm_version");
        var cached_moonad_version = window.localStorage.getItem("cached_moonad_version");
        if (cached_fm_version !== fm.lang.version || cached_moonad_version !== this.version) {
            window.localStorage.clear();
            window.localStorage.setItem("cached_moonad_version", this.version);
            window.localStorage.setItem("cached_fm_version", fm.lang.version);
        }
        window.onpopstate = function (e) { return _this.load_file(e.state, false); };
    };
    // Loads file/code from propps
    Moonad.prototype.componentWillReceiveProps = function (props) {
        if (props.code)
            this.load_code(props.code);
        if (props.file)
            this.load_file(props.file);
    };
    Moonad.prototype.loader = function (file) {
        return fm.forall.with_local_storage_cache(fm.forall.load_file)(file);
    };
    // Re-parses the code to build defs and tokens
    Moonad.prototype.parse = function () {
        return __awaiter(this, void 0, void 0, function () {
            var parsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fm.lang.parse(this.code, { file: this.file, tokenify: true, loader: this.loader })];
                    case 1:
                        parsed = _a.sent();
                        this.defs = parsed.defs;
                        this.tokens = parsed.tokens;
                        this.forceUpdate();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Loads a file (ex: "Data.Bool@0")
    Moonad.prototype.load_file = function (file, push_history) {
        if (push_history === void 0) { push_history = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (file.slice(-3) === ".fm") {
                            file = file.slice(0, -3);
                        }
                        if (file.indexOf("@") === -1) {
                            file = file + "@0";
                        }
                        if (push_history) {
                            this.history.push(file);
                            window.history.pushState(file, file, file);
                        }
                        this.mode = "VIEW";
                        this.file = file;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        this.cited_by = [];
                        _a = this;
                        return [4 /*yield*/, this.loader(this.file)];
                    case 2:
                        _a.code = _c.sent();
                        this.parse();
                        _b = this;
                        return [4 /*yield*/, fm.forall.load_file_parents(file)];
                    case 3:
                        _b.cited_by = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        console.log(e_1);
                        this.code = "<error>";
                        this.forceUpdate();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Loads a code without a file (local)
    Moonad.prototype.load_code = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.file = "local";
                this.code = code;
                this.parse();
                return [2 /*return*/];
            });
        });
    };
    // Type-checks a definition 
    Moonad.prototype.typecheck = function (name) {
        try {
            var type = fm.lang.run("TYPE", name, "TYPE", { defs: this.defs });
            var good = true;
        }
        catch (e) {
            var type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
            var good = false;
        }
        var text = ":: Type ::\n";
        if (good) {
            text += "✓ " + fm.lang.show(type);
        }
        else {
            text += "✗ " + type;
        }
        try {
            var norm = fm.lang.run("REDUCE_DEBUG", name, { defs: this.defs, erased: true, unbox: true, logging: true });
            text += "\n\n:: Output ::\n";
            text += fm.lang.show(norm, [], { full_refs: false });
        }
        catch (e) { }
        ;
        alert(text);
    };
    // Normalizes a definition
    Moonad.prototype.normalize = function (name) {
        var norm;
        try {
            norm = fm.lang.show(fm.lang.norm(this.defs[name], this.defs, "DEBUG", {}));
        }
        catch (e) {
            norm = "<unable_to_normalize>";
        }
        ;
        alert(norm);
    };
    // Event when user clicks a definition 
    Moonad.prototype.on_click_def = function (path) {
        var _this = this;
        return function (e) {
            if (!e.shiftKey) {
                return _this.typecheck(path);
            }
            else {
                return _this.normalize(path);
            }
        };
    };
    // Event when user clicks a reference
    Moonad.prototype.on_click_ref = function (path) {
        var _this = this;
        return function (e) {
            _this.load_file(path.slice(0, path.indexOf("/")));
        };
    };
    // Event when user clicks an import
    Moonad.prototype.on_click_imp = function (file) {
        var _this = this;
        return function (e) {
            _this.load_file(file);
        };
    };
    Moonad.prototype.on_click_view = function () {
        this.mode = "VIEW";
        this.load_code(this.code);
        this.forceUpdate();
    };
    Moonad.prototype.on_click_edit = function () {
        this.mode = "EDIT";
        this.forceUpdate();
    };
    Moonad.prototype.on_click_play = function () {
        this.mode = "PLAY";
        this.forceUpdate();
    };
    Moonad.prototype.on_input_code = function (code) {
        this.code = code;
        this.forceUpdate();
    };
    Moonad.prototype.on_click_save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var file, unam, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = prompt("File name:");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!file) return [3 /*break*/, 3];
                        return [4 /*yield*/, fm.forall.save_file(file, this.code)];
                    case 2:
                        unam = _a.sent();
                        this.load_file(unam);
                        return [3 /*break*/, 4];
                    case 3: throw "";
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        console.log(e_2);
                        alert("Couldn't save file.");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Renders the interface
    Moonad.prototype.render = function () {
        var _this = this;
        // Creates bound variables for states and local methods
        var mode = this.mode;
        var file = this.file;
        var defs = this.defs;
        var code = this.code;
        var tokens = this.tokens;
        var cited_by = this.cited_by;
        var load_file = function (file, push) { return _this.load_file(file, push); };
        var on_click_view = function () { return _this.on_click_view(); };
        var on_click_edit = function () { return _this.on_click_edit(); };
        var on_click_save = function () { return _this.on_click_save(); };
        var on_click_play = function () { return _this.on_click_play(); };
        var on_click_def = function (path) { return _this.on_click_def(path); };
        var on_click_imp = function (path) { return _this.on_click_imp(path); };
        var on_click_ref = function (path) { return _this.on_click_ref(path); };
        var on_input_code = function (code) { return _this.on_input_code(code); };
        // Renders the site
        return inferno_hyperscript_1.h("div", {
            style: {
                "font-family": "Gotham Book",
                "display": "flex",
                "flex-flow": "column nowrap",
                "height": "100%",
                "background": "rgb(253,253,254)"
            }
        }, [
            // Top of the site
            TopMenu_1["default"]({ mode: mode, file: file, on_click_view: on_click_view, on_click_edit: on_click_edit, on_click_play: on_click_play, load_file: load_file }),
            // h(Pathbar, {load_file}),
            // Middle of the site
            (this.mode === "EDIT" ? CodeEditor_1["default"]({ code: code, on_input_code: on_input_code })
                : this.mode === "VIEW" ? CodeRender_1["default"]({ code: code, tokens: tokens, on_click_def: on_click_def, on_click_imp: on_click_imp, on_click_ref: on_click_ref })
                    : this.mode === "PLAY" ? inferno_hyperscript_1.h(CodePlayer_1["default"], { defs: defs, file: file })
                        : null),
            // Bottom of the site
            Console_1["default"]({ load_file: load_file, cited_by: cited_by })
        ]);
    };
    return Moonad;
}(inferno_1.Component));
exports["default"] = Moonad;


/***/ }),

/***/ "./src/components/Pathbar.ts":
/*!***********************************!*\
  !*** ./src/components/Pathbar.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var inferno_1 = __webpack_require__(/*! inferno */ "./node_modules/inferno/index.esm.js");
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var Constants_1 = __webpack_require__(/*! ../assets/Constants */ "./src/assets/Constants.ts");
var default_path = "Base@0";
var Pathbar = /** @class */ (function (_super) {
    __extends(Pathbar, _super);
    function Pathbar(props) {
        var _this = _super.call(this, props) || this;
        // State
        _this.editing = false;
        _this.internal_path = default_path;
        return _this;
    }
    Pathbar.prototype.onClick = function () {
        this.editing = true;
        this.internal_path = "";
        this.forceUpdate();
    };
    Pathbar.prototype.onInput = function (e) {
        var evt = e;
        if (this.editing && evt.target) {
            var ele = evt.target;
            this.editing = true;
            this.internal_path = ele.value;
        }
        this.forceUpdate();
    };
    Pathbar.prototype.onKeyDown = function (e) {
        var _this = this;
        var onLoadCode = function (file, push) { return _this.props.load_file(file, push); };
        if (e.keyCode === 13 && this.editing) {
            this.editing = false;
            var is_valid = this.verify_format(this.internal_path);
            // TODO: if not valid, tell the user
            if (is_valid) {
                this.props.load_file(this.internal_path);
            }
        }
        this.forceUpdate();
    };
    Pathbar.prototype.verify_format = function (internal_path) {
        var module_regex = /^[a-zA-Z_\.-@]+@\d+$/;
        return module_regex.test(internal_path);
    };
    Pathbar.prototype.render = function () {
        var _this = this;
        var onClick = function () { return _this.onClick(); };
        var onKeyDown = function (e) { return _this.onKeyDown(e); };
        var onInput = function (e) { return _this.onInput(e); };
        if (this.editing) {
            return inferno_hyperscript_1.h("input", {
                type: "text",
                style: input_style,
                value: this.internal_path,
                placeholder: "Search ...",
                onKeyDown: onKeyDown,
                onInput: onInput
            });
        }
        return inferno_hyperscript_1.h("div", { style: style, onClick: onClick }, this.internal_path);
    };
    return Pathbar;
}(inferno_1.Component));
var style = {
    "heigth": "20px",
    "width": "50%",
    "color": "#FFFFFF",
    "margin-left": "30px",
    "margin-top": "35px",
    "font-size": "16px"
};
var input_style = __assign(__assign({}, style), { "border": "none", "margin-top": "23px", "margin-bottom": "5px", "padding": "5px", "outline": "none", "font-family": "monospace", "font-color": Constants_1.LayoutConstants.light_gray_color, "background-color": Constants_1.LayoutConstants.primary_shadow_color });
exports["default"] = Pathbar;


/***/ }),

/***/ "./src/components/TopMenu.ts":
/*!***********************************!*\
  !*** ./src/components/TopMenu.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var Constants_1 = __webpack_require__(/*! ../assets/Constants */ "./src/assets/Constants.ts");
var Pathbar_1 = __webpack_require__(/*! ./Pathbar */ "./src/components/Pathbar.ts");
var TopMenu = function (_a) {
    var mode = _a.mode, file = _a.file, load_file = _a.load_file, on_click_view = _a.on_click_view, on_click_edit = _a.on_click_edit, on_click_play = _a.on_click_play;
    return inferno_hyperscript_1.h("div", {
        style: {
            "background": Constants_1.LayoutConstants.primary_color,
            "height": "65px",
            "font-family": "monospace",
            "font-size": "16px",
            "display": "flex",
            "user-select": "none",
            "flex-flow": "row nowrap",
            "justify-content": "flex-begin",
            "align-items": "center",
            "border-bottom": "1px solid rgb(180,180,180)"
        }
    }, [
        inferno_hyperscript_1.h("img", {
            style: {
                "width": "50px",
                "height": "40px",
                "margin-top": "13px",
                "margin-left": "10%",
                "cursor": "pointer"
            },
            src: new URL('https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?cs=srgb&dl=animal-animal-photography-cat-57416.jpg&fm=jpg'),
            alt: "logo",
            onClick: function () { load_file("Base@0"); }
        }),
        inferno_hyperscript_1.h(Pathbar_1["default"], { load_file: load_file }),
        inferno_hyperscript_1.h("span", {
            "onClick": function () { return on_click_view(); },
            "style": {
                "padding-right": "8px",
                "cursor": "pointer",
                "font-weight": mode === "VIEW" ? "bold" : null
            }
        }, " [view] "),
        inferno_hyperscript_1.h("span", {
            "onClick": function () { return on_click_edit(); },
            "style": {
                "padding-right": "8px",
                "cursor": "pointer",
                "font-weight": mode === "EDIT" ? "bold" : null
            }
        }, " [edit] "),
        inferno_hyperscript_1.h("span", {
            "onClick": function () { return on_click_play(); },
            "style": {
                "padding-right": "8px",
                "cursor": "pointer",
                "font-weight": mode === "PLAY" ? "bold" : null
            }
        }, " [play] ")
    ]);
};
exports["default"] = TopMenu;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var inferno_1 = __webpack_require__(/*! inferno */ "./node_modules/inferno/index.esm.js");
var inferno_hyperscript_1 = __webpack_require__(/*! inferno-hyperscript */ "./node_modules/inferno-hyperscript/dist/index.esm.js");
var Moonad_1 = __webpack_require__(/*! ./components/Moonad */ "./src/components/Moonad.ts");
window.onload = function () {
    inferno_1.render(inferno_hyperscript_1.h(Moonad_1["default"], {}), document.getElementById("main"));
};


/***/ })

/******/ });
//# sourceMappingURL=index.js.map