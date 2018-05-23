import React from 'react';
import { connect } from 'dva';
import { Layout, Card, Button } from 'antd';
import MyHeader from "../components/Header";
import { getUserInfo } from "../services/example";
import { current, currentUser } from "../services/users";

const {Content, Footer} = Layout;

function openWindow(url, title, w, h) {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

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
