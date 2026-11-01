/* ==========================================
   JOY UNIVERSITY - LOGIN PAGE
   script.js  (all JavaScript)
   ========================================== */

/* ---------- JS PART 1: script block 1 ---------- */
  function togglePwd(icon){
    const input = icon.previousElementSibling;
    input.type="password" 
    id="passwordField"
    placeholder="Enter your Password"
  }
  const captchaInputs = document.querySelectorAll('#captchaInputs input');
  captchaInputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
      if(input.value && i < captchaInputs.length - 1){
        captchaInputs[i + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Backspace' && !input.value && i > 0){
        captchaInputs[i - 1].focus();
      }
    });
    input.addEventListener('focus', () => input.select());
  });
  function refreshCaptcha(){
    const digits = document.querySelectorAll('#captchaDigits span');
    digits.forEach(d => d.textContent = Math.floor(Math.random()*10));
  }
  refreshCaptcha();

  const roleButtons = document.querySelectorAll('#roleToggle button');
  const idField = document.getElementById('idField');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const placeholders = {
        student: 'Enter your Registration Number',
        staff: 'Enter your Staff ID',
        admin: 'Enter your Admin ID'
      };
      idField.placeholder = placeholders[btn.dataset.role];
    });
  });
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    const accounts = {
    student: {
        username: 'student01',
        password: 'Stu@123',
        page: '../STUDENT/INDEX.HTML'
    },

    staff: {
        username: 'faculty01',
        password: 'Fac@123',
        page: '../FACULTY/INDEX.HTML'
    },

    admin: {
        username: 'dean01',
        password: 'Dean@123',
        page: '../DEAN/INDEX.HTML'
    }
    };

    if (!form) {
        console.error('Login form not found.');
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        refreshCaptcha()

        const roleButton = document.querySelector(
            '#roleToggle button.active'
        );

        if (!roleButton) {
            alert('Please select your role.');
            return;
        }

        let role = (
            roleButton.dataset.role ||
            roleButton.textContent
        ).trim().toLowerCase();

        if (role.includes('student')) {
            role = 'student';
        } else if (
            role.includes('faculty') ||
            role.includes('staff')
        ) {
            role = 'staff';
        } else if (
            role.includes('dean') ||
            role.includes('admin')
        ) {
            role = 'admin';
        }

        const account = accounts[role];

        const username = document.getElementById('idField');
        const password = document.getElementById('passwordField');

        if (!username || !password) {
            alert('Username or password field not found.');
            return;
        }

        if (
            !account ||
            username.value.trim() !== account.username ||
            password.value !== account.password
        ) {
            alert('Invalid username or password for this role.');
            return;
        }

        window.location.href = account.page;
    });
});

