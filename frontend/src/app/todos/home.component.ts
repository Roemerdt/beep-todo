import { Component } from '@angular/core';
import { Todo } from '@app/_models/todo';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    todos?: any[];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .subscribe(response => {
                this.todos = response;
                // Sort based on priority descending and update time descending
                const order = ['high', 'medium', 'low'];
                this.todos = this.todos?.sort((a, b): number => {
                    if (order.indexOf(a.priority) > order.indexOf(b.priority)) {
                        return 1;
                    } else if (order.indexOf(a.priority) < order.indexOf(b.priority)) { 
                        return -1;
                    }
                
                    // else go to the 2nd item
                    if (a.updated_at > b.updated_at) { 
                        return -1;
                    } else if (a.updated_at < b.updated_at) {
                        return 1
                    } else { // nothing to split them
                        return 0;
                    }
                });
            });
    }

    deleteTodo(id: string) {
        const todo = this.todos!.find(x => x.id === id);
        todo.isDeleting = true;
        this.accountService.delete(id)
            .subscribe(() => this.todos = this.todos!.filter(x => x.id !== id));
    }
}