---
title: redux和react-redux结合书写计数器
---

1. 安装包

   ```js
   npm install redux
   npm install react-redux
   npm install redux-thunk //如果使用了异步action的话,需要安装
   npm install antd // ant-design UI组件库
   ```

2. `redux` 和`react-redux`结合,实现 UI 组件和容器组件分离

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Row, Col, Button } from 'antd';
import * as actions from '../../store/action';

//  mapStateToProps mapDispatchToProps 是容器组件,使用react-redux提供的connect进行连接
function mapStateToProps(state) {
  return { ...state };
}

function mapDispatchToProps(dispatch) {
  return {
    handlePlus: (value) => dispatch(actions.plusAction(value)),
    handleMinus: (value) => dispatch(actions.minusAction(value)),
    handleAsyncPlus: (value, time) => dispatch(actions.plusAsyncAction(value, time)),
    handleAsyncMinus: (value, time) => dispatch(actions.minusAsyncAction(value, time)),
  };
}

const options = [
  {
    value: 1,
    label: 1,
  },
  {
    value: 3,
    label: 3,
  },
  {
    value: 5,
    label: 5,
  },
  {
    value: 10,
    label: 10,
  },
];

// ui 组件
class Counter extends Component {
  state = {
    value: 1,
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  handlePlus = () => {
    const { value } = this.state;
    this.props.handlePlus(value);
  };

  handleMinus = () => {
    const { value } = this.state;
    this.props.handleMinus(value);
  };

  handleAsyncPlus = () => {
    const { value } = this.state;
    this.props.handleAsyncPlus(value, 1000);
  };

  handleAsyncMinus = () => {
    const { value } = this.state;
    this.props.handleAsyncMinus(value, 1000);
  };

  render() {
    const { value } = this.state;
    const { counter } = this.props;

    return (
      <>
        <Row>
          <Col
            span={24}
            style={{
              fontSize: '24px',
              color: '#409eff',
              textAlign: 'center',
            }}>
            {counter}
          </Col>
        </Row>
        <Row>
          <Col span={4} offset={8}>
            <Select style={{ width: '100%' }} onChange={this.handleChange} placeholder='请选择' options={options} allowClear value={value} />
          </Col>

          <Col span={8}>
            <Button type='primary' style={{ marginLeft: '10px' }} onClick={this.handlePlus}>
              plus
            </Button>
            <Button type='primary' style={{ marginLeft: '10px' }} onClick={this.handleMinus}>
              minus
            </Button>
            <Button type='primary' style={{ marginLeft: '10px' }} onClick={this.handleAsyncPlus}>
              async plus
            </Button>

            <Button type='primary' style={{ marginLeft: '10px' }} onClick={this.handleAsyncMinus}>
              async minus
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

let container = connect(mapStateToProps, mapDispatchToProps)(Counter);
export default { ...container, name: 'Counter' };
```

3. 详细的代码链接[点击此处](https://gitee.com/handsome19970114/react_counter/tree/master)
4. `npm run start`运行
