<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $author = \App\Models\User::first();
        if (!$author) return;

        $articles = [
            [
                'author_id' => $author->id,
                'title_id' => 'Masa Depan AI di Indonesia: Peluang dan Tantangan',
                'title_en' => 'The Future of AI in Indonesia: Opportunities and Challenges',
                'excerpt_id' => 'Bagaimana kecerdasan buatan akan mengubah lanskap industri di Indonesia.',
                'excerpt_en' => 'How artificial intelligence will transform the industrial landscape in Indonesia.',
                'content_id' => '<p>AI bukan lagi sekadar tren. Dari otomatisasi manufaktur hingga asisten virtual di sektor layanan pelanggan, AI telah merambah berbagai sendi kehidupan. Di Indonesia, tantangan utamanya adalah kesiapan talenta digital dan infrastruktur data yang merata.</p>',
                'content_en' => '<p>AI is no longer just a trend. From manufacturing automation to virtual assistants in the customer service sector, AI has permeated various aspects of life. In Indonesia, the main challenges are the readiness of digital talent and equitable data infrastructure.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
                'tags' => ['AI', 'Tech', 'Indonesia'],
                'is_featured' => true,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Membangun Infrastruktur Cerdas untuk Kota Masa Depan',
                'title_en' => 'Building Smart Infrastructure for Future Cities',
                'excerpt_id' => 'Solusi teknologi untuk mengatasi masalah urbanisasi.',
                'excerpt_en' => 'Technology solutions to address urbanization issues.',
                'content_id' => '<p>Kota cerdas memerlukan fondasi yang kuat. Integrasi sensor IoT dengan sistem manajemen perkotaan dapat meningkatkan efisiensi transportasi dan pengelolaan limbah secara signifikan.</p>',
                'content_en' => '<p>Smart cities require a strong foundation. The integration of IoT sensors with urban management systems can significantly improve transportation efficiency and waste management.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd',
                'tags' => ['Smart City', 'Infrastructure'],
                'is_featured' => true,
                'status' => 'published',
                'published_at' => now()->subDay(),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Keamanan Siber di Era Digital',
                'title_en' => 'Cybersecurity in the Digital Era',
                'excerpt_id' => 'Pentingnya melindungi data di tengah ancaman siber yang meningkat.',
                'excerpt_en' => 'The importance of protecting data amidst rising cyber threats.',
                'content_id' => '<p>Data adalah minyak baru, tetapi tanpa keamanan, data menjadi kewajiban yang berisiko. Setiap perusahaan harus mulai berinvestasi pada enkripsi dan audit keamanan berkala.</p>',
                'content_en' => '<p>Data is the new oil, but without security, data becomes a risky liability. Every company must start investing in encryption and periodic security audits.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
                'tags' => ['Security', 'Data'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Transformasi Digital untuk UKM',
                'title_en' => 'Digital Transformation for SMEs',
                'excerpt_id' => 'Langkah-langkah praktis bagi UKM untuk go digital.',
                'excerpt_en' => 'Practical steps for SMEs to go digital.',
                'content_id' => '<p>UKM adalah tulang punggung ekonomi. Dengan platform digital, UKM dapat menjangkau pasar yang lebih luas tanpa kendala geografis.</p>',
                'content_en' => '<p>SMEs are the backbone of the economy. With digital platforms, SMEs can reach a wider market without geographical constraints.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                'tags' => ['SME', 'Digital'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Internet of Things (IoT) dalam Pertanian',
                'title_en' => 'Internet of Things (IoT) in Agriculture',
                'excerpt_id' => 'Meningkatkan hasil panen dengan teknologi sensor.',
                'excerpt_en' => 'Increasing crop yields with sensor technology.',
                'content_id' => '<p>Pertanian presisi adalah masa depan. Sensor tanah dan pemantauan drone membantu petani mengoptimalkan penggunaan air dan pupuk.</p>',
                'content_en' => '<p>Precision agriculture is the future. Soil sensors and drone monitoring help farmers optimize the use of water and fertilizers.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1560493676-04071c5f467b',
                'tags' => ['IoT', 'Agriculture'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(4),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Blockchain: Lebih dari Sekadar Bitcoin',
                'title_en' => 'Blockchain: More Than Just Bitcoin',
                'excerpt_id' => 'Eksplorasi penggunaan blockchain di berbagai industri.',
                'excerpt_en' => 'Exploring blockchain use cases across industries.',
                'content_id' => '<p>Blockchain menawarkan transparansi imutabel. Dari rantai pasok hingga sistem voting, potensinya sangat luas.</p>',
                'content_en' => '<p>Blockchain offers immutable transparency. From supply chains to voting systems, the potential is vast.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
                'tags' => ['Blockchain', 'Web3'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Pentingnya UI/UX dalam Pengembangan Produk',
                'title_en' => 'The Importance of UI/UX in Product Development',
                'excerpt_id' => 'Mengapa desain yang berpusat pada pengguna sangat krusial.',
                'excerpt_en' => 'Why user-centered design is crucial.',
                'content_id' => '<p>Desain bukan hanya soal estetika, tapi fungsi. Pengalaman pengguna yang mulus menentukan loyalitas pelanggan terhadap produk digital Anda.</p>',
                'content_en' => '<p>Design is not just about aesthetics, but function. A seamless user experience determines customer loyalty to your digital product.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c',
                'tags' => ['Design', 'UX'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(6),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Cloud Computing: Efisiensi untuk Bisnis',
                'title_en' => 'Cloud Computing: Efficiency for Business',
                'excerpt_id' => 'Mengurangi biaya operasional dengan solusi cloud.',
                'excerpt_en' => 'Reducing operational costs with cloud solutions.',
                'content_id' => '<p>Cloud computing telah mengubah cara kita bekerja. Skalabilitas instan yang ditawarkan cloud memungkinkan bisnis berkembang tanpa beban infrastruktur fisik.</p>',
                'content_en' => '<p>Cloud computing has changed the way we work. The instant scalability offered by the cloud allows businesses to grow without the burden of physical infrastructure.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
                'tags' => ['Cloud', 'Business'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Inovasi Digital di Sektor Kesehatan',
                'title_en' => 'Digital Innovation in the Healthcare Sector',
                'excerpt_id' => 'Telemedis dan rekam medis digital dalam meningkatkan layanan.',
                'excerpt_en' => 'Telemedicine and digital health records in improving services.',
                'content_id' => '<p>Teknologi kesehatan menyelamatkan nyawa. Integrasi data pasien antar rumah sakit memudahkan diagnosis dan penanganan medis yang cepat.</p>',
                'content_en' => '<p>Health tech saves lives. Patient data integration between hospitals facilitates diagnosis and rapid medical handling.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
                'tags' => ['HealthTech', 'Digital'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(8),
            ],
            [
                'author_id' => $author->id,
                'title_id' => 'Big Data dan Pengambilan Keputusan',
                'title_en' => 'Big Data and Decision Making',
                'excerpt_id' => 'Mengubah data mentah menjadi wawasan bisnis yang berharga.',
                'excerpt_en' => 'Turning raw data into valuable business insights.',
                'content_id' => '<p>Data yang besar memerlukan analisis yang cerdas. Dengan algoritma yang tepat, data dapat memprediksi perilaku pasar di masa depan.</p>',
                'content_en' => '<p>Big data requires smart analysis. With the right algorithms, data can predict future market behavior.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1551288049-bbbda5366391',
                'tags' => ['Data', 'Big Data'],
                'is_featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(9),
            ],
        ];

        foreach ($articles as $article) {
            $article['slug'] = \Illuminate\Support\Str::slug($article['title_en']);
            \App\Models\Article::create($article);
        }
    }
}
