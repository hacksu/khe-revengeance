import { ref } from "vue";
import { User } from "includes/users.ts";

export const user = ref(undefined);
export const onUserLoaded = User.getOwnUserInfo().then(u => {
    if (u) {
        user.value = u;
    }
});
