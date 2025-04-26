import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase-client";
import type { Counter } from "../../types/counter";

interface CounterCardProps {
  counter: Counter;
}

type UpdateContext = { previous?: Counter[] };

function CounterCard({ counter }: CounterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(counter.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const titleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const { error } = await supabase
        .from("counters")
        .update({ title: newTitle })
        .eq("id", counter.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counters"] });
    },
    onError: () => {
      toast.error("Failed to update title");
      setDraftTitle(counter.title); // rollback
    },
  });

  const updateCounter = useMutation<
    Counter, // mutation result
    Error,
    { newValue: number },
    UpdateContext
  >({
    mutationFn: async ({ newValue }) => {
      const { data, error } = await supabase
        .from("counters")
        .update({ value: newValue })
        .eq("id", counter.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onMutate: async ({ newValue }) => {
      await queryClient.cancelQueries({ queryKey: ["counters"] });

      const previous = queryClient.getQueryData<Counter[]>(["counters"]);

      queryClient.setQueryData<Counter[]>(["counters"], (old) =>
        old?.map((c) => (c.id === counter.id ? { ...c, value: newValue } : c)),
      );

      return { previous };
    },

    onError: (_error, _variables, context: UpdateContext | undefined) => {
      toast.error("Failed to update counter");
      queryClient.setQueryData(["counters"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["counters"] });
    },
  });

  return (
    <div className="card bg-base-100 border-base-200 border shadow-md">
      <div className="card-body p-4">
        {isEditing ? (
          <input
            ref={inputRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              if (draftTitle !== counter.title) {
                titleMutation.mutate(draftTitle);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                inputRef.current?.blur();
              }
              if (e.key === "Escape") {
                setDraftTitle(counter.title);
                setIsEditing(false);
              }
            }}
            className="input input-sm w-full font-semibold"
            autoFocus
          />
        ) : (
          <h3
            className="cursor-pointer text-xl font-semibold"
            onClick={() => setIsEditing(true)}
          >
            {counter.title}
          </h3>
        )}

        <p className="text-base-content/70">
          Current value: <span className="font-medium">{counter.value}</span>
        </p>

        {counter.goal !== null && (
          <p className="text-base-content/50 text-sm">Goal: {counter.goal}</p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            className="btn btn-sm btn-outline"
            onClick={() =>
              updateCounter.mutate({ newValue: (counter.value ?? 0) - 1 })
            }
            disabled={updateCounter.isPending}
          >
            -
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() =>
              updateCounter.mutate({ newValue: (counter.value ?? 0) + 1 })
            }
            disabled={updateCounter.isPending}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default CounterCard;
