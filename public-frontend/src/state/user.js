import { ref } from "vue";
import { User } from "includes/users.ts";

export const user = ref(undefined);
let loadPromise = null;

export const loadUser = async () => {
    if (!loadPromise) {
        loadPromise = User.getOwnUserInfo().then(u => (user.value = u));
    }
    await loadPromise;
};
