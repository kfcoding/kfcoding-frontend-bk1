import React from 'react';
import { Router, Route, Switch, Brow } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Library from "./routes/Library";
import Signin from "./routes/Signin";
import Callback from "./routes/Callback";
// import KongfuEditor from "./routes/KongfuEditor";
import KongfuReader from "./routes/KongfuReader";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/library" exact component={Library}/>
        <Route path='/signin' exact component={Signin}/>
        <Route path='/callback' component={Callback}/>
        {/*<Route path='/editor/:kongfu_id' component={KongfuEditor}/>*/}
        <Route path='/reader/:kongfu_id' component={KongfuReader}/>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
