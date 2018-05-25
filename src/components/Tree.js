import React from 'react';
import styles from 'Tree.css';

class Tree extends React.Component {

  render() {
    return (
      <ul>
        <li>
          <div>title</div>
          <ul>
            <li>
              <div>subtitle</div>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

export default Tree;
