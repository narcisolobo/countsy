import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, ArrowBigLeftDash, Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { supabase } from "../lib/supabase-client";
import type { Counter } from "../types/counter";

function EditCounterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get all counters (or you could query one if you want to optimize later)
  const { data: counters, isLoading } = useQuery<Counter[]>({
    queryKey: ["counters"],
    queryFn: async () => {
      const { data } = await supabase.from("counters").select("*");
      return data ?? [];
    },
  });

  // Find the specific counter
  const counter = counters?.find((c) => c.id === id);

  // Form
  const { control, handleSubmit, reset } = useForm<Counter>({
    defaultValues: {
      title: "",
      goal: undefined,
      value: undefined,
    },
  });

  // When counter loads, reset form
  useEffect(() => {
    if (counter) {
      reset({
        title: counter.title ?? "",
        goal: counter.goal ?? undefined,
        value: counter.value ?? undefined,
      });
    }
  }, [counter, reset]);

  const onSubmit = async (data: Counter) => {
    if (!id) return;

    const { error } = await supabase
      .from("counters")
      .update({
        title: data.title,
        goal: data.goal,
        value: data.value,
      })
      .eq("id", id);

    if (!error) {
      await queryClient.invalidateQueries({ queryKey: ["counters"] });
      navigate("/counters");
    } else {
      console.error(error.message);
      // You could show a toast error here if you want
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!counter) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p>Counter not found.</p>
      </div>
    );
  }

  return (
    <section id="edit-form" className="mx-auto min-h-[70vh] max-w-5xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Edit Counter</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-200 mx-auto flex max-w-2xl flex-col gap-4 rounded-lg p-6 shadow-md"
      >
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">Title:</span>
          </label>
          <input
            id="title"
            type="text"
            {...control.register("title")}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="value">
            <span className="label-text">Starting count:</span>
          </label>
          <input
            id="value"
            type="number"
            {...control.register("value", { valueAsNumber: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="goal">
            <span className="label-text">Goal (optional):</span>
          </label>
          <input
            id="goal"
            type="number"
            {...control.register("goal", { valueAsNumber: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <div className="tooltip" data-tip="Back">
            <Link
              to="/counters"
              className="btn hover:btn-warning flex items-center gap-2"
            >
              <ArrowBigLeftDash />
            </Link>
          </div>
          <div className="tooltip" data-tip="Archive counter">
            <button className="btn hover:btn-error" type="button">
              <Archive />
            </button>
          </div>
          <div className="tooltip" data-tip="Save changes">
            <button className="btn btn-primary" type="submit">
              <Save />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default EditCounterPage;
