import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUSer from '../../models/user.model';
import { EmailTaken } from '../validators/email-taken';
import { RegistrationValidators } from '../validators/registration-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),
      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(120),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
      confirm_password: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
      ]),
    },
    [RegistrationValidators.match('password', 'confirm_password')]
  );

  inSubmission = false;

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {
    // this.registerForm.controls.name;
  }

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.';
  alertColor = 'blue';

  async register() {
    this.inSubmission = true;

    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';

    try {
      await this.auth.createUser(this.registerForm.value as IUSer);
    } catch (error) {
      console.log(error);
      this.alertMsg = 'An error occured. Please try again later';
      this.alertColor = 'red';
      return;
    } finally {
      this.inSubmission = false;
    }

    this.alertMsg = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
