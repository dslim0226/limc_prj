import { mapGetters } from "vuex";
import * as userRole from "@/role";

export default {
  computed: {
    ...mapGetters("login", ["authority", "memberId"]),
    isChiefAdmin() {
      return this.authority === userRole.CHIEF_ADMIN;
    },
    isMiddleAdmin() {
      return this.authority === userRole.MIDDLE_ADMIN;
    },
    isGeneralUser() {
      return this.authority === userRole.GENERAL_USER;
    }
  },
  data() {
    return {
      userRole: userRole
    };
  }
}
