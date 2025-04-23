import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanieFormValues } from "@/pages/companies/Companies";

interface CompanieFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CompanieFormValues>;
  onSubmit: (values: CompanieFormValues) => Promise<void>;
  onCancel: () => void;
}

const CompanieFormDialog: React.FC<CompanieFormDialogProps> = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une compagnie</DialogTitle>
          <DialogDescription>Remplissez les informations de la compagnie ci-dessous.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la compagnie</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la compagnie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
              <Button type="button" variant="ghost" onClick={onCancel}>
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanieFormDialog;

