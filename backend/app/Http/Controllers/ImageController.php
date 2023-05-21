<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImageResource;
use App\Models\Image;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    use HttpResponses;
    /**
     * Return latest user image
     */
    public function index() {
        $image = Image::where('user_id', Auth::user()->id)->latest()->first();
        if (!$image) return $this->error('', 'No profile image found', 404);
        return new ImageResource($image);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        $request->validate([
            'image' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ]);

        $profileImagePath = "/images/user.png";
        if ($reqImg = $request->file('image')) {
            $profileImagePath = date('YmdHis') . Auth::user()->id . "." . $reqImg->getClientOriginalExtension();
            Storage::disk('public')->put($profileImagePath, file_get_contents($reqImg));
        }

        $image = Image::create([
            'user_id' => Auth::user()->id,
            'image' => "$profileImagePath"
        ]);

        return new ImageResource($image);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image) {
        if (Auth::user()->id !== $image->user_id) {
            return $this->error('', 'You are not authorised to make this request', 403);
        }

        $image->update($request->all());

        return new ImageResource($image);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image) {
        if (Auth::user()->id !== $image->user_id) {
            return $this->error('', 'You are not authorised to make this request', 403);
        }

        $image->delete();

        return response(null, 204);
    }
}
