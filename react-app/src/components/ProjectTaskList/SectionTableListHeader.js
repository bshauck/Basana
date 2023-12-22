/* FA equivalengt of drag handle grip-vertical */
import { useState } from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


export default function SectionTableListHeader({project}) {

    // dataSections = [
    //     {id: '1'', name: 'Unassigned', tasks: 'tasks'}
    // ]
    const [sections, setSections] = useState('dataSections')
    // const dispatch = useDispatch();

    const handleDragEnd = (result) => {
        const {destination, source, type} = result;
        if (!destination) return;

        if (destination.droppableId === source.droppableId
            && destination.index === source.index)
            return;

        if (type === 'section') {
            const copySections = [...sections];
            const [movedSection] = copySections.splice(source.index, 1);
            copySections.splice(destination.index, 0, movedSection);
            setSections(copySections);
            /* TODO: update the database */
        }
        else if (type === 'task') { /* have to find section list */
            const sourceIdx = sections.findIndex(s => s.id === source.droppableId);
            const destinationIdx = sections.findIndex(s => s.id === destination.droppableId);

            const copySrcTasks = [...sections[sourceIdx].tasks].map(e => structuredClone(e))
            const copyDestTasks = source.droppableId !== destination.droppableId
                ? [...sections[destinationIdx].tasks].map(e => structuredClone(e))
                : copySrcTasks;

            const [movedTask] = copySrcTasks.splice(source.index, 1);
            copyDestTasks.splice(destination.index, 0, {...movedTask});

            const newSections = [...sections]
            newSections[sourceIdx] = {...newSections[sourceIdx], tasks: copySrcTasks}
            newSections[destinationIdx] = {...newSections[destinationIdx], tasks: copyDestTasks}
            setSections(newSections);
            /* TODO: update the database */
        }
    }

    return (
    <>
        <DragDropContext onDragEnd={handleDragEnd}>
            <table>
                <thead>
                    <tr>
                        <th>Task name</th>
                        <th>Due date</th>
                        <th>Project</th>
                        <th>Visibility</th>
                        <th>Collaborators</th>
                        <th>Extra</th>
                    </tr>
                </thead>
<Droppable droppableId='ROOT' type="section"  >
    {(provided) => (
        <tbody ref={provided.innerRef} {...provided.droppableProps} >
            {sections.map((section, index) => (
                <Draggable key={section.id+section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                        <tr  {...provided.dragHandleProps} {...provided.draggableProps}  ref={provided.innerRef}   >
                            <div>
                            <DroppableTaskList {...section} />
                            </div>
                        </tr>
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </tbody>
    )}
</Droppable>
            </table>
        </DragDropContext>
    </>
    )
}

function DroppableTaskList({name, tasks, id}) {
  return (
    <table>
    <Droppable droppableId={id} type='task'>
      {(provided) => (
        <tbody ref={provided.innerRef} {...provided.droppableProps} >
          <tr>
            <td style={{width: 30}} {...provided.dragHandleProps}>
              <i className="fas fa-grip-vertical"></i>
            </td>
            <td>{name}</td>
            <td style={{width: 500}}{...provided.dragHandleProps} ></td>
          </tr>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <tr {...provided.draggableProps} ref={provided.innerRef} key={task.id} >
                    <td style={{width: 30}} {...provided.dragHandleProps}>
        <             i className="fas fa-grip-vertical"></i>
                    </td>
                    <td>{task.title}</td>
                    <td>{task.due}</td>
                    <td>{task.project}</td>
                    <td>{`${!task.private ? 'Public' : 'Private' }`}</td>
                    <td>{task.members}</td>
                    <td style={{width: 400}}{...provided.dragHandleProps} ></td>
                  </tr>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </tbody>
      )}
    </Droppable>
    </table>
  )
}
















// export default function SectionTableListHeader() {
//     return (
//     <span> Task name              Due date              Project Visibility                                   Collaborators
//     </span>
//     )
// }



/*
<div className="sectionTaskName">Task name</div>
            <div className="sectionDueDate">Due date</div>
            <div className="sectionProjectName">Project</div>
            <div className="sectionVisibility">Visibility</div>
            <div className="sectionCollaborators">Collaborators</div>
            <div className="sectionEnd">Extra</div>

*/
