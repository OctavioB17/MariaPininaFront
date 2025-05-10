import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserNoPassword } from '../interfaces/IUser';
import { UserState } from '../interfaces/redux/User';

const initialState: UserState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUserNoPassword>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user.user
export default userSlice.reducer;