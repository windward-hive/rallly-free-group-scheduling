import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { validEmail } from "utils/form-validation";

import Button from "@/components/button";
import Magic from "@/components/icons/magic.svg";

const LoginForm: React.VoidFunctionComponent = () => {
  const { register, formState, handleSubmit, getValues } =
    useForm<{ email: string }>();

  const router = useRouter();
  return (
    <div className="flex">
      <div className="hidden items-center rounded-tl-lg rounded-bl-lg bg-slate-50 p-6 md:flex">
        <Magic className="h-24 text-slate-300" />
      </div>
      <div className="w-96 p-6">
        <div className="mb-2 text-xl font-semibold">Login via magic link</div>
        {!formState.isSubmitSuccessful ? (
          <form
            onSubmit={handleSubmit(async ({ email }) => {
              await axios.post("/api/login", { email, path: router.asPath });
            })}
          >
            <div className="mb-2 text-slate-500">
              We&apos;ll send you an email with a magic link that you can use to
              login.
            </div>
            <input
              autoFocus={true}
              readOnly={formState.isSubmitting}
              className={clsx("input mb-4 w-full", {
                "input-error": formState.errors.email,
              })}
              placeholder="john.doe@email.com"
              {...register("email", { validate: validEmail })}
            />
            {formState.errors.email ? <div>Please </div> : null}
            <div className="flex space-x-3">
              <Button
                htmlType="submit"
                loading={formState.isSubmitting}
                type="primary"
              >
                Send me a magic link
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div className="text-slate-500">A magic link has been sent to:</div>
            <div className="font-mono text-indigo-500">
              {getValues("email")}
            </div>
            <div className="mt-2 text-slate-500">Please check you inbox.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;