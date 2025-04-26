import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase-client";
import type { Counter, NewCounter } from "../types/counter";
import CounterCard from "../components/counters/CounterCard";

const COUNTERS_QUERY_KEY = ["counters"];

function CountersPage() {
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

  if (authLoading || isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-error p-4 text-center">
        Something went wrong while loading your counters.
      </div>
    );
  }

  if (!counters) {
    return (
      <div className="p-4 text-center">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  return (
    <section id="counters">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-6 text-3xl font-bold">Your Counters</h1>

        {counters?.length === 0 ? (
          <>
            <p className="text-base-content/70 mb-4">
              You don't have any counters yet. Let's fix that!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => createCounter.mutate()}
            >
              + Create Counter
            </button>
          </>
        ) : (
          <>
            <p className="text-base-content/70 mb-4">
              You have {counters.length} counter{counters.length > 1 ? "s" : ""}
              .
            </p>
            <div className="grid gap-4">
              {counters.map((counter) => (
                <CounterCard key={counter.id} counter={counter} />
              ))}
            </div>
            <button
              className="btn btn-primary fixed right-6 bottom-6 rounded-full"
              onClick={() => createCounter.mutate()}
            >
              +
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default CountersPage;
