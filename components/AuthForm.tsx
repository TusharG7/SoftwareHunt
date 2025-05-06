"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
  SubmitHandler,
  Path,
} from "react-hook-form";
import { ZodType } from "zod";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getSession, useSession } from "next-auth/react";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<
    | {
        succes: boolean;
        error: any;
        success?: undefined;
      }
    | {
        success: boolean;
        succes?: undefined;
        error?: undefined;
      }
    | {
        success: boolean;
        error: string;
        succes?: undefined;
      }
  >;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { data: sessionData } = useSession(); // Move useSession outside the handleSubmit method

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    console.log("result - ", result);

    if (result.success) {
      console.log("You have successfully Signed In.");

      // Fetch the latest session data
      const session = await getSession();

      // Check the user's role from the session
      if (session?.user?.role === "ADMIN") {
        router.refresh();
        router.push("/admin");
      } else if (session?.user?.role === "VENDOR") {
        router.refresh();
        router.push("/vendor");
      } else {
        console.log("Unknown role. Redirecting to default page.");
        router.push("/"); // Redirect to a default page if the role is unknown
      }
    } else {
      setMessage(result.error);
      setTimeout(() => {
        setMessage("");
      }, 3000);
      console.log("Some Sign In Error - ", result.error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 w-full"
              >
                {Object.keys(defaultValues).map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as Path<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            type={
                              FIELD_TYPES[
                                field.name as keyof typeof FIELD_TYPES
                              ]
                            }
                            {...field}
                            className="form-input"
                          />
                        </FormControl>
                        {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {message && (
              <p className="block py-2 text-left text-sm text-red-600 bg-red-100 rounded px-2">
                {message}
              </p>
            )}
                <Button type="submit" className="form-btn w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
