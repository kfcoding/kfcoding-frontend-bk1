import React from 'react';
import { Layout, Dropdown, Avatar, Icon, Menu } from 'antd';

const { Header } = Layout;

const menu = (
  <Menu style={{marginTop: '10px'}}>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/"><Icon type="user"/> 个人信息</a>
    </Menu.Item>
    <Menu.Divider/>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/"><Icon type="poweroff"/> 退出</a>
    </Menu.Item>
  </Menu>
);

class MyHeader extends React.Component {
  render() {
    return (
      <Header>
        <span style={{color: '#fff', fontSize: '24px'}}>
          <a href="/" style={{color: '#fff'}}><Icon type="dribbble-square"/> 功夫编程</a>
        </span>
        <span style={{float: 'right'}}>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              <Avatar icon="user"/>
              <span style={{color: '#fff', padding: '0 15px'}}>guodong</span>
              <Icon type="down" style={{color: '#fff'}}/>
            </a>
          </Dropdown>

        </span>
      </Header>
    )
  }
}

export default MyHeader;
