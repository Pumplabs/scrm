import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import cls from 'classnames';
import styles from './index.module.less';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function Droppable(props) {
  const {children, dropId, dragging, data, dropCls} = props
  
  const {isOver, setNodeRef} = useDroppable({
    id: dropId,
    data
  });

  return (
    <div
      ref={setNodeRef}
      className={cls({
        [styles.Droppable]: true,
        [dropCls]: dropCls,
        [styles.over]: isOver,
        [styles.dragging]: dragging,
        [styles.dropped]: children,
      })}
    >
      {children}
    </div>
  );
}
