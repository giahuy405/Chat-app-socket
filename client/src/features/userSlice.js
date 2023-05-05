import { createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api";

export const userSlice = createSlice({
    name: "mainUser",
    initialState: null,
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.newMessages[payload]) {
                state.newMessages[payload] = state.newMessages[payload] + 1;
            } else {
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            delete state.newMessages[payload];
        },
    },

    extraReducers: (builder) => {
        // addMatcher nhận hai tham số: matcher và reducer. Matcher là một function nhận vào một action và trả về true hoặc false để xác định action đó có phù hợp với reducer được định nghĩa hay không. Reducer được truyền vào là một function nhận vào state hiện tại và action, và trả về state mới sau khi xử lý action đó.
        builder.addMatcher(api.endpoints.registerUser.matchFulfilled, (state, { payload }) => payload);
        // save user after login
        builder.addMatcher(api.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
        builder.addMatcher(api.endpoints.logoutUser.matchFulfilled, () => null);
    },
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;
