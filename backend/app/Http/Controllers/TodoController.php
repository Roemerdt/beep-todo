<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    use HttpResponses;
    
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return TodoResource::collection(
            Todo::where('user_id', Auth::user()->id)->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request) {
        $request->validated($request->all());

        $todo = Todo::create([
            'user_id' => Auth::user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'priority' => $request->priority,
        ]);

        return new TodoResource($todo);
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo) {
        if (Auth::user()->id !== $todo->user_id) {
            return $this->error('', 'You are not authorised to make this request', 403);
        }
        
        return new TodoResource($todo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo) {
        if (Auth::user()->id !== $todo->user_id) {
            return $this->error('', 'You are not authorised to make this request', 403);
        }

        $todo->update($request->all());

        return new TodoResource($todo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo) {
        if (Auth::user()->id !== $todo->user_id) {
            return $this->error('', 'You are not authorised to make this request', 403);
        }

        $todo->delete();

        return response(null, 204);
    }
}
