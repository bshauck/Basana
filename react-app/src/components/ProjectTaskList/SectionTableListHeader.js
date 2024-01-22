/* FA equivalengt of drag handle grip-vertical */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getWSAssignedTasks, getWSInternalSections } from "../../store/workspace"



export default function SectionTableListHeader({team}) {
  const dispatch = useDispatch()
    const dataSections = useDataList(team)
    const [sections, setSections] = useState(dataSections)

  useEffect(() => {
    if (!dataSections || !dataSections.length) return

  }, [dispatch, dataSections])

    function useDataList(team) {
      const sections = useSelector(getWSInternalSections(team))
      const tasks = useSelector(getWSAssignedTasks(team))

      if (!sections || !sections.length) {
        return []
      }
      const result = []
      const copySections = [...sections]
      for (let i = 0; i < sections.length; i++) {
        let next = copySections.pop()
        result.push({id: i.toString(),
                    name: next.name,
                    tasks: []})
      }
      // const today = datetime.now(timezone.utc)

      const today = Date.now() // in milliseconds
      const oneDay = 24 * 60 * 60 * 1000
      const oneWeek = 8 * oneDay
      const twoWeeks = 15 * oneDay

      const copyTasks = [...tasks]
      while (copyTasks.length) {
        const next = copyTasks.pop()
        next.id = next.id.toString()
        const date = Date.parse(next.due)
        let index = 1
        if (date < today) index = 0 // "Untitled section" over due (red)
        else if (date < today + oneDay) index = 2 // "Do today" due today (green)
        else if (date < today + oneWeek) index = 3 // "Do next week" due < today + 8 days (blue)
        else if (date < today + twoWeeks) index = 4 // "Do later" due < today + 8 days (blue)
        result[index].tasks.push(next)
      }
      for (const section of result)
        section.tasks.sort((a,b) => Date.parse(a.due) - Date.parse(b.due))
      return result

      // "Untitled section" over due (red)
      // "Recently assigned" initial place (tasks) no date or > 2 weeks
      // "Do today" due today
      // "Do next week" due < today + 8 days
      // "Do later" )) due < today + 14

    }

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
