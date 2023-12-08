/* FA equivalengt of drag handle grip-vertical */
import { useState } from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


let dataTasks1 =
    [
        {
            id: '1', title:'Task 1', due: '2023-12-12', project: 'Project name', private: true, collaborators: []},
        {
            id: '2', title:'Task 2', due: '2023-12-13', project: 'Project name', private: true, collaborators: []},
        {
            id: '3', title:'Task 3', due: '2023-12-14', project: 'Project name', private: true, collaborators: []},
        {
            id: '4', title:'Task 4', due: '2023-12-15', project: 'Project name', private: true, collaborators: []}]

let dataTasks2 =
    [
        {
            id: '5', title:'Task 5', due: '2023-12-16', project: 'Project name', private: true, collaborators: []},
        {
            id: '6', title:'Task 6', due: '2023-12-17', project: 'Project name', private: true, collaborators: []},
        {
            id: '7', title:'Task 7', due: '2023-12-18', project: 'Project name', private: true, collaborators: []},
        {
            id: '8', title:'Task 8', due: '2023-12-19', project: 'Project name', private: true, collaborators: []}]

let dataTasks3 =
    [
        {
            id: '9', title:'Task 9', due: '2023-12-20', project: 'Project name', private: true, collaborators: []},
        {
            id: '10', title:'Task 10', due: '2023-12-21', project: 'Project name', private: true, collaborators: []},
        {
            id: '11', title:'Task 11', due: '2023-12-22', project: 'Project name', private: true, collaborators: []},
        {
            id: '12', title:'Task 12', due: '2023-12-23', project: 'Project name', private: true, collaborators: []}]

let dataTasks4 =
    [
        {
            id: '13', title:'Task 13', due: '2023-12-24', project: 'Project name', private: true, collaborators: []},
        {
            id: '14', title:'Task 14', due: '2023-12-25', project: 'Project name', private: true, collaborators: []},
        {
            id: '15', title:'Task 15', due: '2023-12-26', project: 'Project name', private: true, collaborators: []},
        {
            id: '16', title:'Task 16', due: '2023-12-27', project: 'Project name', private: true, collaborators: []}]



    let dataSections = [
        {id: 'a', name: 'Unassigned', tasks: dataTasks1},
        {id: 'b', name: 'Do today', tasks: dataTasks2},
        {id: 'c', name: 'Do this week', tasks: dataTasks3},
        {id: 'd', name: 'Do later', tasks: dataTasks4}]


    // let dataTasks = dataSections[0].dataTasks


export default function SectionTableListHeader() {
    const [sections, setSections] = useState(dataSections)
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

            const copySrcTasks = [...sections[sourceIdx].tasks];
            const copyDestTasks = source.droppableId !== destination.droppableId
                ? [...sections[destinationIdx].tasks]
                : copySrcTasks;

            console.log("COPY BEFORE move", copyDestTasks)

            const [movedTask] = copySrcTasks.splice(source.index, 1);
            copyDestTasks.splice(destination.index, 0, movedTask);

            console.log("COPY AFTER move", copyDestTasks)

            const newSections = [...sections]
            newSections[sourceIdx] = {...newSections[sourceIdx], tasks: copySrcTasks}
            newSections[destinationIdx] = {...newSections[destinationIdx], tasks: copyDestTasks}
            setSections(newSections);

            console.log("SRC section tasks AFTER move", sections[destinationIdx].tasks)
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
    <Droppable droppableId={id}>
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
                    <td>{task.collaborators}</td>
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
