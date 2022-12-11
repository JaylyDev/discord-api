/**
 * Clone the object using iteration
 * @param obj object
 */
export function DeepCopy(obj: object): object {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Array) {
    var cloneA = [];
    for (var i = 0; i < obj.length; ++i) {
      cloneA[i] = DeepCopy(obj[i]);
    }
    return cloneA;
  }
  var cloneO = {};
  for (var e in obj) {
    cloneO[e] = DeepCopy(obj[e]);
  }
  return cloneO;
};