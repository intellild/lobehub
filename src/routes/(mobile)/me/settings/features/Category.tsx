'use client';
import { Fragment, memo } from 'react';

import Cell from '@/components/Cell';
import Divider from '@/components/Cell/Divider';

import styles from './Category.module.css';
import { useCategory } from './useCategory';

const Category = memo(() => {
  const groups = useCategory();

  return (
    <>
      {groups.map((group, groupIndex) => (
        <Fragment key={group.key}>
          {groupIndex > 0 && <Divider />}
          <div className={styles.groupTitle}>{group.title}</div>
          {group.items.map(({ key, ...item }) => (
            <Cell key={key} {...item} />
          ))}
        </Fragment>
      ))}
    </>
  );
});

export default Category;
