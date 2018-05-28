import React from 'react';
import { connect } from 'dva';
import { Layout, Card, Button, Menu, Dropdown, Icon, Tree } from 'antd';
import MyHeader from "../components/Header";
import { getUserInfo } from "../services/example";
import { current, currentUser } from "../services/users";
import MyFooter from "../components/Footer";
import request from "../utils/request";
import { getOssToken } from "../services/kongfu";
import CannerEditor from 'canner-slate-editor';
import {Value} from 'slate';
import styles from './KongfuEditor.css';

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const TreeNode = Tree.TreeNode;

const Alioss = require('ali-oss');

const initialValue = ({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [{
              text: '请开始你的表演！'
            }],
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

  state = {
    value: initialValue,
    pages: [],
    ossclient: null,
    currentPage: null,
    currentValue: null
  };

  componentWillMount() {
    getOssToken(this.props.match.params.kongfu_id).then(res => {
      console.log(res)
      var client = new Alioss.Wrapper({
        region: 'oss-cn-hangzhou',
        accessKeyId: res.data.result.assumeRoleResponse.credentials.accessKeyId,
        accessKeySecret: res.data.result.assumeRoleResponse.credentials.accessKeySecret,
        stsToken: res.data.result.assumeRoleResponse.credentials.securityToken,
        bucket: 'kfcoding'
      });
      console.log(client.signatureUrl('20/logo-min.png'))
      this.state.ossclient = client;
    })
  }

  addPage = () => {
    let page = {
      id: new Date().getTime(),
      title: '新章节',
      content: Value.fromJSON(initialValue),
    };
    this.state.pages.push(page);

    let pushdata = {
      id: page.id,
      title: page.title,
      content: page.content.toJSON()
    };

    let filename = this.props.match.params.kongfu_id + '/' + page.id + '.json';

    //this.state.ossclient.put(filename, new Alioss.Buffer(JSON.stringify(pushdata))).then(() => {
      this.state.currentPage = page;
      this.state.currentValue = Value.fromJSON(page.content);
      this.forceUpdate()
    //})

  }

  renderItem = (item) => {
    return (
      <Menu.Item className={styles.menu} key={Math.random()}>
        <span>{item.title}</span>
        <span className={styles.dropdown}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a href="#">
              <Icon type="ellipsis"/>
            </a>
          </Dropdown>
          </span>
      </Menu.Item>
    )
  }

  onContentChange = ({value}) => {
    if (value.document == this.state.currentValue.document) {
      //return;
    }
    let page = this.state.currentPage;

    let filename = this.props.match.params.kongfu_id + '/' + page.id + '.json';
    let pushdata = {
      id: page.id,
      title: page.title,
      content: value.toJSON()
    };

    //this.state.ossclient.put(filename, new Alioss.Buffer(JSON.stringify(pushdata))).then(() => {
    //})

    this.setState({currentValue: value});
  }

  render() {
    const {value, pages} = this.state;
    const onChange = ({value}) => this.setState({currentValue: value});

    let rpages = pages.map(page => {
      return this.renderItem(page);
    });

    let editor = this.state.currentPage ? (
      <CannerEditor
        value={this.state.currentValue}
        //value={this.state.value}
        onChange={this.onContentChange}
        style={{height: '100%'}}
        placeholder='请开始你的表演！'
      />
    ) : null;

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
              <Menu
                mode="inline"
              >
                {rpages}

              </Menu>

              <a style={{paddingLeft: '20px', display: 'block'}} onClick={this.addPage}><Icon type='plus'/> 新增章节</a>

            </Sider>
            <Content>
              <div style={{padding: '20px', height: '100%'}}>
                {/*<Kfeditor/>*/}
                {editor}
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
