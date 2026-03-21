import React from "react";
import H2 from "./ui/H2.jsx";
import Card from "./ui/Card.jsx";
import { formatDateTime } from "../utils/dateUtils.js";
import EventListSkeleton from "./skeletons/EventListSkeleton.jsx";
import { useEvents } from "../hooks/useEvents.js";

function EventList({ groupId }) {
  const { data: events = [], isLoading, isError } = useEvents(groupId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <EventListSkeleton />
          <EventListSkeleton />
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-lg text-white">{event.title}</h3>
              <p className="text-sm text-blue-300">
                {formatDateTime(event.start_time)}
              </p>
              <div className="text-sm text-gray-300 mt-2">
                <p>
                  <span className="font-semibold">Where:</span>{" "}
                  {event.location_name || "TBD"}
                </p>
                <p>
                  <span className="font-semibold">What:</span>{" "}
                  {event.activity_name || "TBD"}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  if (isError) {
    return <p className="text-red-400">Failed to load events.</p>;
  }

  return (
    <Card>
      <H2>🗓️ Finalized Events</H2>

      {!isLoading && events.length === 0 && (
        <p className="text-gray-400">No upcoming events for this group.</p>
      )}

      {renderContent()}
    </Card>
  );
}

export default EventList;
