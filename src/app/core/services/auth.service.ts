import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user.model';
import { AuthData } from '../interfaces/authData';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	authChange = new Subject<boolean>();
	loggedInUserEmail: string | undefined = undefined;

	constructor(private db: AngularFirestore) {}

	registerUser(user: User) {
		return this.db.collection('users').add(user);
	}

	logIn(authData: AuthData) {
		this.db
			.collection('users', ref => ref.where('email', '==', authData.email))
			.get()
			.subscribe(res => {
				if (res.docs.length !== 0) {
					this.authChange.next(true);
					this.loggedInUserEmail = authData.email;
				} else {
					this.authChange.next(false);
				}
			});
	}

	logOut() {
		this.authChange.next(false);
	}
}