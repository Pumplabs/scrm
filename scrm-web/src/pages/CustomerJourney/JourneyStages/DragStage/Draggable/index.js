import React, { forwardRef } from 'react'
import classNames from 'classnames'
import { useDraggable } from '@dnd-kit/core'
import styles from './index.module.less'

const Wrap = ({ dragId, data, children }) => {
  const { isDragging, setNodeRef, listeners,  } = useDraggable({
    id:dragId,
    data,
  })
  return (
    <DragContent
      listeners={listeners}
      ref={setNodeRef}
      isDragging={isDragging}
      children={children}
    />
  )
}
const DragContent = forwardRef((props, ref) => {
  const { handle, dragOverlay, isDragging, listeners, children} = props
  return (
    <div
      className={classNames({
        [styles.Draggable]: true,
        [styles.dragOverlay]: dragOverlay,
        [styles.dragging]: isDragging,
        [styles.handle]: handle,
      })}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
      ref={ref} 
      {...(handle ? {} : listeners)}
      tabIndex={handle ? -1 : undefined}
      >
        {children}
    </div>
  )
})
export { DragContent }
export default Wrap