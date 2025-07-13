import Footer from "@/components/Footer";
import { Share2, Compass, Users, Code, Globe, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Rekkoku",
  description:
    "Pelajari lebih lanjut tentang Rekkoku, platform untuk menemukan dan berbagi rekomendasi tempat dan perjalanan unik di seluruh Indonesia.",
};

const AboutPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto max-w-5xl px-6 py-16 text-center">
          <Globe className="mx-auto h-16 w-16 text-blue-500" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Menemukan Kembali Indonesia, Bersama-sama.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Rekkoku adalah platform berbasis komunitas untuk berbagi dan
            menemukan rekomendasi perjalanan dan tempat-tempat menarik, langsung
            dari para penjelajah seperti Anda.
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Our Mission Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Misi Kami
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Misi kami adalah memberdayakan setiap orang untuk menjelajahi
            keindahan tersembunyi di Indonesia dengan cara yang otentik. Kami
            percaya rekomendasi terbaik datang dari pengalaman nyata.
          </p>
        </section>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Apa yang Bisa Anda Lakukan di Rekkoku?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="rounded-lg bg-white p-8 text-center shadow-md transition-shadow hover:shadow-lg">
              <Share2 className="mx-auto h-12 w-12 text-blue-500" />
              <h3 className="mt-4 text-xl font-semibold">
                Bagikan Petualanganmu
              </h3>
              <p className="mt-2 text-gray-600">
                Buat dan publikasikan postingan perjalanan Anda dengan mudah,
                lengkap dengan daftar tempat, peta, dan cerita unik Anda.
              </p>
            </div>
            <div className="rounded-lg bg-white p-8 text-center shadow-md transition-shadow hover:shadow-lg">
              <Compass className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold">
                Temukan Rekomendasi
              </h3>
              <p className="mt-2 text-gray-600">
                Jelajahi ribuan rekomendasi dari pengguna lain, temukan tempat
                baru di sekitar Anda, atau cari berdasarkan kota tujuan.
              </p>
            </div>
            <div className="rounded-lg bg-white p-8 text-center shadow-md transition-shadow hover:shadow-lg">
              <Heart className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold">
                Simpan & Personalisasi
              </h3>
              <p className="mt-2 text-gray-600">
                Sukai dan simpan (bookmark) postingan favorit Anda untuk
                merencanakan perjalanan Anda di masa depan.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="mt-16">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Dibangun dengan Teknologi Modern
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600">
            Rekkoku dirancang untuk memberikan performa, keamanan, dan
            pengalaman pengguna terbaik.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              Next.js
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              React
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              TypeScript
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              Tailwind CSS
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              Prisma
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              PostgreSQL
            </span>
            <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              Docker
            </span>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 rounded-lg bg-blue-600 p-12 text-center">
          <h2 className="text-3xl font-bold text-white">
            Siap untuk Menjelajah?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Bergabunglah dengan komunitas Rekkoku hari ini dan mulailah berbagi
            serta menemukan permata tersembunyi di Indonesia.
          </p>
          <div className="mt-8">
            <a
              href="/#search"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-md transition-transform hover:scale-105"
            >
              Mulai Sekarang
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
