<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Statistic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Roles ───────────────────────────────────────────
        $adminRole  = Role::create(['name' => 'Admin']);
        $editorRole = Role::create(['name' => 'Editor']);
        $authorRole = Role::create(['name' => 'Author']);

        // ── Admin User ──────────────────────────────────────
        $admin = User::create([
            'name'     => 'Admin Alenkosa',
            'email'    => 'admin@alenkosa.id',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole($adminRole);

        // ── Statistics ──────────────────────────────────────
        Statistic::insert([
            [
                'key' => 'core_verticals', 'value' => '3', 'suffix' => '+',
                'label_en' => "Core Verticals:\nAI, IoT, and Digital Media.",
                'label_id' => "Tiga Pilar Utama:\nAI, IoT, dan Media Digital.",
                'sort_order' => 1, 'is_visible' => true,
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'key' => 'projects_deployed', 'value' => '15', 'suffix' => '+',
                'label_en' => "Enterprise & Government\nprojects successfully deployed.",
                'label_id' => "Proyek Enterprise & Pemerintahan\nberhasil diterapkan.",
                'sort_order' => 2, 'is_visible' => true,
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'key' => 'commitment', 'value' => '99', 'suffix' => '%',
                'label_en' => "Percent commitment to\ndata security and scalable execution.",
                'label_id' => "Persen komitmen terhadap\nkeamanan data dan eksekusi berskala.",
                'sort_order' => 3, 'is_visible' => true,
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);

        // ── Services ────────────────────────────────────────
        Service::insert([
            [
                'title_en' => 'Intelligent Software', 'title_id' => 'Perangkat Lunak Cerdas',
                'description_en' => 'AI & ML integrated platforms, web & mobile applications built for heavy enterprise usage and analytics.',
                'description_id' => 'Platform terintegrasi AI & ML, aplikasi web & mobile yang dibangun untuk kebutuhan enterprise skala besar dan analitik.',
                'number' => '01', 'icon' => null, 'sort_order' => 1, 'is_visible' => true,
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title_en' => 'Smart Infrastructure', 'title_id' => 'Infrastruktur Pintar',
                'description_en' => 'Industrial IoT sensors and smart systems mapping physical operations directly into the digital realm.',
                'description_id' => 'Sensor IoT industri dan sistem pintar yang memetakan operasi fisik langsung ke ranah digital.',
                'number' => '02', 'icon' => null, 'sort_order' => 2, 'is_visible' => true,
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title_en' => 'Digital Media', 'title_id' => 'Media Digital',
                'description_en' => 'Engaging visual narratives and data visualizations driving brand intelligence and user acquisition.',
                'description_id' => 'Narasi visual yang menarik dan visualisasi data yang mendorong brand intelligence serta akuisisi pengguna.',
                'number' => '03', 'icon' => null, 'sort_order' => 3, 'is_visible' => true,
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);

        // ── Portfolios ──────────────────────────────────────
        Portfolio::create([
            'title_en' => 'Mirra Sense', 'title_id' => 'Mirra Sense',
            'slug' => 'mirra-sense',
            'description_en' => 'AI-powered health monitoring platform for real-time patient data analysis.',
            'description_id' => 'Platform pemantauan kesehatan berbasis AI untuk analisis data pasien secara real-time.',
            'content_en' => '<p>Mirra Sense is a cutting-edge HealthTech platform that leverages artificial intelligence to monitor and analyze patient health data in real-time. Built for hospitals and clinics, it provides predictive insights that help healthcare professionals make faster, more informed decisions.</p>',
            'content_id' => '<p>Mirra Sense adalah platform HealthTech mutakhir yang memanfaatkan kecerdasan buatan untuk memantau dan menganalisis data kesehatan pasien secara real-time. Dibangun untuk rumah sakit dan klinik, platform ini memberikan wawasan prediktif yang membantu tenaga kesehatan membuat keputusan lebih cepat dan lebih tepat.</p>',
            'category' => 'HealthTech AI',
            'tags' => ['AI', 'Healthcare', 'Machine Learning'],
            'featured_image' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80',
            'is_featured' => true, 'sort_order' => 1, 'status' => 'published',
        ]);

        Portfolio::create([
            'title_en' => 'SIKAD Platform', 'title_id' => 'Platform SIKAD',
            'slug' => 'sikad-platform',
            'description_en' => 'Enterprise resource planning system for government document management.',
            'description_id' => 'Sistem perencanaan sumber daya enterprise untuk manajemen dokumen pemerintahan.',
            'content_en' => '<p>SIKAD is a comprehensive government ERP platform designed to streamline document management, approval workflows, and inter-departmental communication. Built with robust security and scalability at its core.</p>',
            'content_id' => '<p>SIKAD adalah platform ERP pemerintahan yang komprehensif yang dirancang untuk memperlancar manajemen dokumen, alur kerja persetujuan, dan komunikasi antar-departemen. Dibangun dengan keamanan dan skalabilitas yang kuat sebagai fondasinya.</p>',
            'category' => 'Government ERP',
            'tags' => ['ERP', 'Government', 'Document Management'],
            'featured_image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
            'is_featured' => true, 'sort_order' => 2, 'status' => 'published',
        ]);

        Portfolio::create([
            'title_en' => 'Tripzy Engine', 'title_id' => 'Tripzy Engine',
            'slug' => 'tripzy-engine',
            'description_en' => 'Smart travel companion app with AI-driven itinerary planning.',
            'description_id' => 'Aplikasi pendamping perjalanan pintar dengan perencanaan itinerari berbasis AI.',
            'content_en' => '<p>Tripzy Engine is a mobile application that revolutionizes travel planning with AI-driven itinerary generation, real-time local recommendations, and seamless booking integration. Designed for the modern traveler.</p>',
            'content_id' => '<p>Tripzy Engine adalah aplikasi mobile yang merevolusi perencanaan perjalanan dengan pembuatan itinerari berbasis AI, rekomendasi lokal real-time, dan integrasi pemesanan yang mulus. Dirancang untuk pelancong modern.</p>',
            'category' => 'Mobile Application',
            'tags' => ['Mobile', 'AI', 'Travel'],
            'featured_image' => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
            'is_featured' => true, 'sort_order' => 3, 'status' => 'published',
        ]);

        // ── Settings ────────────────────────────────────────
        $settings = [
            // General
            ['key' => 'company_name', 'value' => 'Alenkosa', 'group' => 'general'],
            ['key' => 'company_tagline_en', 'value' => 'Tech & Intelligence', 'group' => 'general'],
            ['key' => 'company_tagline_id', 'value' => 'Teknologi & Inteligensi', 'group' => 'general'],
            ['key' => 'company_email', 'value' => 'hello@alenkosa.id', 'group' => 'general'],
            ['key' => 'company_phone', 'value' => '', 'group' => 'general'],
            ['key' => 'company_address', 'value' => '', 'group' => 'general'],

            // Social
            ['key' => 'social_instagram', 'value' => '#', 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => '#', 'group' => 'social'],

            // SEO
            ['key' => 'seo_title', 'value' => 'Alenkosa - Tech & Intelligence', 'group' => 'seo'],
            ['key' => 'seo_description', 'value' => 'Transforming data into precise future predictions through advanced AI and robust IoT architecture.', 'group' => 'seo'],
            ['key' => 'seo_keywords', 'value' => 'AI, IoT, Digital Media, Technology, Indonesia', 'group' => 'seo'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        // ── Demo Articles ────────────────────────────────
        \App\Models\Article::create([
            'title_en' => 'How AI is Transforming Indonesian Healthcare',
            'title_id' => 'Bagaimana AI Mengubah Layanan Kesehatan Indonesia',
            'slug' => 'ai-transforming-indonesian-healthcare',
            'excerpt_en' => 'Exploring the impact of artificial intelligence on patient diagnostics, treatment planning, and hospital operations across Indonesia.',
            'excerpt_id' => 'Menjelajahi dampak kecerdasan buatan pada diagnostik pasien, perencanaan perawatan, dan operasi rumah sakit di seluruh Indonesia.',
            'content_en' => '<p>Artificial intelligence is rapidly reshaping the healthcare landscape in Indonesia. From predictive diagnostics that can detect diseases earlier to AI-powered hospital management systems that optimize resource allocation, the potential is immense.</p><h2>Key Applications</h2><p>Machine learning algorithms are now being used in radiology departments to detect anomalies in X-rays and CT scans with remarkable accuracy. Natural language processing helps digitize and analyze patient records, while predictive models can forecast patient admission rates.</p><p>At Alenkosa, we have been at the forefront of building these intelligent healthcare solutions, combining deep technical expertise with a thorough understanding of the Indonesian healthcare ecosystem.</p>',
            'content_id' => '<p>Kecerdasan buatan dengan cepat mengubah lanskap layanan kesehatan di Indonesia. Dari diagnostik prediktif yang dapat mendeteksi penyakit lebih awal hingga sistem manajemen rumah sakit bertenaga AI yang mengoptimalkan alokasi sumber daya, potensinya sangat besar.</p>',
            'category' => 'Technology',
            'tags' => ['AI', 'Healthcare', 'Indonesia'],
            'featured_image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
            'status' => 'published',
            'published_at' => now()->subDays(3),
            'author_id' => $admin->id,
        ]);

        \App\Models\Article::create([
            'title_en' => 'The Future of IoT in Smart Cities',
            'title_id' => 'Masa Depan IoT di Kota Pintar',
            'slug' => 'future-iot-smart-cities',
            'excerpt_en' => 'How Internet of Things technology is enabling smarter urban infrastructure, from traffic management to energy optimization.',
            'excerpt_id' => 'Bagaimana teknologi Internet of Things memungkinkan infrastruktur perkotaan yang lebih cerdas, dari manajemen lalu lintas hingga optimasi energi.',
            'content_en' => '<p>Smart cities represent one of the most exciting applications of IoT technology. By connecting sensors, devices, and systems across urban environments, cities can become more efficient, sustainable, and livable.</p><h2>Real-World Impact</h2><p>In Indonesia, smart city initiatives are gaining momentum. IoT-enabled traffic systems reduce congestion, smart grids optimize energy distribution, and connected waste management systems improve sanitation services.</p>',
            'content_id' => '<p>Kota pintar mewakili salah satu penerapan teknologi IoT yang paling menarik. Dengan menghubungkan sensor, perangkat, dan sistem di seluruh lingkungan perkotaan, kota dapat menjadi lebih efisien, berkelanjutan, dan layak huni.</p>',
            'category' => 'IoT',
            'tags' => ['IoT', 'Smart City', 'Infrastructure'],
            'featured_image' => 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
            'status' => 'published',
            'published_at' => now()->subDays(7),
            'author_id' => $admin->id,
        ]);

        \App\Models\Article::create([
            'title_en' => 'Building Scalable Web Applications with Modern Architecture',
            'title_id' => 'Membangun Aplikasi Web Skalabel dengan Arsitektur Modern',
            'slug' => 'scalable-web-applications-modern-architecture',
            'excerpt_en' => 'Best practices for designing robust, scalable web applications that can handle enterprise-level traffic and complexity.',
            'excerpt_id' => 'Praktik terbaik untuk merancang aplikasi web yang robust dan skalabel yang dapat menangani lalu lintas dan kompleksitas tingkat enterprise.',
            'content_en' => '<p>Building web applications that scale requires careful architectural planning from day one. In this article, we explore the patterns and practices that enable applications to grow from hundreds to millions of users.</p><h2>Architecture Principles</h2><p>Microservices, event-driven architecture, and serverless computing are transforming how we build modern applications. Combined with containerization and orchestration tools like Docker and Kubernetes, teams can deploy and scale with confidence.</p>',
            'content_id' => '<p>Membangun aplikasi web yang skalabel membutuhkan perencanaan arsitektur yang cermat sejak hari pertama. Dalam artikel ini, kami mengeksplorasi pola dan praktik yang memungkinkan aplikasi tumbuh dari ratusan hingga jutaan pengguna.</p>',
            'category' => 'Engineering',
            'tags' => ['Web Development', 'Architecture', 'Scalability'],
            'featured_image' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
            'status' => 'published',
            'published_at' => now()->subDays(14),
            'author_id' => $admin->id,
        ]);

        // ── Demo Contact ────────────────────────────────────
        Contact::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'I am interested in your AI solutions for our healthcare company.',
            'status' => 'new',
            'source' => 'website',
        ]);
    }
}
