import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import CounterCard from "../components/counters/CounterCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase-client";
import type { Counter, NewCounter } from "../types/counter";

const COUNTERS_QUERY_KEY = ["counters"];

function CountersPage() {
  const [showArchived, setShowArchived] = useState(false);
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();

  const {
    data: counters,
    isPending,
    isError,
  } = useQuery({
    queryKey: COUNTERS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counters")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data as Counter[];
    },

    enabled: !!user && !authLoading,
  });

  const createCounter = useMutation({
    mutationFn: async () => {
      const newTitle = `Counter ${(counters?.length || 0) + 1}`;

      const { data, error } = await supabase
        .from("counters")
        .insert({ title: newTitle } satisfies NewCounter)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Counter created!");
      queryClient.invalidateQueries({ queryKey: COUNTERS_QUERY_KEY });
    },
    onError: () => {
      toast.error("Couldn't create counter");
    },
  });

  const filteredCounters = counters?.filter((counter) => {
    if (showArchived) return true; // Show all counters
    return !counter.is_archived; // Otherwise hide archived ones
  });

  if (authLoading || isPending || !counters) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="text-error p-4 text-center">
        Something went wrong while loading your counters.
      </div>
    );
  }

  return (
    <section id="counters" className="bg-base-200 text-center">
      <div className="mx-auto min-h-[70vh] max-w-5xl px-4 md:px-6">
        <h1 className="mb-6 text-3xl font-bold">Your Counters</h1>
        <div className="mb-4 flex justify-end">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {showArchived ? "Hide Archived" : "Show Archived"}
          </button>
        </div>

        {counters?.length === 0 ? (
          <Fragment>
            <p className="text-base-content/70 mb-4">
              You don't have any counters yet. Let's fix that!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => createCounter.mutate()}
            >
              + Create Counter
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-4">
              {filteredCounters &&
                filteredCounters.map((counter) => (
                  <CounterCard key={counter.id} counter={counter} />
                ))}
            </div>
            <button
              className="btn btn-primary fixed right-6 bottom-6 rounded-full"
              onClick={() => createCounter.mutate()}
            >
              +
            </button>
          </Fragment>
        )}
      </div>
    </section>
  );
}

export default CountersPage;
