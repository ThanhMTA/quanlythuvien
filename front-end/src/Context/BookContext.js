import { createContext, useEffect, useReducer } from "react"

const BookReducer = (state, action) => {
    switch (action.type) {
        case "GET_ALL_BOOK":
            return {
                user: action.payload,
                error: false
            };
    

        default:
            return state
    }
}

const INITIAL_STATE = {
    book: null,
    error:false
}

/* Reads the data from the Provider and changes INITIAL_STATE */
export const BookContext = createContext(INITIAL_STATE)

/* Children here are the Components that need to get the data.[In this Application we specified App COmponent as Child in index.js so that we can server every every component exist in the app */
/* This will provide data to all the children that we are giving here */
export const BookContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(BookReducer, INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem("book", JSON.stringify(state.book))
      },[state.book])

    return (
        <BookContext.Provider
        value={{
            user:state.user,
            isFetching:state.isFetching,
            error:state.error,
            dispatch
        }}
        >
            {children}
        </BookContext.Provider>
    )
}