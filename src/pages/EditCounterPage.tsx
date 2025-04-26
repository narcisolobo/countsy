import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase-client";
import { useForm } from "react-hook-form";
import type { Counter } from "../types/counter";
import toast from "react-hot-toast";

function EditCounterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: counter, isLoading } = useQuery({
    queryKey: ["counter", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counters")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Counter;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ title: string; goal: number | undefined }>({
    defaultValues: {
      title: "",
      goal: undefined,
    },
  });

  const updateCounter = useMutation({
    mutationFn: async (updates: Partial<Counter>) => {
      const { error } = await supabase
        .from("counters")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Counter updated!");
      queryClient.invalidateQueries({ queryKey: ["counters"] });
      navigate("/counters");
    },
    onError: () => {
      toast.error("Update failed.");
    },
  });

  const onSubmit = (data: { title: string; goal?: number }) => {
    updateCounter.mutate({
      title: data.title,
      goal: data.goal ?? null, // Database expects null, not undefined
    });
  };

  // When counter loads, reset the form values
  if (counter) {
    reset({
      title: counter.title,
      goal: counter.goal ?? undefined,
    });
  }

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!counter) return <div className="p-4">Counter not found.</div>;

  return (
    <section className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Edit Counter</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          className="input input-bordered"
          {...register("title", { required: true })}
          placeholder="Counter title"
        />
        <input
          type="number"
          className="input input-bordered"
          {...register("goal", { valueAsNumber: true })}
          placeholder="Goal (optional)"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/counters")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditCounterPage;
