// just backup
// "use client";
// import TopUsersSection from "@/components/TopUsersSection";
// import TopPostsSection from "@/components/TopPostsSection";
// import TopCitiesSection from "@/components/TopCitiesSection";
// import { Tabs, Tab, Card, CardBody, Skeleton } from "@heroui/react";
// import { useState, Suspense } from "react";

// interface ExploreContentProps {
//   className?: string;
// }

// const SectionSkeleton = () => (
//   <Card className="w-full">
//     <CardBody className="p-4 sm:p-6">
//       <Skeleton className="rounded-lg mb-4">
//         <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
//       </Skeleton>
//       <div className="space-y-3">
//         {[...Array(3)].map((_, i) => (
//           <div key={i} className="flex items-center space-x-3">
//             <Skeleton className="flex rounded-full w-10 h-10" />
//             <div className="w-full flex flex-col space-y-2">
//               <Skeleton className="h-4 w-3/5 rounded-lg" />
//               <Skeleton className="h-3 w-2/5 rounded-lg" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </CardBody>
//   </Card>
// );

// export default function ExploreContent({
//   className = "",
// }: ExploreContentProps) {
//   const [activeTab, setActiveTab] = useState("explore");

//   const tabs = [
//     { key: "discover", label: "Discover" },
//     { key: "trending", label: "Trending" },
//     { key: "explore", label: "Explore" },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "discover":
//         return (
//           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
//             <div className="text-center mb-4 sm:mb-6 lg:mb-8">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
//                 Discover Amazing Places
//               </h1>
//               <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
//                 Explore the most popular destinations, trending posts, and top
//                 contributors in our community.
//               </p>
//             </div>

//             <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
//               <div className="w-full">
//                 <Suspense fallback={<SectionSkeleton />}>
//                   <TopUsersSection limit={5} />
//                 </Suspense>
//               </div>
//               <div className="w-full">
//                 <Suspense fallback={<SectionSkeleton />}>
//                   <TopPostsSection limit={5} />
//                 </Suspense>
//               </div>
//               <div className="w-full lg:col-span-2 2xl:col-span-1">
//                 <Suspense fallback={<SectionSkeleton />}>
//                   <TopCitiesSection limit={5} />
//                 </Suspense>
//               </div>
//             </div>
//           </div>
//         );

//       case "trending":
//         return (
//           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
//             <div className="text-center mb-4 sm:mb-6 lg:mb-8">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
//                 What's Trending
//               </h1>
//               <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
//                 See what's hot right now - the most liked posts and active users
//                 this month.
//               </p>
//             </div>

//             <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-2">
//               <Suspense fallback={<SectionSkeleton />}>
//                 <TopPostsSection limit={8} />
//               </Suspense>
//               <Suspense fallback={<SectionSkeleton />}>
//                 <TopUsersSection limit={8} />
//               </Suspense>
//             </div>
//           </div>
//         );

//       case "explore":
//         return (
//           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
//             <div className="text-center mb-4 sm:mb-6 lg:mb-8">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
//                 Explore Destinations
//               </h1>
//               <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
//                 Discover the most popular cities and places to visit based on
//                 community posts.
//               </p>
//             </div>

//             <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-2">
//               <div className="xl:order-1">
//                 <Suspense fallback={<SectionSkeleton />}>
//                   <TopCitiesSection limit={10} />
//                 </Suspense>
//               </div>
//               <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:order-2">
//                 <Suspense fallback={<SectionSkeleton />}>
//                   <TopPostsSection limit={5} />
//                 </Suspense>
//                 <Suspense fallback={<SectionSkeleton />}>
//                   <TopUsersSection limit={3} />
//                 </Suspense>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className={`max-w-[1024px] mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 ${className}`}
//     >
//       {/* Header with Tabs */}
//       <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
//           <Tabs
//             aria-label="Analytics tabs"
//             color="warning"
//             variant="underlined"
//             size="lg"
//             classNames={{
//               base: "w-full",
//               tabList:
//                 "gap-2 sm:gap-4 lg:gap-6 w-full relative rounded-none p-0 border-b border-divider",
//               cursor:
//                 "w-full bg-gradient-to-r from-[#EA7B26] to-[#D96A1F] rounded-none shadow-sm",
//               tab: "max-w-fit px-3 sm:px-4 lg:px-6 h-12 sm:h-14 transition-all duration-200 hover:bg-gray-50",
//               tabContent:
//                 "group-data-[selected=true]:text-[#EA7B26] group-data-[selected=true]:font-semibold font-medium text-sm sm:text-base transition-all duration-200",
//             }}
//             selectedKey={activeTab}
//             onSelectionChange={(key) => setActiveTab(key as string)}
//           >
//             {tabs.map((tab) => (
//               <Tab key={tab.key} title={tab.label} />
//             ))}
//           </Tabs>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//         <div className="animate-in fade-in duration-500">
//           {renderTabContent()}
//         </div>
//       </div>
//     </div>
//   );
// }
