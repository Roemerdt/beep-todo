import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '@app/_models/todo';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    id?: string;
    todo?: Todo;
    loading = false;
    error = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
    ) {

    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            // edit mode
            this.loading = true;
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.loading =  false;
                    this.todo = x;
                    // 401 and 403 responses are automatically handled by the error interceptor
                });
        }
    }
}