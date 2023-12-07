/* FA equivalengt of drag handle grip-vertical */
import { useState } from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function SectionTableListHeader() {
    // const [sections, setSections] = useState([])
    // const [tasks, setTasks] = useState([])
    // // const dispatch = useDispatch();

    // setSections(['Unassigned', 'Do today', 'Do this week', 'Do tlater'])
    // setTasks(

let tasks =
    [
        {
            id: '1', title:'Task 1', due: '2023-12-12', project: 'Project name', private: true, collaborators: []},
        {
            id: '2', title:'Task 2', due: '2023-12-13', project: 'Project name', private: true, collaborators: []},
        {
            id: '3', title:'Task 3', due: '2023-12-14', project: 'Project name', private: true, collaborators: []},
        {
            id: '4', title:'Task 4', due: '2023-12-15', project: 'Project name', private: true, collaborators: []}]

    // )


    const handleDragEnd = (result) => {
        const {destination, source, draggableId} = result;
        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // const newSections = [...sections];
        // const deletedItem = newSections.splice(source.index, 1);
        // newSections.splice(destination.index, 0, deletedItem);

        // setSections(newSections);
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

<Droppable droppableId='sections'>
    {(provided) => (
            <tbody ref={provided.innerRef} {...provided.droppableProps} >
                {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                                <tr {...provided.draggableProps} ref={provided.innerRef}>
    <td style={{width: 50}} {...provided.dragHandleProps}>
        <i className="fas fa-grip-vertical"></i>
    </td>
    <td>{task.title}</td>
    <td>{task.due}</td>
    <td>{task.project}</td>
    <td>{`${task.private ? 'Private' : 'Public'}`}</td>
    <td>{task.collaborators}</td>
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
