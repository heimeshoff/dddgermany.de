require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

var component = require('./component');

document.body.appendChild(component());
