import React from 'react';
import { connect } from 'dva';
import { Layout, Card, Button, Menu, Dropdown, Icon } from 'antd';
import MyHeader from "../components/Header";
import { getUserInfo } from "../services/example";
import { current, currentUser } from "../services/users";
import MyFooter from "../components/Footer";
import request from "../utils/request";
import { getOssToken } from "../services/kongfu";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a style={{fontSize: '12px'}}><Icon type="edit" style={{marginRight: '10px'}}/> 重命名</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a style={{fontSize: '12px'}}><Icon type="link" style={{marginRight: '10px'}}/> 复制地址</a>
    </Menu.Item>
    <Menu.Divider/>
    <Menu.Item key="2">
      <a style={{color: '#e05353', fontSize: '12px'}}><Icon type="close" style={{marginRight: '10px'}}/>
        删除</a>
    </Menu.Item>
  </Menu>
);

class KongfuEditor extends React.Component {

  componentWillMount() {
    getOssToken(this.props.match.params.kongfu_id).then(res => console.log(res))
  }

  render() {
    return (
      <Layout style={{height: '100%'}}>

        <MyHeader/>
        <Content style={{padding: '40px 50px'}}>

          <Layout style={{padding: '24px 0', background: '#fff'}}>
            <Sider width={250} style={{background: '#fff'}}
                   breakpoint="lg"
                   collapsedWidth="0"
                   trigger="null"
                   onCollapse={(collapsed, type) => {
                     console.log(collapsed, type);
                   }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{height: '100%'}}
              >
                <SubMenu key="sub1" title={<span>ubnav 1</span>}>
                  <Menu.Item key="1">option1
                    <span style={{float: 'right'}}>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" href="#">
                        <Icon type="ellipsis"/>
                      </a>
                    </Dropdown>
                    </span>
                  </Menu.Item>
                  <Menu.Item key="2">option2</Menu.Item>
                </SubMenu>

                <Menu.Item key="9">option8</Menu.Item>
              </Menu>
            </Sider>
            <Content>
              /* editor goes here */
            </Content>
          </Layout>
        </Content>
        <MyFooter/>
      </Layout>
    );
  }
}

export default (KongfuEditor);
