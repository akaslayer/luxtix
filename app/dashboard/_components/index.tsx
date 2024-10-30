"use client";

import useEventSummary, { EventSummary } from "@/hooks/useEventSummary";
import useOrganizerEvent from "@/hooks/useOrganizerEvent";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePurchasedEvents } from "@/contexts/PurchasedEventsContext";
import CircularLoader from "@/components/ui/circular-loader";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function Dashboard() {
  const [dateType, setDateType] = useState("day");
  const { organizerEvent } = useOrganizerEvent();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { fetchEventSummary } = useEventSummary();
  const [summaryData, setSummaryData] = useState<EventSummary>();
  const { setEventId, eventId } = usePurchasedEvents();
  const [dataPeriod, setDataPeriod] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const { deleteEvent, isDeleting } = useDeleteEvent();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();
  const handleModifyClick = (eventId: string | number) => {
    router.push(`/update-event/${eventId}`);
  };

  const handleEventChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const id = parseInt(event.target.value);
    setSelectedEvent(event.target.value);
    try {
      const result = await fetchEventSummary(id, dateType);
      setEventId(id);
      setSummaryData(result.data);
    } catch (error) {
      console.error("Error fetching event summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateTypeChange = async (newDateType: string) => {
    setIsLoading(true);
    setDateType(newDateType);
    try {
      const result = await fetchEventSummary(
        parseInt(selectedEvent!),
        newDateType
      );
      setSummaryData(result.data);
    } catch (error) {
      console.error("Error fetching event summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (organizerEvent.length > 0) {
        setIsLoading(true);
        try {
          const result = await fetchEventSummary(organizerEvent[0].id, "day");
          setEventId(organizerEvent[0].id);
          setSummaryData(result.data);
          setSelectedEvent(organizerEvent[0].id.toString());
        } catch (error) {
          console.error("Error fetching initial event summary:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [organizerEvent]);

  const handleDeleteConfirm = async () => {
    if (selectedEvent) {
      const success = await deleteEvent(parseInt(selectedEvent));
      if (success) {
        window.location.reload();
      }
    }
  };

  const getXAxisDataKey = () => {
    switch (dateType) {
      case "day":
        return "hour";
      case "month":
        return "day";
      case "year":
        return "month";
      default:
        return "hour";
    }
  };

  const formatXAxisTick = (value: string) => {
    switch (dateType) {
      case "day":
        return `${value}:00`;
      case "month":
        return `${value}`;
      case "year":
        return new Date(2024, parseInt(value) - 1, 1).toLocaleString(
          "default",
          { month: "short" }
        );
      default:
        return value;
    }
  };

  const getDataPeriod = () => {
    switch (dataPeriod) {
      case "day":
        return "hpur";
      case "month":
        return "day";
      case "year":
        return "month";
      default:
        return "hour";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularLoader />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center mb-6 pt-16">
            <label htmlFor="event-select" className="mr-4 mb-2 sm:mb-0">
              Select your created events
            </label>
            <select
              id="event-select"
              className="border border-luxtix-7 rounded p-2 flex-grow"
              value={selectedEvent || ""}
              onChange={handleEventChange}
            >
              <option value="" disabled>
                Select an event
              </option>
              {organizerEvent.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.eventName}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap mt-2 sm:mt-0">
              <Link href="/create-event">
                <button className="btn-anim bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 ml-0 sm:ml-4 px-4 py-2 rounded mb-2 sm:mb-0">
                  Create
                </button>
              </Link>
              <button className="btn-anim bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 ml-0 sm:ml-4 px-4 py-2 rounded mb-2 sm:mb-0" onClick={() => handleModifyClick(eventId!)}>
                Modify
              </button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    className="btn-anim bg-luxtix-3 text-white hover:bg-luxtix-2 ml-0 sm:ml-4 px-4 py-2 rounded mb-2 sm:mb-0"
                    disabled={isDeleting || !selectedEvent}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the event.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteConfirm}
                      className="bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="mb-6 text-center sm:text-left flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{summaryData?.name}</h1>
            <h2 className="text-xl font-medium">{summaryData?.address}</h2>
            <p className="text-luxtix-8">{summaryData?.eventDate}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-card p-6 rounded shadow">
              <h2 className="text-luxtix-5">Ticket Sold</h2>
              <p className="text-luxtix-7">
                Capacity: {summaryData?.soldTicket}/{summaryData?.ticketQty}{" "}
                Tickets
              </p>
              <div className="flex justify-center items-center h-32">
                <div className="text-4xl font-bold">
                  {summaryData &&
                    `${(
                      (summaryData.soldTicket / summaryData.ticketQty) *
                      100
                    ).toFixed(0)}%`}
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded shadow">
              <h2 className="text-luxtix-5">Average Event Rating</h2>
              <div className="flex justify-center items-center h-32">
                <div className="text-4xl font-bold">{summaryData?.rating}</div>
              </div>
            </div>
            <div className="bg-card p-6 rounded shadow">
              <h2 className="text-luxtix-5">Ticket Revenue</h2>
              <div className="flex justify-center items-center h-32">
                <div className="text-4xl font-bold">
                  IDR {summaryData?.revenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded shadow mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-luxtix-5 mb-2 sm:mb-0">
                Ticket Sales Over Time
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`btn-anim ${dateType === "day" ? "bg-luxtix-2" : "bg-luxtix-6"
                    } text-luxtix-1 hover:bg-luxtix-2 px-2 py-1 rounded`}
                  onClick={() => handleDateTypeChange("day")}
                >
                  D
                </button>
                <button
                  className={`btn-anim ${dateType === "month" ? "bg-luxtix-2" : "bg-luxtix-6"
                    } text-luxtix-1 hover:bg-luxtix-2 px-2 py-1 rounded`}
                  onClick={() => handleDateTypeChange("month")}
                >
                  M
                </button>
                <button
                  className={`btn-anim ${dateType === "year" ? "bg-luxtix-2" : "bg-luxtix-6"
                    } text-luxtix-1 hover:bg-luxtix-2 px-2 py-1 rounded`}
                  onClick={() => handleDateTypeChange("year")}
                >
                  Y
                </button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales</CardTitle>
                <CardDescription>
                  {summaryData?.tickets && summaryData.tickets.length > 0
                    ? new Date(summaryData.tickets[0].date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                    : "No data available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={summaryData?.tickets.map((ticket) => ({
                      ...ticket,
                      hour: new Date(ticket.date).getHours(),
                      day: new Date(ticket.date).getDate(),
                      month: new Date(ticket.date).getMonth() + 1,
                      year: new Date(ticket.date).getFullYear(),
                    }))}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey={getXAxisDataKey()}
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => formatXAxisTick(value)}
                      interval="preserveStartEnd"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="totalQty" fill="#E6D5B8" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Total tickets sold: {summaryData?.soldTicket || 0}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing {getDataPeriod()} ticket sales
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
