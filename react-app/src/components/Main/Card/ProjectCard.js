// Path: react-app/src/components/Main/Card/ProjectCard.js
import OpenModalButton from "../../OpenModalButton"
import CreateProjectFormModal from "../CreateProjectFormModal"


export default function ProjectCard() {
    //   const dispatch = useDispatch();
    //   const user = useSelector(state => state.session.user);
    //   const users = Object.values(useSelector(state => state.users));
    //   const workspaces = Object.values(useSelector(state => state.workspaces));
    //   const projects = Object.values(useSelector(state => state.projects));
    //   const [ref] = useState({});

    //   useEffect(() => {
    //     if (user) {
    //     dispatch(thunkGetAllI_Projects)
    //     dispatch(thunkGetAllSections());
    //     console.log('Landing: thunkGetAllProjects')
    //     dispatch(thunkGetAllProjects());
    //   }
    //   }, [dispatch, user])

      return (
        <div className="MainCardContainer ProjectCard">
            <h1 className="MainCardHeader ProjectCardHeader">Projects</h1>
            <div className="MainCardBody ProjectCardBody">
                <div className="MainCardSection ProjectCardSection">
                <div className="MainCardSectionBody ProjectCardSectionBody">
                  <div className="MainCardItem ProjectCardItem">
                    <OpenModalButton
                      buttonText="Create Project"
                      modalComponent={<CreateProjectFormModal />}>
                      <i className="fas fa-plus"></i>
                    </OpenModalButton>
                  </div>
                  <div className="MainCardItem ProjectCardItem">
                    <h3>Project 1</h3>
                  </div>
                  <div className="MainCardItem ProjectCardItem">
                    <h3>Project 2</h3>
                  </div>
                  <div className="MainCardItem ProjectCardItem">
                    <h3>Project 3</h3>
                  </div>
                </div>
                </div>
            </div>
        </div>
    )

    }
