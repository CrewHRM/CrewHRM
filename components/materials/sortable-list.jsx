import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export function SortableList(props) {
	const onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const items = reorder(props.items, result.source.index, result.destination.index);

		props.onReorder(
			items.map((item) => {
				delete item.rendered;
				return item;
			})
		);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => {
					const { isDraggingOver, isDragging } = snapshot;
					return (
						<div
							data-crewhrm-selector="sortable"
							className={
								'd-flex flex-direction-column'.classNames() +
                                (props.className || '')
							}
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{props.items.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={'_' + item.id}
									index={index}
									isDragDisabled={props.disabled ? true : false}
								>
									{(provided, snapshot) => {
										return (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												{item.rendered}
											</div>
										);
									}}
								</Draggable>
							))}

							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
}
