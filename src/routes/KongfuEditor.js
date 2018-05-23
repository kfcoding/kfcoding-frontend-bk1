import React from 'react';
import { connect } from 'dva';
import { Layout, Card, Button, Menu, Dropdown, Icon, Tree } from 'antd';
import MyHeader from "../components/Header";
import { getUserInfo } from "../services/example";
import { current, currentUser } from "../services/users";
import MyFooter from "../components/Footer";
import request from "../utils/request";
import { getOssToken } from "../services/kongfu";
import CannerEditor from 'kf-slate-editor';
import {Value} from 'slate';
import styles from './KongfuEditor.css';

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const TreeNode = Tree.TreeNode;

const Alioss = require('ali-oss');

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: '开始编写功夫秘籍！',
              }
            ],
          },
        ],
      },
    ],
  },
});

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
      <a style={{color: '#e05353', fontSize: '12px'}}><Icon type="close" style={{marginRight: '10px'}}/> 删除</a>
    </Menu.Item>
  </Menu>
);

class KongfuEditor extends React.Component {

  componentWillMount() {
    getOssToken(this.props.match.params.kongfu_id).then(res => {
      console.log(res)
      var client = new Alioss({
        region: 'oss-cn-hangzhou',
        accessKeyId: res.data.result.assumeRoleResponse.credentials.accessKeyId,
        accessKeySecret: res.data.result.assumeRoleResponse.credentials.accessKeySecret,
        stsToken: res.data.result.assumeRoleResponse.credentials.securityToken,
        bucket: 'kfcoding'
      });
      console.log(client.signatureUrl('20/logo-min.png'))
    })
  }

  state = {
    value: initialValue,
    pages: []
  }

  addPage = () => {
    this.state.pages.push({
      title: '新章节',
      content: '',
      children: [{
        title: 'new',
        content: '',
        children:[{
          title: 'ok',
          children: []
        }]
      }]
    });
    this.forceUpdate()
  }

  renderItem = (item) => {
    if (item.children.length === 0) {
      return (
        <Menu.Item className={styles.menu}>
          <span contentEditable={true}>{item.title}</span>
          <span className={styles.dropdown}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a href="#">
              <Icon type="ellipsis"/>
            </a>
          </Dropdown>
          </span>
        </Menu.Item>
      )
    } else {
      let children = item.children.map(child => {
        return this.renderItem(child);
      });
      return (
        <SubMenu title={item.title}>
          {children}
        </SubMenu>
      );

    }

  }

  render() {
    const {value, pages} = this.state;
    const onChange = ({value}) => this.setState({value});

    let rpages = pages.map(page => {
      return this.renderItem(page);
    })

    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.title} title={
          <div className={styles.menu}>{item.title} <span className={styles.dropdown} style={{float: 'right'}}><Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" href="#">
                        <Icon type="ellipsis"/>
                      </a>
                    </Dropdown></span></div>} style={{width: '100%'}}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.title} title={item.title} />;
    });

    return (
      <Layout>
        <MyHeader/>
        <Content style={{padding: '40px 50px 50px 50px'}}>
          <Layout style={{padding: '24px 0', background: '#fff', minHeight: '800px'}}>
            <Sider width={250} style={{background: '#fff'}}
                   breakpoint="lg"
                   collapsedWidth="0"
                   trigger="null"
                   onCollapse={(collapsed, type) => {
                     console.log(collapsed, type);
                   }}
            >

              
              <a style={{paddingLeft: '20px', display: 'block'}} onClick={this.addPage}><Icon type='plus'/> 新增章节</a>
              <Tree
                className="draggable-tree"
                defaultExpandedKeys={this.state.expandedKeys}
                draggable
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
              >
                {loop(this.state.pages)}
              </Tree>
            </Sider>
            <Content>
              <div style={{padding: '20px', height: '100%'}}>
                <CannerEditor
                  value={value}
                  onChange={onChange}
                  style={{height: '100%'}}
                />
              </div>

            </Content>
          </Layout>
        </Content>
        <MyFooter/>
      </Layout>
    );
  }
}

export default (KongfuEditor);
