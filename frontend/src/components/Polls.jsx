// File: frontend/src/components/Polls.jsx
import React, { useEffect } from "react";
import Button from "./ui/Button.jsx";
import H2 from "./ui/H2.jsx";
import usePollStore from "../stores/pollStore.js";
import H4 from "./ui/H4.jsx";
import Card from "./ui/Card.jsx";
import toast from "react-hot-toast";
import PollSkeleton from "./skeletons/PollSkeleton.jsx";

function Polls({ groupId }) {
  const { polls, isLoading, fetchPolls, voteOnPoll, finalizePoll } =
    usePollStore();

  useEffect(() => {
    fetchPolls(groupId).then();
  }, [groupId, fetchPolls]);

  const handleVote = async (pollId, optionId) => {
    const voteToast = toast.loading("Submitting vote...");

    try {
      await voteOnPoll(groupId, pollId, optionId);

      toast.success("Vote submitted successfully!", { id: voteToast });
    } catch (error) {
      console.error("Error while voting", error);
      toast.error("Vote failed.", { id: voteToast });
    }
  };

  const handleFinalize = async (pollId) => {
    const finalizeToast = toast.loading("Finalizing poll...");

    try {
      await finalizePoll(groupId, pollId);
      toast.success("Poll finalized successfully and event created!", {
        id: finalizeToast,
      });
    } catch (error) {
      console.error("Error during finalization", error);
      toast.error(
        `Finalization failed: ${error.response?.data?.message || "Please try again."}`,
        { id: finalizeToast },
      );
    }
  };

  const renderOptions = (poll, type) => {
    const optionsForType = poll.options.filter((opt) => opt.type === type);
    if (optionsForType.length === 0) return null;

    return (
      <div>
        <H4>{type.charAt(0) + type.slice(1).toLowerCase()}s:</H4>
        <div className="space-y-3">
          {optionsForType.map((opt) => (
            <div key={opt.id}>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleVote(poll.id, opt.id)}
                  className="bg-gray-600 text-sm rounded-lg hover:bg-blue-600 transition-colors w-full"
                >
                  {opt.value}
                </Button>
                <div className="flex flex-wrap items-center gap-1">
                  {opt.voters.map((voter) => (
                    <span
                      key={voter.id}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full"
                      title={voter.username}
                    >
                      {voter.username.charAt(0).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <PollSkeleton />
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white">{poll.title}</h3>
                  <p className="text-sm text-gray-400">{poll.description}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    poll.status === "open"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-500 text-gray-100"
                  }`}
                >
                  {poll.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {renderOptions(poll, "TIME")}
                {renderOptions(poll, "LOCATION")}
                {renderOptions(poll, "ACTIVITY")}
              </div>

              {poll.status === "open" && (
                <div className="mt-4 border-t border-gray-600 pt-4">
                  <Button
                    onClick={() => handleFinalize(poll.id)}
                    className="bg-green-600 hover:bg-green-700 w-full"
                  >
                    Finalize and Create Event
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <Card>
      <H2>📣 Open Polls</H2>

      {isLoading && <p className="text-gray-400">Loading polls...</p>}

      {!isLoading && polls.length === 0 && (
        <p className="text-gray-400">No open polls in this group.</p>
      )}

      {renderContent()}
    </Card>
  );
}

export default Polls;
