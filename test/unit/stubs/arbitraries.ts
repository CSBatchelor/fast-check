import { Arbitrary } from '../../../src/check/arbitrary/definition/Arbitrary';
import { Shrinkable } from '../../../src/check/arbitrary/definition/Shrinkable';
import { Random } from '../../../src/random/generator/Random';
import { stream } from '../../../src/stream/Stream';

/**
 * CounterArbitrary
 *
 * each call to generate increase the produced value
 * beware that this one is not pure (::generate)
 */
class CounterArbitrary extends Arbitrary<number> {
  public generatedValues: number[] = [];
  constructor(private value: number) {
    super();
  }
  generate(rng: Random): Shrinkable<number> {
    const last = this.value++ | 0; // keep it in integer range
    this.generatedValues.push(last);
    return new Shrinkable(last);
  }
}

/**
 * ForwardArbitrary
 *
 * simply forward the values generated by the Random
 */
class ForwardArbitrary extends Arbitrary<number> {
  constructor() {
    super();
  }
  generate(rng: Random): Shrinkable<number> {
    return new Shrinkable(rng.nextInt());
  }
}

/**
 * ForwardArrayArbitrary
 *
 * simply forward the values generated by the Random
 */
class ForwardArrayArbitrary extends Arbitrary<number[]> {
  constructor(readonly num: number) {
    super();
  }
  generate(rng: Random): Shrinkable<number[]> {
    const out = [];
    for (let idx = 0; idx !== this.num; ++idx) {
      out.push(rng.nextInt());
    }
    return new Shrinkable(out);
  }
}

/**
 * SingleUseArbitrary
 *
 * only one call to generate is allowed
 * other calls will throw an exception
 */
class SingleUseArbitrary<T> extends Arbitrary<T> {
  calledOnce = false;
  constructor(public id: T) {
    super();
  }
  generate(mrng: Random) {
    if (this.calledOnce) {
      throw 'Arbitrary has already been called once';
    }
    this.calledOnce = true;
    return new Shrinkable(this.id);
  }
}

/**
 * WithShrinkArbitrary
 *
 * like counter except it can be shrinked towards zero
 */
class WithShrinkArbitrary extends Arbitrary<number> {
  constructor(private value: number) {
    super();
  }
  private static shrinkIt(v: number): Shrinkable<number> {
    function* g() {
      let vv = v;
      while (Math.abs(vv) > 0) {
        vv = vv > 0 ? Math.floor(vv / 2) : Math.ceil(vv / 2);
        if (v != vv) {
          yield WithShrinkArbitrary.shrinkIt(vv);
        }
      }
    }
    return new Shrinkable(v, () => stream(g()));
  }
  generate(rng: Random): Shrinkable<number> {
    const last = this.value++ | 0; // keep it in integer range
    return WithShrinkArbitrary.shrinkIt(last);
  }
}

const counter = (value: number) => new CounterArbitrary(value);
const forward = () => new ForwardArbitrary();
const forwardArray = (num: number) => new ForwardArrayArbitrary(num);
const single = <T>(id: T) => new SingleUseArbitrary(id);
const withShrink = (value: number) => new WithShrinkArbitrary(value);

export {
  counter,
  forward,
  forwardArray,
  single,
  withShrink,
  CounterArbitrary,
  ForwardArbitrary,
  ForwardArrayArbitrary,
  SingleUseArbitrary,
  WithShrinkArbitrary
};
