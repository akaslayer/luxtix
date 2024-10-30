import * as z from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CgRemove } from "react-icons/cg";

const ticketRowSchema = z.object({
  ticketName: z.string().min(1, "Ticket name is required"),
  ticketPrice: z.number().min(0, "Price must be 0 or greater"),
  ticketQuantity: z.number().int().min(1, "Quantity must be at least 1"),
});

function TicketRow({
  index,
  removeRow,
  isPaid
}: {
  index: number;
  removeRow: (index: number) => void;
  isPaid: boolean;
}) {
  const form = useFormContext()


  return (

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 mb-4">
      <FormField
        control={form.control}
        name={`tickets.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ticket Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. General Admission" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`tickets.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ticket Price</FormLabel>
            <FormControl>
              <Input type="number" placeholder="IDR 0.00"
                disabled={!isPaid}
                {...field}
                value={isPaid ? field.value || "" : 0}
                onChange={(e) => {
                  if (isPaid) {
                    field.onChange(e.target.value);
                  } else {
                    field.onChange(0);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`tickets.${index}.qty`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ticket Quantity</FormLabel>
            <FormControl>
              <Input type="number" placeholder="QTY 0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-row">
        <button
          type="button"
          onClick={() => removeRow(index)}
          className="btn-anim p-2 text-luxtix-3"
        >
          <CgRemove size={20} />
        </button>
      </div>
    </div>

  );
}

export default TicketRow;
