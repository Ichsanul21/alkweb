<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stichoza\GoogleTranslate\GoogleTranslate;

class AutoTranslateController extends Controller
{
    /**
     * Translate text from one language to another.
     */
    public function translate(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'from' => 'nullable|string',
            'to' => 'nullable|string',
        ]);

        try {
            $tr = new GoogleTranslate();
            $tr->setSource($request->from ?? 'id');
            $tr->setTarget($request->to ?? 'en');

            $translated = $tr->translate($request->text);

            return response()->json([
                'translated' => $translated,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Translation failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
