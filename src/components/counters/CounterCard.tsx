import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore, Minus, PencilLine, Plus } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { supabase } from "../../lib/supabase-client";
import type { Counter } from "../../types/counter";
import ArchiveModal from "../ui/ArchiveModal";
import ArchiveCounter from "./ArchiveCounter";

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
      {/* card header */}
      <div className="border-base-content/10 flex justify-center border-b px-4 py-2">
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
          <div className="tooltip" data-tip="Edit title">
            <h3
              className="card-title cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {counter.title}
            </h3>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="border-base-content/10 flex-2 border-r p-4">
          {/* counter value */}
          <p className="text-base-content/70">
            <span className="text-8xl">{counter.value}</span>
          </p>
          {/* decrement/increment buttons */}
          <div className="mt-4 flex justify-center gap-4">
            <div className="tooltip" data-tip="decrease">
              <button
                className="btn btn-circle btn-ghost"
                onClick={() =>
                  updateCounter.mutate({ newValue: (counter.value ?? 0) - 1 })
                }
                disabled={updateCounter.isPending}
              >
                <Minus />
              </button>
            </div>
            <div className="tooltip" data-tip="increase">
              <button
                className="btn btn-circle btn-ghost"
                onClick={() =>
                  updateCounter.mutate({ newValue: (counter.value ?? 0) + 1 })
                }
                disabled={updateCounter.isPending}
              >
                <Plus />
              </button>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col justify-center p-4">
          <p className="text-base-content/70">
            Goal: {counter.goal !== null ? counter.goal : `n/a`}
          </p>
          <div className="tooltip" data-tip="edit counter">
            <Link
              to={`/counters/${counter.id}/edit`}
              className="btn btn-circle btn-ghost text-base-content/70 hover:text-base-content"
            >
              <PencilLine size={28} />
            </Link>
          </div>
          <ArchiveCounter counter={counter} />
        </div>
      </div>
      <ArchiveModal counter={counter} />
    </div>
  );
}

export default CounterCard;
