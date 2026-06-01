import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login() {
    if (this.form.valid){
      this.auth.login(
        this.form.value.email,
        this.form.value.password
      ).subscribe({
        next: () => {
          this.router.navigate([""])
        },
        error: (err) => {
          console.log(`Deu erro: ${err}`)
        }
      })
    }
  }

}
