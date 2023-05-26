import React, { Fragment, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableItem } from './SortableItem';

export default ({ dataSource = [], onChange, renderItem, uniqKey = 'id' }) => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd (event) {
    const { active, over } = event;

    if (active[uniqKey] !== over[uniqKey]) {
      if (typeof onChange === 'function') {
        const oldIndex = dataSource.findIndex(ele => ele[uniqKey] === active[uniqKey]);
        const newIndex = dataSource.findIndex(ele => ele[uniqKey] === over[uniqKey]);
        const nextItems = arrayMove(dataSource, oldIndex, newIndex);
        onChange(nextItems)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={dataSource}
        strategy={verticalListSortingStrategy}
      >
        {dataSource.map((item, idx) => {
          return <SortableItem
            id={item[uniqKey]}   
            key={item[uniqKey]}
          >
            {typeof renderItem === 'function' ? <Fragment key={item[uniqKey]}>
              {renderItem(item, idx)}
              </Fragment> : null}
          </SortableItem>
        })}
        {/* {dataSource.map(id => (
          <SortableItem
            key={id}
            id={id}
          />
        ))} */}
      </SortableContext>
    </DndContext>
  );
}