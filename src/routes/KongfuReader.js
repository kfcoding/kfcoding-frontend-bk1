import React from 'react';
import { Layout, Card, Button, Menu, Dropdown, Icon, Tree } from 'antd';
import MyHeader from "../components/Header";
import MyFooter from '../components/Footer';
import CannerEditor from 'kf-slate-editor';
import { Value } from 'slate';

import request from "../utils/request";

const Alioss = require('ali-oss');
const {Header, Content, Footer, Sider} = Layout;

class KongfuReader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      kongfu_id: this.props.match.params.kongfu_id,
      ossclient: null,
      currentPage: null,
      currentValue: null,
      meta: null,
      prefix: 'http://oss.book.kfcoding.com/' + this.props.match.params.kongfu_id
    };
  }

  componentWillMount() {
    let kongfu_id = this.state.kongfu_id;
    var client = new Alioss.Wrapper({
      region: 'oss-cn-hangzhou',
      accessKeyId: '1',
      accessKeySecret: '2',
      stsToken: '3',
      bucket: 'kfcoding'
    });
    this.state.ossclient = client;

    request(this.state.prefix + '/meta.json').then(res => {

        this.setState({meta: res.data});
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
    request(this.state.prefix + '/' + page.file).then(res => {
      this.state.currentPage = page;
      this.setState({currentValue: Value.fromJSON(res.data)});
    })
  }

  render() {
    const {meta} = this.state;
    if (!meta) return null;

    let rpages = meta.pages.map(page => {

      return (
        <Menu.Item key={page.file} onClick={this.openPage}>
          <span>{page.title}</span>
        </Menu.Item>
      )
    });

    let editor = this.state.currentPage ? (
      <CannerEditor
        value={this.state.currentValue}
        style={{height: '100%'}}
        readOnly={true}
      />
    ) : null;

    return (
      <Layout>
        <MyHeader/>
        <Content style={{padding: '40px 50px 50px 50px'}}>
          <Layout style={{padding: '24px 0', background: '#fff', minHeight: '800px'}}>
            <Sider width={250} style={{background: '#fff', marginTop: '20px'}}
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

export default KongfuReader;
