import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Todo } from '@app/_models/todo';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post(`${environment.apiUrl}/login`, { email, password })
            .pipe(map(res => {
                // do some sanitation of the response
                let json = JSON.parse(JSON.stringify(res))
                let json_data = json['data'];
                let user_data = json_data['user'];

                let user = new User();
                user.id = user_data['id'];
                user.name = user_data['name'];
                user.email = user_data['email'];
                user.token = json_data['token'];

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    // TODO: auto login
    register(user: User) {
        return this.http.post(`${environment.apiUrl}/register`, user)
            .pipe(map(res => {
                // do some sanitation of the response
                let json = JSON.parse(JSON.stringify(res))
                let json_data = json['data'];
                let user_data = json_data['user'];

                let user = new User();
                user.id = user_data['id'];
                user.name = user_data['name'];
                user.email = user_data['email'];
                user.token = json_data['token'];

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    getAll() {
        return this.http.get<Todo[]>(`${environment.apiUrl}/todos`);
    }

    getById(id: string) {
        return this.http.get<Todo>(`${environment.apiUrl}/todos/${id}`);
    }

    store(params: any) {
        return this.http.post(`${environment.apiUrl}/todos`, params);
    }

    update(id: string, params: any) {
        return this.http.patch(`${environment.apiUrl}/todos/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/todos/${id}`);
    }
}