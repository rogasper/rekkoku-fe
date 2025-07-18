import Footer from "@/components/Footer";
import {
  Share2,
  Compass,
  Globe,
  Heart,
  ThumbsUp,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Rekkoku",
  description:
    "Kenalan sama Rekkoku yuk! Platform kece buat nemuin dan sharing rekomendasi tempat hits plus perjalanan seru di seluruh Dunia.",
};

const AboutPage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <header className="bg-white shadow-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-orange-50/30"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#EA7B26]/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-green-400/10 to-[#EA7B26]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-6xl px-6 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EA7B26]/10 to-orange-100 px-4 py-2 rounded-full text-[#EA7B26] font-medium text-sm">
                <Globe className="w-4 h-4" />
                Platform Komunitas Travel
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#EA7B26] via-orange-500 to-[#FF9500] bg-clip-text text-transparent leading-tight">
                Share Your Taste!
              </h1>
              <p className="text-xl leading-relaxed text-gray-600 max-w-lg">
                <span className="font-bold text-[#EA7B26]">Rekkoku</span> itu
                platform komunitas yang super kece buat sharing dan nemuin
                rekomendasi perjalanan plus tempat-tempat hits, langsung dari
                para traveler keren kayak kamu!
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Komunitas Global</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Destinasi Worldwide</span>
                </div>
              </div>
            </div>
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-[2/1] shadow-2xl rounded-3xl bg-gradient-to-br from-[#EA7B26] via-orange-500 to-[#FF9500] p-6 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Rekkoku"
                width={300}
                height={300}
                className="w-full h-full object-contain drop-shadow-lg"
              />
              <div className="absolute -top-3 -right-6 sm:-right-10 w-fit px-4 py-3 bg-white rounded-2xl flex items-center gap-3 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <ThumbsUp className="w-6 h-6 text-red-500" />
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  Recommended
                </p>
              </div>
              <div className="absolute -bottom-3 -left-6 sm:-left-8 w-fit px-4 py-3 bg-white rounded-2xl flex items-center gap-3 shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <Compass className="w-6 h-6 text-green-500" />
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  Explore
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* Features Section */}
        <section className="relative">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-orange-100/30 rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-green-50 px-6 py-3 rounded-full text-gray-700 font-medium text-sm mb-6">
              <Heart className="w-4 h-4 text-red-500" />
              Fitur Unggulan
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Apa Aja Sih yang Bisa Kamu Lakuin di Rekkoku?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join sama komunitas travelers kece dan explore berbagai fitur seru
              yang udah kita siapin buat pengalaman travel yang unforgettable
              banget!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:gap-12 md:grid-cols-3">
            <div className="group relative rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-8 text-center shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-blue-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 mb-6">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-4">
                  Share Petualangan Kamu!
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Bikin dan post perjalanan kamu dengan gampang banget, lengkap
                  sama list tempat kece dan map-nya juga!
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-8 text-center shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-green-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-300/20 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 mb-6">
                  <Compass className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-4">
                  Discover Rekomendasi Hits!
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Explore ribuan rekomendasi dari user lain, nemuin tempat baru
                  di sekitar kamu, atau search based on kota tujuan yang kamu
                  mau!
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-red-50 via-red-100 to-red-200 p-8 text-center shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-red-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 to-red-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-300/20 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 mb-6">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-4">
                  Save & Customize!
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Like dan bookmark postingan favorit kamu buat planning
                  perjalanan seru di masa depan. It's that simple!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-24">
          <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#EA7B26]/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#EA7B26]/5 to-blue-500/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium text-sm mb-8">
                <Mail className="w-5 h-5 text-[#EA7B26]" />
                Hubungi Kami
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ada Pertanyaan atau Saran Kece?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Tim kita siap bantu kamu! Jangan sungkan buat contact kita untuk
                pertanyaan, feedback, atau kalo mau kolaborasi bareng.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="mailto:admin@rogasper.com"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#EA7B26] to-orange-500 hover:from-orange-500 hover:to-[#EA7B26] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  admin@rogasper.com
                </a>
                <div className="text-gray-400 text-sm">
                  Atau DM kita langsung lewat platform media sosial kita aja!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-20">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#EA7B26] via-orange-500 to-[#FF9500] p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <g fill="none" fillRule="evenodd">
                  <g fill="#ffffff" fillOpacity="0.05">
                    <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" />
                  </g>
                </g>
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready Buat Explore?
              </h2>
              <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join komunitas Rekkoku sekarang juga dan mulai sharing plus
                discovering hidden gems yang super kece di Seluruh Dunia!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-[#EA7B26] px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <Compass className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  Mulai Sekarang
                </Link>
                <Link
                  href="/search"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-xl font-semibold border-2 border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Globe className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Jelajahi Tempat
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
