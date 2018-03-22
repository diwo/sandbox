function chain(...asyncFuncs) {
  return async (prev) =>
    asyncFuncs.reduce(
      (promiseChain, asyncFunc) => promiseChain.then(asyncFunc),
      Promise.resolve(prev));
}

function passthrough(asyncFunc) {
  return async (prev) => {
    await asyncFunc(prev);
    return prev;
  };
}

function loop(operation) {
  const continuousChain = chain(
    operation,
    prev => continuousChain(prev)
  );
  return continuousChain;
}

function delayedExecution(asyncOperation, delay) {
  return chain(
    passthrough(() => sleep(delay)),
    asyncOperation
  );
}

async function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}


// example:
const startTime = Date.now();

function initAnimation(width, start) {
  return async function drawNextFrame(prev) {
    const { pos, forward } = prev || start;
    const bounce = forward && pos+1 == width || !forward && pos-1 < 0;
    const stillForward = forward != bounce;
    const newPos = bounce ? pos : stillForward ? pos + 1 : pos - 1;
    const timestamp = (Date.now() - startTime).toString().padStart(6);
    console.log(`${timestamp}: ` + " ".repeat(newPos) + ".");
    return {
      pos: newPos,
      forward: stillForward
    };
  }
}

function animate(width, startFromLeft) {
  const targetFps = 30;
  const drawNextFrame = initAnimation(width, { pos: startFromLeft ? 0 : width-1, forward: startFromLeft });
  loop(delayedExecution(drawNextFrame, 1000/targetFps))();
}
const width = 30;
animate(width, true);
animate(width, false);
