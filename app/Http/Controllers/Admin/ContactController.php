<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $contacts = Contact::query()
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $statusCounts = [
            'all' => Contact::count(),
            'new' => Contact::new()->count(),
            'contacted' => Contact::contacted()->count(),
            'converted' => Contact::converted()->count(),
        ];

        return Inertia::render('Admin/Contacts/Index', [
            'contacts' => $contacts,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Contact $contact): Response
    {
        return Inertia::render('Admin/Contacts/Show', [
            'contact' => $contact,
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'status' => 'in:new,contacted,converted',
            'notes' => 'nullable|string',
        ]);

        $contact->update($validated);

        return redirect()->back()
            ->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('admin.contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }

    public function export()
    {
        $csv = "Name,Email,Phone,Company,Message,Status,Source,Created At\n";
        Contact::select(['name', 'email', 'phone', 'company', 'message', 'status', 'source', 'created_at'])
            ->orderBy('created_at')
            ->chunk(200, function ($contacts) use (&$csv) {
                foreach ($contacts as $contact) {
                    $csv .= sprintf(
                        '"%s","%s","%s","%s","%s","%s","%s","%s"' . "\n",
                        str_replace('"', '""', $contact->name),
                        $contact->email,
                        $contact->phone ?? '',
                        str_replace('"', '""', $contact->company ?? ''),
                        str_replace('"', '""', $contact->message),
                        $contact->status,
                        $contact->source,
                        $contact->created_at->format('Y-m-d H:i'),
                    );
                }
            });

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="contacts_' . date('Y-m-d') . '.csv"',
        ]);
    }
}
