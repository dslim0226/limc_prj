import { mapGetters } from "vuex";
import * as userRole from "@/role";

export default {
  computed: {
    ...mapGetters("login", ["memberRole", "memberId"]),
    isChiefAdmin() {
      return this.memberRole === userRole.CHIEF_ADMIN;
    },
    isMiddleAdmin() {
      return this.memberRole === userRole.MIDDLE_ADMIN;
    },
    isGeneralUser() {
      return this.memberRole === userRole.GENERAL_USER;
    }
  },
  data() {
    return {
      userRole: userRole
    };
  }
}
