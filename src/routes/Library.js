import React from 'react';
import { connect } from 'dva';
import styles from './Library.css';
import { Layout, Menu, Row, Col, Card, Icon, Avatar, Divider, Dropdown, Modal, Button, Form, Input } from 'antd';
import CreateKongfuModal from "../components/CreateKongfuModal";
import MyHeader from "../components/Header";
import request from "../utils/request";
import Book from "../components/Book";
import { getMyKongfu } from "../services/users";
import MyFooter from "../components/Footer";
import { createKongfu} from "../services/kongfu";

const {Content, Footer} = Layout;
const {Meta} = Card;


class Library extends React.Component {
  state = {
    loading: false,
    visible: false,
    kongfus: [],
    isRefresh: false
  }

  componentWillMount() {
    getMyKongfu().then(res => {
      this.setState({kongfus: res.data.result.courses})
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({visible: false});
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var user = JSON.parse(localStorage.getItem('user'));
      values['author'] = user.name;
      values['userId'] = user.id
      console.log('Received values of form: ', values);
      createKongfu(values).then(res => {
        getMyKongfu().then(res => {
          this.setState({kongfus: res.data.result.courses})
          this.setState({visible: false})
        })
      })
    })
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    const {visible, loading} = this.state;

    let kongfus = this.state.kongfus.map((kf) => {
      let href = '/editor/' + kf.id;
      return (
        <div>
          <a href={href} >
            <Book key={kf.id} book={kf}/>
          </a>
        </div>
      )
    })

    return (
      <Layout className="layout" style={{height: '100%'}}>
        <MyHeader/>
        <Content style={{height: '100%', background: '#fff'}}>
          <div style={{padding: '10px 50px'}}>
            <Divider orientation="left" style={{fontSize: '28px'}}>藏经阁</Divider>
            {kongfus}
            <a onClick={this.showModal}>
              <div className={styles.container} >
                <div className={styles.book}>
                  <div className={styles.front}>
                    <div className={styles.addCover}>
                      <h2>
                        <span>添加秘籍</span>
                      </h2>
                    </div>
                  </div>

                  <div className={styles['left']}>
                    <h2>
                      <span>作者</span>
                      <span>名称</span>
                    </h2>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </Content>
        <MyFooter/>
        <CreateKongfuModal
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </Layout>
    );
  }


}

Library.propTypes = {};

export default connect()(Library);
