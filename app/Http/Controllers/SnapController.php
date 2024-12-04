<?php

namespace App\Http\Controllers;

use App\Http\Requests\SnapRequests;
use App\Models\Snap;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Inertia\Inertia;

class SnapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $snaps = Snap::with('user')
            ->latest()
            ->get();

        return Inertia::render('Snaps/Index', [
            'snaps' => $snaps,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Snaps/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SnapRequests $request)
    {
        $validated = $request->validated();

        $filePath = $request->file('photo')->store('photos', 'public');

        $snap = Snap::create([
            'user_id' => auth()->id(),
            'photo_path' => $filePath,
        ]);

        return redirect()->route('snaps.index')
            ->with('success', 'Photo uploaded successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Snap $snap): Response
    {
        return Inertia::render('Snaps/Show', [
            'snap' => $snap->load('user'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Snap $snap): Response
    {
        return Inertia::render('Snaps/Edit', [
            'snap' => $snap,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SnapRequests $request, Snap $snap)
    {
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($snap->photo_path) {
                Storage::disk('public')->delete($snap->photo_path);
            }

            // Store new photo
            $filePath = $request->file('photo')->store('photos', 'public');
            $snap->update(['photo_path' => $filePath]);
        }

        return redirect()->route('snaps.index')
            ->with('success', 'Photo updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Snap $snap)
    {
        // Delete photo from storage
        if ($snap->photo_path) {
            Storage::disk('public')->delete($snap->photo_path);
        }

        // Delete snap record
        $snap->delete();

        return redirect()->route('snaps.index')
            ->with('success', 'Photo deleted successfully!');
    }
}
