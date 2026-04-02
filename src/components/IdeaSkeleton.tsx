export default function IdeaSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* ছবির জায়গায় গ্রে বক্স */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full" />
      
      <div className="p-5 space-y-3">
        {/* টাইটেলের জন্য লাইন */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        
        {/* ডেসক্রিপশনের জন্য লাইন */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        
        {/* বাটনের জায়গায় ছোট বক্স */}
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    </div>
  );
}