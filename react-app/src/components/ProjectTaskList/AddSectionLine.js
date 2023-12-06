
export default function AddSectionLine({project}) {
    const [sectionName, setSectionName] = useState('')

    handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            name: sectionName,
            projectId: project.id
        }
        const answer = await dispatch(thunkCreateSection(data))
        if (!answer.errors) {
            setSectionName('')
        }
    }

    return (
    <span>  <form onSubmit={handleSubmit} >
             <button type="submit">
            <input type="text" value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
            </button>
        </form>
    </span>
    )
}
