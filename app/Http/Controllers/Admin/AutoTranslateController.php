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
    /**
     * Generate tags based on content.
     */
    public function generateTags(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
        ]);

        $text = $request->title . ' ' . $request->excerpt . ' ' . $request->content;
        
        // Strip HTML and convert to lowercase
        $text = strip_tags($text);
        $text = strtolower($text);
        
        // Remove special characters, keep spaces
        $text = preg_replace('/[^\p{L}\p{N}\s]+/u', '', $text);
        
        // Split into words
        $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        
        // Stopwords lists
        $stopwordsEn = ['the', 'and', 'for', 'with', 'about', 'from', 'but', 'this', 'that', 'they', 'their', 'them', 'your', 'will', 'would', 'could', 'should', 'have', 'been', 'what', 'which', 'where', 'when', 'how', 'there', 'here', 'into', 'under', 'over', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'down', 'while', 'because', 'both', 'each', 'most', 'some', 'such', 'very', 'only', 'same', 'more', 'even', 'than', 'just', 'made', 'much', 'also', 'those', 'these'];
        $stopwordsId = ['yang', 'untuk', 'dengan', 'pada', 'dari', 'dalam', 'adalah', 'sebagai', 'atau', 'tetapi', 'namun', 'jika', 'maka', 'sebab', 'karena', 'bahwa', 'ini', 'itu', 'dia', 'mereka', 'kita', 'kami', 'anda', 'kamu', 'saya', 'aku', 'ada', 'dapat', 'akan', 'sudah', 'telah', 'sedang', 'lagi', 'pun', 'saja', 'hanya', 'sama', 'lebih', 'bahkan', 'daripada', 'sekadar', 'dibuat', 'banyak', 'juga', 'oleh', 'para', 'sebuah', 'setiap', 'setelah', 'sebelum', 'melalui', 'selama', 'ketika', 'saat'];
        
        $stopwords = array_merge($stopwordsEn, $stopwordsId);
        
        // Filter words
        $filteredWords = array_filter($words, function($word) use ($stopwords) {
            return strlen($word) > 3 && !in_array($word, $stopwords);
        });
        
        // Count frequencies
        $counts = array_count_values($filteredWords);
        arsort($counts);
        
        // Get top 10 keywords
        $tags = array_slice(array_keys($counts), 0, 10);
        
        // Capitalize each tag
        $tags = array_map('ucfirst', $tags);
        
        return response()->json([
            'tags' => $tags,
        ]);
    }
}
