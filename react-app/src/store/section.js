import { fetchData } from "./csrf"

const GOT_ALL_SECTIONS = "sections/GOT_ALL_SECTIONS";
const GOT_USER_SECTIONS = "sections/GOT_USER_SECTIONS";
const GOT_SECTION = "sections/GOT_SECTION";
const CREATED_SECTION = "sections/CREATED_SECTION";
const UPDATED_SECTION = "sections/UPDATED_SECTION";
const DELETED_SECTION = "sections/DELETED_SECTION";

export const gotAllSections = sections => ({
    type: GOT_ALL_SECTIONS,
    sections
});


export const getUserSections = sections => ({
    type: GOT_USER_SECTIONS,
    sections
  })


export const gotSection = section => ({
    type: GOT_SECTION,
    section
});

export const createdSection = section => ({
    type: CREATED_SECTION,
    section
});

export const updatedSection = section => ({
    type: UPDATED_SECTION,
    section
});

export const deletedSection = id => ({
    type: DELETED_SECTION,
    id
});

// THUNKS
export const thunkGetAllSections = () => async dispatch => {
    const url = `/api/sections/`
    let answer = await fetchData(url)
    if (!answer.errors) {
        answer = answer.sections
        dispatch(gotAllSections(answer))
    }
    return answer
}

export const thunkGetUserSections = userId => async dispatch => {
  const url = `/api/users/${userId}/sections`;
  let answer = await fetchData(url);
  if (!answer.errors) {
    dispatch(getUserSections(answer.sections));
  }
}

export const thunkGetSection = id => async dispatch => {
    const url = `/api/sections/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotSection(answer))
    return answer
}

export const thunkCreateSection = (id, section) => async dispatch => {
    const url = `/api/sections/new`
    const answer = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(section),
    });
    if (!answer.errors) dispatch(createdSection(answer));
  return answer;
};

export const thunkUpdateSection = (data, id) => async dispatch => {
    const url = `/api/sections/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedSection(answer))
    return answer
}

export const thunkDeleteSection = (id, songIds) => async dispatch => {
    const url = `/api/sections/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    if (!answer.errors) dispatch(deletedSection(id, songIds))
    return answer
}


const initialState = {};
const sectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_SECTIONS: {
      const normalized = {};
      action.sections.forEach(a => normalized[a.id] = a);
      return normalized;
    }
    case GOT_USER_SECTIONS: {
      const normalized = {};
      action.sections.forEach(a => normalized[a.id] = a);
      return { ...state, ...normalized };
    }
    case GOT_SECTION: // eslint-disable-next-line no-fallthrough
    case CREATED_SECTION: // eslint-disable-next-line no-fallthrough
    case UPDATED_SECTION:
      return { ...state, [action.section.id]: action.section };
    case DELETED_SECTION:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
     default:
      return state;
  }
};

export default sectionReducer;
