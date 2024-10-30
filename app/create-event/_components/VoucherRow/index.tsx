

import { useFormContext, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CgRemove } from "react-icons/cg";
import { number, z } from "zod";

const voucherRowSchema = z.object({
  name: z.string().min(1, "Voucher name is required"),
  rate: z.coerce.number().min(1, "Rate must be at least 1"), // Adding min validation
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  referralOnly: z.boolean()
});

function VoucherRow({
  index,
  removeRow,
}: {
  index: number;
  removeRow: (index: number) => void;
}) {

  const { control, watch, setValue } = useFormContext();
  const startDate = watch(`vouchers.${index}.startDate`);
  const referralOnly = useWatch({
    control,
    name: `vouchers.${index}.referralOnly`,
  })

  const handleReferralOnlyChange = (checked: boolean) => {
    setValue(`vouchers.${index}.referralOnly`, checked);
    if (checked) {
      setValue(`vouchers.${index}.startDate`, null);
      setValue(`vouchers.${index}.endDate`, null);
      setValue(`vouchers.${index}.rate`, 10);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-x-4 mb-4">
      <FormField
        control={control}
        name={`vouchers.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md mb-2 text-luxtix-8">Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Voucher name"
                className="w-full p-2 border border-input rounded"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`vouchers.${index}.qty`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md mb-2 text-luxtix-8">QTY</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Quantity"
                className="w-full p-2 border border-input rounded"
                {...field}

              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`vouchers.${index}.rate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md mb-2 text-luxtix-8">
              Rate (%)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Discount rate"
                className="w-full p-2 border border-input rounded"
                {...field}
                disabled={referralOnly}
                value={referralOnly ? '10' : field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`vouchers.${index}.startDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md mb-2 text-luxtix-8">
              Start Date
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-input rounded"
                {...field}
                disabled={referralOnly}
                value={referralOnly ? "" : field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`vouchers.${index}.endDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md mb-2 text-luxtix-8">
              End Date
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-input rounded"
                {...field}
                disabled={referralOnly}
                value={referralOnly ? "" : field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-center justify-end">
        <FormField
          control={control}
          name={`vouchers.${index}.referralOnly`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    field.onChange(checked);
                    handleReferralOnlyChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel>Set as referral voucher?</FormLabel>
            </FormItem>
          )}
        />
        <button
          type="button"
          onClick={() => removeRow(index)}
          className="btn-anim p-2 text-luxtix-3 mt-2"
        >
          <CgRemove size={20} />
        </button>
      </div>
    </div>
  );
}

export default VoucherRow;
