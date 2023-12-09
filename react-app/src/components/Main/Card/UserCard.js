// Path: react-app/src/components/Main/Card/UserCard.js (continued)


export default function UserCard() {
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
    //     console.log('Landing: thunkGetAllUsers')
    //     dispatch(thunkGetAllUsers());
    //   }
    //   }, [dispatch, user])

      return (
        <div className="MainCardContainer UserCard">
            <h1 className="MainCardHeader UserCardHeader">Users</h1>
            <div>
            <div className="MainCardBody UserCardBody">
                <div className="MainCardSection UserCardSection">
                <div className="MainCardSectionBody UserCardSectionBody">
                    <div className="MainCardItem UserCardItem">
                    <h3>User 1</h3>
                    </div>
                    <div className="MainCardItem UserCardItem">
                    <h3>User 2</h3>
                    </div>
                    <div className="MainCardItem UserCardItem">
                    <h3>User 3</h3>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )

    }
