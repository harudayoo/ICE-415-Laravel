<?php

namespace App\Http\Controllers;

use App\Models\Snap;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SnapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $snaps = Snap::with('user')->get();
        return Inertia::render('Snaps/Index', [
            'auth' => auth()->user(),
            'snaps' => $snaps,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate(['photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048']);

        if ($request->file('photo')) {
            $filePath = $request->file('photo')->store('photos', 'public');
            $snap = Snap::create([
                'user_id' => auth()->id(),
                'photo_path' => $filePath,
            ]);
            return redirect()->route('snaps.index')->with('success', 'Photo uploaded successfully!');
        }

        return redirect()->route('snaps.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Snap $snap)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Snap $snap)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Snap $snap)
    {
        $request->validate(['photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048']);

        if ($request->file('photo')) {
            $filePath = $request->file('photo')->store('photos', 'public');
            $snap->update(['photo_path' => $filePath]);
        }

        return redirect()->route('snaps.index')->with('success', 'Photo updated successfully!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Snap $snap)
    {
        Storage::disk('public')->delete($snap->photo_path);
        $snap->delete();
        return redirect()->route('snaps.index')->with('success', 'Photo deleted successfully!');

    }
}
