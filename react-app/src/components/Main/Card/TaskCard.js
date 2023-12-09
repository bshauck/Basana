// Path: react-app/src/components/Main/Card/TaskCard.js


export default function TaskCard() {
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
//     console.log('Landing: thunkGetAllTasks')
//     dispatch(thunkGetAllTasks());
//   }
//   }, [dispatch, user])

  return (
    <div className="MainCardContainer TaskCard">
        <h1 className="MainCardHeader TaskCardHeader">My tasks</h1>
        <div>
        <div className="MainCardBody TaskCardBody">
            <div className="MainCardSection TaskCardSection">
            <div className="MainCardSectionBody TaskCardSectionBody">
                <div className="MainCardItem TaskCardItem">
                <h3>Task 1</h3>
                </div>
                <div className="MainCardItem TaskCardItem">
                <h3>Task 2</h3>
                </div>
                <div className="MainCardItem TaskCardItem">
                <h3>Task 3</h3>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
)

}
