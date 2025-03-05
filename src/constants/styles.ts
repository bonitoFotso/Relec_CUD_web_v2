export const styles = {
  card: "bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ease-in-out",
  container: "bg-white rounded-2xl shadow-sm border border-gray-100/50 backdrop-blur-xl",
  input: {
    base: "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400",
    withIcon: "pl-11 pr-4 py-2.5",
    error: "border-red-300 focus:ring-red-500/20 focus:border-red-500",
  },
  button: {
    primary: "px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    secondary: "px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
    icon: "p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
    danger: "p-2.5 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
  },
  badge: {
    base: "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
    success: "bg-green-50 text-green-700 border-green-100 shadow-sm shadow-green-100/50",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-100 shadow-sm shadow-yellow-100/50",
    danger: "bg-red-50 text-red-700 border-red-100 shadow-sm shadow-red-100/50",
    info: "bg-blue-50 text-blue-700 border-blue-100 shadow-sm shadow-blue-100/50",
  },
  nav: {
    item: "flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 group",
    active: "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50",
    inactive: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
  },
}; 