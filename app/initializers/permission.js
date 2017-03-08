export function initialize(application) {
  application.inject('route', 'permission', 'service:permission');
  application.inject('controller', 'permission', 'service:permission');
  application.inject('component', 'permission', 'service:permission');
}

export default {
  name: 'permission',
  initialize
};
