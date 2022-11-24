import { delay } from "@utilities/functions";

class RepeatUtility {

  private constructor() { }
  static readonly instance = new RepeatUtility();

  async timedOnCondition(params: { times?: number, duration?: number, call: () => Promise<boolean> }) {

    let times = params.times || 5;
    const duration = params.duration || 1000;
    const call = params.call;

    const func = async (): Promise<boolean> => {

      const result = await call();
      times--;
      
      if (result) return true;
      else if (times < 1) return false;
      else {
        await delay(duration);
        return await func();
      }

    }

    return await func();

  };

}

export const Repeat = RepeatUtility.instance;