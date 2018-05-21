import React from 'react';
import styles from '../routes/IndexPage.css';

class Book extends React.Component {
  render() {
    let {title, author} = this.props.book;
    return (
      <div className={styles.container}>
        <div className={styles.book}>
          <div className={styles.front}>
            <div className={styles.cover}>
              <h2>
                <span>{author}</span>
                <span>{title}</span>
              </h2>
            </div>
          </div>

          <div className={styles['left']}>
            <h2>
              <span>{author}</span>
              <span>{title}</span>
            </h2>
          </div>
        </div>

      </div>
    )
  }
}

export default Book;
