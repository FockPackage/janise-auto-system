import { helper } from 'ember-helper';

export function formatDateTime(params/*, hash*/) {
  const dateTimeArray = params[0].split("T");
  const timeArray = dateTimeArray[1].split(':');
  return `${dateTimeArray[0]} ${timeArray[0]}:${timeArray[1]}`;
}
export default helper(formatDateTime);
