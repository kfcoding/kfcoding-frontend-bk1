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
import { Value } from 'slate';
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


class KongfuEditor extends React.Component {



  constructor(props) {
    super(props)
    this.state = {
      kongfu_id: this.props.match.params.kongfu_id,
      value: initialValue,
      pages: [],
      ossclient: null,
      currentPage: null,
      currentValue: null,
      pagesLink: [],
      meta: null,
      dirty: false
    };

    this.saveTimer();
  }

  componentWillMount() {
    let kongfu_id = this.props.match.params.kongfu_id;
    getOssToken(kongfu_id).then(res => {
      console.log(res)
      var client = new Alioss.Wrapper({
        region: 'oss-cn-hangzhou',
        accessKeyId: res.data.result.assumeRoleResponse.credentials.accessKeyId,
        accessKeySecret: res.data.result.assumeRoleResponse.credentials.accessKeySecret,
        stsToken: res.data.result.assumeRoleResponse.credentials.securityToken,
        bucket: 'kfcoding'
      });
      this.state.ossclient = client;

      request(client.signatureUrl(kongfu_id + '/meta.json')).then(res => {

        // meta.json contains pages meta info
        if (res.err && res.err.response.status === 404) {
          let meta = {
            id: kongfu_id,
            pages: []
          };
          client.put(kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(meta)));
          this.setState({meta: meta})
        } else {
          //let pages = res.data.pages;
          //this.setState({pages: pages});
          this.setState({meta: res.data});
        }
      })
    })
  }

  saveTimer() {
    setInterval(() => {
      if (this.state.dirty) {
        let page = this.state.currentPage;

        let filename = this.state.kongfu_id + '/' + page.file;
        let pushdata = this.state.currentValue.toJSON();

        this.state.ossclient.put(filename, new Alioss.Buffer(JSON.stringify(pushdata))).then(() => {
          this.state.dirty = false;
        })
      }
    }, 5000)

  }

  addPage = () => {
    var title = prompt('请输入章节名称', '新章节');
    let page_id = new Date().getTime();
    let page = {
      title: title,
      file: page_id + '.json'
      // content: Value.fromJSON(initialValue),
    };
    //this.state.pages.push(page);
    this.state.meta.pages.push(page);

    this.state.ossclient.put(this.state.kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(this.state.meta)));

    let pushdata = initialValue;

    let filename = this.state.kongfu_id + '/' + page_id + '.json';

    this.state.ossclient.put(filename, new Alioss.Buffer(JSON.stringify(pushdata))).then(() => {
      this.state.currentPage = page;
      this.setState({currentValue: Value.fromJSON(initialValue)});
    })

  }

  openPage = ({key}) => {
    let page;
    this.state.meta.pages.forEach(p => {
      if (p.file == key) {
        page = p;
      }
    })
    if (!page)
      return;
    request(this.state.ossclient.signatureUrl(this.state.kongfu_id + '/' + page.file)).then(res => {
      this.state.currentPage = page;
      this.setState({currentValue: Value.fromJSON(res.data)});
    })
  }

  onContentChange = ({value}) => {


    this.setState({currentValue: value});
    if (value.document != this.state.currentValue.document) {
      this.state.dirty = true;
    }
  }

  changeTitle(page, e) {
    page.title = e.target.value;
    this.forceUpdate()
    e.target.focus()
  }

  render() {
    const {value, meta} = this.state;
    if (!meta) return null;
    let rpages = meta.pages.map(page => {
      let onMenuClick = ({key}) => {
        if (key == 'remove') {
          for (var i in meta.pages) {
            if (meta.pages[i] === page) {
              meta.pages.splice(i, 1);
              this.state.ossclient.put(this.state.kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(this.state.meta))).then(() => {
                this.setState({currentPage: null})
              });
              break;
            }
          }
        }
      }
      let menu = (
        <Menu onClick={onMenuClick}>
          {/*<Menu.Item key="0">*/}
            {/*<a style={{fontSize: '12px'}}><Icon type="edit" style={{marginRight: '10px'}}/> 重命名</a>*/}
          {/*</Menu.Item>*/}
          {/*<Menu.Item key="1">*/}
            {/*<a style={{fontSize: '12px'}}><Icon type="link" style={{marginRight: '10px'}}/> 复制地址</a>*/}
          {/*</Menu.Item>*/}
          {/*<Menu.Divider/>*/}
          <Menu.Item key="remove">
            <a style={{color: '#e05353', fontSize: '12px'}}><Icon type="close" style={{marginRight: '10px'}}/> 删除</a>
          </Menu.Item>
        </Menu>
      );


      return (
        <Menu.Item className={styles.menu} key={page.file} onClick={this.openPage}>
          {page.titleEditable ?
            <input type='text' value={page.title} onChange={this.changeTitle.bind(this, page)}/>
            :
            <span>{page.title}</span>
          }
          <span className={styles.dropdown}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a href="#">
              <Icon type="ellipsis"/>
            </a>
          </Dropdown>
          </span>
        </Menu.Item>
      )
    });

    let editor = this.state.currentPage ? (
      <CannerEditor
        value={this.state.currentValue}
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
