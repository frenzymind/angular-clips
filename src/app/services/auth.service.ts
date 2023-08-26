import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore'
import { Observable, of } from 'rxjs'
import { delay, map, filter, switchMap } from 'rxjs/operators'
import IUSer from '../models/user.model'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUSer>
  public isAuthenticated$: Observable<boolean>
  public isAuthWithDelay$: Observable<boolean>
  private redirect = false

  authOnlyRoutes = ['/manage', '/upload']

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = this.db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user))
    this.isAuthWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        let urlNoParams = ''

        if (router.url.includes('?')) {
          urlNoParams = router.url.substring(0, router.url.indexOf('?'))
        } else {
          urlNoParams = router.url
        }

        this.redirect = this.authOnlyRoutes.includes(urlNoParams) //on logout if true redirect
      })
  }

  public async createUser(userData: IUSer) {
    if (!userData.password) {
      throw new Error('Password not provided!')
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    )

    if (!userCred) {
      throw new Error("USer can't be found")
    }

    await this.usersCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    })

    await userCred.user?.updateProfile({
      displayName: userData.name,
    })
  }

  public async logout($event?: Event) {
    $event?.preventDefault()

    await this.auth.signOut()

    if (this.redirect) {
      this.router.navigateByUrl('/')
    }
  }
}
