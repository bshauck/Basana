# app/seeds/internal_project.py



def createTask(title, description, section):
    task = Task(
        workspaceId=1,
        ownerId=1,
        internalProjectId=1,
        sectionId=section,
        title=title,
        description=description,
        due=datetime.now())
    db.session.add(task)
def createTaskInUnsorted(title, description):
    createTask(title, description, section=1)

def createTaskInToday(title, description):
    createTask(title, description, section=2)

def createTaskInUpcoming(title, description):
    createTask(title, description, section=3)

def createTaskInLater(title, description):
    createTask(title, description, section=4)



def seed_internal_projects():
    pass

def undo_internal_projects():
    # Do nothing as we are internal to Workspaces;
    # we will rely on cascaded delete if needed.
    pass
