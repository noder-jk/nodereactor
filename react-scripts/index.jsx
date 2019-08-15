import React from 'react';
import ReactDOM from 'react-dom';
import App from './NodeReactorApp';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App/>, document.getElementById('root'));

if(module.hot){module.hot.accept()};

serviceWorker.register();