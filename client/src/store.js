import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import {api} from "./services/api";

// persist our store 
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer ,persistStore} from "redux-persist";
import thunk from "redux-thunk";

 

// reducers
const reducer = combineReducers({
    user: userSlice, // lấy cái tên user từ đây 
    [api.reducerPath]: api.reducer,
});
  // Get the persistor object from the persistStore function

const persistConfig = {
    key: "root",
    storage,
    blackList: [api.reducerPath],
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, api.middleware],
});

export default store;


export const persistor = persistStore(store);