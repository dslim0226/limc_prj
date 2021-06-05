import { mapGetters } from "vuex";
import * as userRole from "@/role";

export default {
  computed: {
    ...mapGetters("login", ["userLevel", "userId"]),
    isChiefAdmin() {
      return this.userLevel === userRole.CHIEF_ADMIN;
    },
    isMiddleAdmin() {
      return this.userLevel === userRole.MIDDLE_ADMIN;
    },
    isGeneralUser() {
      return this.userLevel === userRole.GENERAL_USER;
    }
  },
  data() {
    return {
      userRole: userRole
    };
  }
}
