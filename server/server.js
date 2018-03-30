const express = require('express');
const axios = require('axios');
const path = require('path');
const morgan = require('morgan');
const restaurantsInfoRouter = require('./routes/routes.js');
const bundleRouter = require('./routes/bundleRouter.js');
const port = process.env.PORT || 4001;
const sidebarAPI = process.env.SIDEBAR || 'http://localhost:3003'

const app = express();
app.use(morgan('dev'));

app.use('/lib', express.static('public/lib'));
app.use('/services', express.static(path.join(__dirname, '../public/services')));
//app.use('/services', express.static(path.join(__dirname, './public/services')));

const clientBundles = path.join(__dirname, '../public/services');
const serverBundles = path.join(__dirname, './templates/services');
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');



const renderComponents = async (components, props = {}) => {
  // return Object.keys(components).map(item => {
  //   let component = React.createElement(components[item], props);
  //   return ReactDom.renderToString(component);
  // });

  const results = {};
  for (item in components) {
    const url = `${sidebarAPI}/api/restaurants/${props.itemid}/${item}`;
    const response = await axios.get(url);
    let component = React.createElement(components[item], response.data);
    // console.log(props, 'im the props');
    // console.log(response.data, 'im the data');
    results[item] = { string: ReactDom.renderToString(component), props: response.data };
  }
  
  return results;
}

app.get('/restaurants/:id', async function(req, res){
  //console.log(req.params.id, 'im the req.params.id')
  
  let components = await renderComponents(services, {itemid: req.params.id});
  res.end(Layout(
    'WeGot SSR',
    //... or no ...
    App(components),
    // components or no components
    Scripts(Object.keys(services), components)

  ));
 
});



// app.get('/', (req, res) => {
//   res.redirect('/restaurants/ChIJUcXYWWGAhYARmjMY2bJAG2s/');
// })

// app.use('/restaurants/:id', express.static('public'));
// app.get('/restaurants/:id/:widget/bundle.js', bundleRouter);

// app.get('/api/restaurants/:id/:widget', restaurantsInfoRouter);

app.listen(port, () => {
  console.log('Proxy listening on port 4001');
});
