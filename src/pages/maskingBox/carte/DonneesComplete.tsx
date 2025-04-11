/* eslint-disable @typescript-eslint/no-explicit-any */
const DonneesComplete = ({
  filteredEquipments,
}: {
  filteredEquipments: any;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 absolute bottom-4 left-4 z-20">
      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
        <p className="flex gap-1">
          Lampadaires: {filteredEquipments.Lampadaires.length}
        </p>
        <p className="flex gap-1">
          Compteurs: {filteredEquipments.Compteurs.length}
        </p>
        <p className="flex gap-1">
          Amoires: {filteredEquipments.Amoires.length}
        </p>
        <p className="flex gap-1">
          Postes: {filteredEquipments.Substations.length}
        </p>
      </div>
    </div>
  );
};

export default DonneesComplete;
