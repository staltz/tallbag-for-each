/**
 * tallbag-for-each
 * ----------------
 *
 * Tallbag sink that consume both pullable and listenable sources. When called
 * on a pullable source, it will iterate through its data. When called on a
 * listenable source, it will observe its data.
 *
 * `npm install tallbag-for-each`
 *
 * The first argument is the consumer of data,
 * the second argument is the (optional) consumer of metadata from the shadow.
 *
 * Examples
 * --------
 *
 * Consume a pullable source:
 *
 *     const fromIter = require('callbag-from-iter');
 *     const forEach = require('tallbag-for-each');
 *
 *     const source = fromIter([10,20,30,40])
 *
 *     forEach(x => console.log(x))(source); // 10
 *                                           // 20
 *                                           // 30
 *                                           // 40
 *
 * Consume a listenable source:
 *
 *     const interval = require('tallbag-interval');
 *     const forEach = require('tallbag-for-each');
 *
 *     const source = interval(1000);
 *
 *     forEach(x => console.log(x))(source); // 0
 *                                           // 1
 *                                           // 2
 *                                           // 3
 *                                           // ...
 */

const makeShadow = require('shadow-callbag').default;

const forEach = (operation, shadowOperation) => source => {
  let talkback;
  let shadow;
  source(0, (t, d, s) => {
    if (t === 0) {
      talkback = d;
      if (shadowOperation) {
        shadow = makeShadow('forEach', s);
        shadow(0, (_t, _d) => {
          if (_t === 0) _d(1);
          if (_t === 1) shadowOperation(_d);
        });
      }
    }
    if (t === 1) {
      shadow && shadow(1, d);
      operation(d);
    }
    if (t === 1 || t === 0) talkback(1);
  });
};

module.exports = forEach;
