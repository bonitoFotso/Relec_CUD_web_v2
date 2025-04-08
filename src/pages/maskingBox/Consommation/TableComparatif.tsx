import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConsommation } from "@/hooks/useConsommation";

const TableComparatif = () => {
  const { streetlightTypes, calculerConsommationMoyenne, calculerRendement } =
    useConsommation();

  return (
    <Table>
      <TableCaption>
        Données techniques comparatives des différents types de lampadaires
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/5">Type de lampadaires</TableHead>
          <TableHead className="w-1/5">Puissance lumineuse (lumens)</TableHead>
          <TableHead className="w-1/5">Puissance consommée (W)</TableHead>
          <TableHead className="w-1/5">Rendement (lm/W)</TableHead>
          <TableHead className="w-1/5">Consommation par nuit (kWh)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {streetlightTypes.map((type) => (
          <TableRow key={type.id}>
            <TableCell className="font-medium">{type.name}</TableCell>
            <TableCell>{type.puissanceLumineuse}</TableCell>
            <TableCell>{type.puissanceConsommee}</TableCell>
            <TableCell>{calculerRendement(type)}</TableCell>
            <TableCell>
              {calculerConsommationMoyenne(type).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default TableComparatif;
