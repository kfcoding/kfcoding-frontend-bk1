import React from 'react';
import { connect } from 'dva';
import { Layout, Card, Button } from 'antd';
import MyHeader from "../components/Header";
import { getUserInfo } from "../services/example";
import { current, currentUser } from "../services/users";
import { openWindow} from "../utils/openWindow";

const {Content, Footer} = Layout;



class Signin extends React.Component {

  login = () => {
    openWindow(
      'https://github.com/login/oauth/authorize?client_id=1eb243e826a117b3e138',
      '登录',
      600,
      600
    );
    window.addEventListener('message', (m) => {
      localStorage.setItem('token', m.data.token);
      currentUser().then(res => { console.log(res)
        localStorage.setItem('uid', res.data.result.user.id);
        localStorage.setItem('user', JSON.stringify(res.data.result.user));
        window.location.replace('/library');

      });
    })
  }

  render() {
    return (
      <Layout style={{height: '100%'}}>
        <MyHeader/>
        <Content>
          <div style={{padding: '50px'}}>
            <Card title="登峰造极" bordered={false} style={{width: 500, margin: '0 auto'}}>
              <Button type='primary' icon='github' size='large' onClick={this.login}>Github登录</Button>
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }
}

Signin.propTypes = {};

export default connect()(Signin);
