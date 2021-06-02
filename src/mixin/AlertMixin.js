import Swal from 'sweetalert2';

export default {
  methods: {
    showAlert(icon, title, text, callback) {
      Swal.fire({
        icon: icon,
        title: title,
        text: text
      }).then(callback);
    }
  }
};
