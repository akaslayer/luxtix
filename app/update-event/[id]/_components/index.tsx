"use client";

import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsDoorOpen, BsCurrencyDollar } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCities } from "@/hooks/useCities";
import TicketRow from "./TicketRow";
import VoucherRow from "./VoucherRow";
import useOrganizerEventDetailById from "@/hooks/useOrganizerEventDetailById";
import { Button } from "@/components/ui/button";
import useUpdateEvent from "@/hooks/useUpdateEvent";


const eventCategories = [
  "Entertainment",
  "Educational & Business",
  "Arts & Culture",
  "Sports & Fitness",
  "Technology & Innovation",
  "Travel & Adventure",
];


const today = new Date();
today.setHours(0, 0, 0, 0);

const UpdateEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  isOnline: z.boolean(),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  venue: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Venue address is required"),
  category: z.coerce.number().min(1, "Event category is required"),
  city: z.coerce.number().min(1, "City is required"),
  description: z.string().min(1, "Description is required"),
  isPaid: z.boolean(),
  tickets: z.array(
    z.object({
      id: z.coerce.string().transform((value) => value === '' ? -1 : value).nullable(),
      name: z.string(),
      price: z.coerce.number(),
      qty: z.coerce.number().min(1, "Ticket qty is required"),
    })
  ),
  vouchers: z.array(
    z.object({
      id: z.coerce.string().transform((value) => value === '' ? -1 : value).nullable(),
      name: z.string(),
      qty: z.coerce.number().min(1, "Voucher qty is required"),
      rate: z.coerce.number(),
      startDate: z.union([
        z.null(),
        z.string().refine((date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime()) && parsedDate >= today;
        }, "Start date must be today or later")
      ]),
      endDate: z.union([
        z.null(),
        z.string().refine((date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime()) && parsedDate >= today;
        }, "End date must be today or later")
      ]),
      referralOnly: z.boolean(),
    })
  ),
});

const imageSchema = z.instanceof(File);

function UpdateEvent() {
  const router = useRouter();
  const { id } = useParams();
  const eventId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);

  const { event } = useOrganizerEventDetailById(eventId);


  const { toast } = useToast();
  const { updateEvent } = useUpdateEvent()
  const { cities, loading } = useCities();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof UpdateEventSchema>>({
    resolver: zodResolver(UpdateEventSchema),
    defaultValues: {
      name: "",
      category: 1,
      isOnline: false,
      eventDate: "",
      startTime: "",
      endTime: "",
      venue: "",
      address: "",
      city: 1,
      description: "",
      isPaid: false,
      tickets: [],
      vouchers: [],
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        name: event.name,
        category: event.category,
        isOnline: event.isOnline,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        address: event.address,
        city: event.city,
        description: event.description,
        isPaid: event.isPaid,
        tickets: event.tickets.map(ticket => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          qty: ticket.qty
        })),
        vouchers: event.vouchers.map(voucher => ({
          id: voucher.id,
          name: voucher.name,
          qty: voucher.qty,
          rate: voucher.rate,
          startDate: voucher.startDate,
          endDate: voucher.endDate,
          referralOnly: voucher.referralOnly
        })),
      });
    }
  }, [event, form]);

  const { fields: ticketField, append: appendTicket, remove: removeTicket } = useFieldArray({
    control: form.control,
    name: "tickets"
  })

  const { fields: voucherField, append: appendVoucher, remove: removeVoucher } = useFieldArray({
    control: form.control,
    name: "vouchers"
  })
  const isPaid = form.watch("isPaid");

  useEffect(() => {
    if (!isPaid) {
      const tickets = form.getValues("tickets");
      tickets.forEach((_, index) => {
        form.setValue(`tickets.${index}.price`, 0);
      });
    }
  }, [isPaid, form]);


  const onSubmit = async (data: z.infer<typeof UpdateEventSchema>) => {
    try {
      const formData = new FormData()
      const eventData = JSON.stringify(data);

      if (image) {
        formData.append('image', image);
      }
      formData.append('eventData', eventData)
      console.log(eventData)
      const result = await updateEvent(formData, eventId);
      if (result) {
        toast({
          title: "Event Updated",
          description: "Your event has been successfully Updated.",
          duration: 3000,
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to Update event:", err);
      toast({
        title: "Error",
        description: "Failed to Update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="block sm:py-6">
          <Link href="/" className="text-luxtix-1">
            <AiOutlineArrowLeft size={25} />
          </Link>
        </div>

        <section className="mb-6">
          <h2 className="text-3xl font-semibold mb-4">Event Details</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the name of your event"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventCategories.map((category, index) => (
                      <SelectItem key={category} value={(index + 1).toString()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Date & Time</h2>
          <FormField
            control={form.control}
            name="isOnline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value.toString()}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Offline</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Online</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where will your event take place?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Address</FormLabel>
                <FormControl>
                  <Input placeholder="Where is the venue located?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {loading ? (
                      <SelectItem value="loading">Loading cities...</SelectItem>
                    ) : (
                      cities
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what's special about your event & other important details."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <Input type="file" onChange={(e) => setImage(e.target.files![0])} />
          <p className="text-sm text-luxtix-7 mt-2">
            Feature Image must be at least 1170 pixels wide by 504 pixels high.
            Valid file formats: JPG, GIF, PNG.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            What type of event are you running?
          </h2>
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value.toString()}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <BsCurrencyDollar className="inline-block mr-2" />
                        Paid Event
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <BsDoorOpen className="inline-block mr-2" />
                        Free Event
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            What tickets are you selling?
          </h2>
          <div className="py-2">
            {ticketField.map((_, index: number) => (
              <TicketRow key={index} index={index} removeRow={removeTicket} isPaid={isPaid} />
            ))}
            <button
              onClick={() => appendTicket({
                id: '',
                name: '',
                price: 0,
                qty: 0
              })}
              className="btn-anim bg-luxtix-4 hover:bg-luxtix-2 text-black text-sm p-2 rounded-md"
            >
              Add Ticket
            </button>
          </div>
        </section>

        {form.watch("isPaid") && (
          <>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Do you want to Update promotional voucher?
              </h2>
              <div className="py-2">
                {voucherField.map((_, index: number) => (
                  <VoucherRow key={index} index={index} removeRow={removeVoucher} />
                ))}
                <button
                  onClick={() => appendVoucher({
                    id: -1,
                    name: '',
                    qty: 0,
                    rate: 0,
                    startDate: null,
                    endDate: null,
                    referralOnly: false
                  })}
                  className="btn-anim bg-luxtix-4 hover:bg-luxtix-2 text-black text-sm p-2 rounded-md"
                >
                  Add Voucher
                </button>
              </div>
            </section>
          </>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="btn-anim bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 px-4 py-2 rounded-lg"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default UpdateEvent;
