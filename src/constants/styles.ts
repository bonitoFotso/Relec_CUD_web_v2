export const styles = {
  layout: {
    container: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    content: "container mx-auto px-4 sm:px-6 lg:px-8 py-8",
  },
  card: {
    base: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 ease-in-out",
    hover: "hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-500/5",
    active: "active:translate-y-[0px]",
  },
  container: "bg-white rounded-2xl shadow-sm border border-gray-100/50 backdrop-blur-xl",
  input: {
    base: "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500",
    withIcon: "pl-11 pr-4",
    error: "border-red-300 focus:ring-red-500/20 focus:border-red-500",
  },
  button: {
    primary: "px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 active:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
    icon: "p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
    danger: "p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
  },
  badge: {
    base: "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
    success: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800 shadow-sm shadow-green-100/50",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800 shadow-sm shadow-yellow-100/50",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800 shadow-sm shadow-red-100/50",
    info: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800 shadow-sm shadow-blue-100/50",
  },
  nav: {
    item: "flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 group",
    active: "bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 shadow-sm",
    inactive: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
  },
  text: {
    gradient: "bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent",
  }
}; 