import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Briefcase, CheckCircle, Clock } from "lucide-react";

interface StatistiquesMissionsProps {
  totalMissions: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  percent: (count: number) => string;
}
export default function StatistiquesMissions({
  totalMissions,
  pendingCount,
  inProgressCount,
  completedCount,
  percent,
}: StatistiquesMissionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-purple-700 dark:text-purple-300">
            <Briefcase className="h-5 w-5 mr-2" />
            Total des missions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-purple-800 dark:text-purple-200">
              {totalMissions}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-amber-700 dark:text-amber-300">
            <Clock className="h-5 w-5 mr-2" />
            En attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-amber-800 dark:text-amber-200">
                {pendingCount}
              </span>
              <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {percent(pendingCount)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${percent(pendingCount)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte En cours */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-indigo-700 dark:text-indigo-300">
            <AlertCircle className="h-5 w-5 mr-2" />
            En cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-indigo-800 dark:text-indigo-200">
                {inProgressCount}
              </span>
              <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {percent(inProgressCount)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${percent(inProgressCount)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte Terminées */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="h-5 w-5 mr-2" />
            Terminées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                {completedCount}
              </span>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {percent(completedCount)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${percent(completedCount)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
