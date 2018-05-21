import React from 'react';
import { Layout, Dropdown, Avatar, Icon, Menu } from 'antd';

const { Footer } = Layout;

class MyFooter extends React.Component {
  render() {
    return (
      <Footer style={{background: '#fff'}}>
        功夫编程 KFCoding.com 2018
      </Footer>
    )
  }
}

export default MyFooter;
